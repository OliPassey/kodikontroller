from flask import request, jsonify, Blueprint, render_template
from app.models import Host, Group, Schedule, Playlist, Media
from mongoengine.errors import ValidationError, NotUniqueError
from bson.objectid import ObjectId
from mongoengine import InvalidQueryError
from dateutil import parser
from flask import Flask, request, send_file, render_template, redirect, url_for
from flask import send_from_directory
import requests
import json
import re
import os


# Define the Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def index():
    hosts = Host.objects(status__in=["active", "inactive"])
    media = Media.objects.all()
    return render_template('index.html', hosts=hosts, media=media)

@main.route('/admin/media', methods=['GET'])
def get_media():
    media_list = Media.objects()
    # Manually construct a list of dictionaries representing each media item
    media_list_dict = []
    for item in media_list:
        media_data = {
            "id": str(item.id),
            "name": item.name,
            "description": item.description,
            "type": item.type,
            "path": item.path,
            "url": item.url
        }
        media_list_dict.append(media_data)
    return jsonify(media_list_dict), 200

@main.route('/admin/media/youtube')
def get_youtube_media():
    youtube_media = Media.objects(type='youtube')
    return jsonify([{ 'name': media.name, 'url': media.url } for media in youtube_media]), 200

@main.route('/admin/media/video')
def get_video_media():
    video_media = Media.objects(type='video')
    return jsonify([{ 'name': media.name, 'url': media.url } for media in video_media]), 200

@main.route('/admin/media/audio')
def get_audio_media():
    audio_media = Media.objects(type='audio')
    return jsonify([{ 'name': media.name, 'url': media.url } for media in audio_media]), 200

@main.route('/admin/media/image')
def get_image_media():
    image_media = Media.objects(type='image')
    return jsonify([{ 'name': media.name, 'url': media.url } for media in image_media]), 200

@main.route('/admin/media/add', methods=['POST'])
def add_media():
    try:
        new_media = Media(
            name=request.json.get('name'),
            description=request.json.get('description'),
            path=request.json.get('path'),
            url=request.json.get('url'),
            type=request.json.get('type')
        )
        new_media.save()
        return jsonify({"message": "Media added successfully"}), 201
    except NotUniqueError:
        return jsonify({"error": "A media item with the specified unique attribute already exists"}), 400
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@main.route('/admin/media/<id>', methods=['GET'])
def get_media_by_id(id):
    media = Media.objects(id=id).first()
    if not media:
        return jsonify({'error': 'Media not found'}), 404
    return jsonify(media), 200

@main.route('/admin/media/update/<id>', methods=['PUT'])
def update_media_by_id(id):
    media = Media.objects(id=id).first()
    if not media:
        return jsonify({'error': 'Media not found'}), 404

    # Attempt to update each field only if it exists in the request
    try:
        if 'name' in request.json:
            media.name = request.json['name']
        if 'description' in request.json:
            media.description = request.json['description']
        if 'path' in request.json:
            media.path = request.json['path']
        if 'url' in request.json:
            media.url = request.json['url']
        if 'type' in request.json:
            media.type = request.json['type']
        media.save()  # Use save() instead of update() for direct assignment
    except IndexError as e:
        # Log the error or handle it appropriately
        return jsonify({'error': 'Failed to update media: {}'.format(str(e))}), 500
    except Exception as e:
        # General exception catch if other errors occur
        return jsonify({'error': 'An error occurred: {}'.format(str(e))}), 500

    return jsonify({"message": "Media updated successfully"}), 200

@main.route('/admin/media/delete/<id>', methods=['DELETE'])
def delete_media_by_id(id):
    media = Media.objects(id=id).first()
    if not media:
        return jsonify({'error': 'Media not found'}), 404
    
    media.delete()
    return jsonify({"message": "Media deleted successfully"}), 200

@main.route('/admin/groups', methods=['GET'])
def get_groups():
    groups = Group.objects()
    groups_list = []
    for group in groups:
        members = []
        for member in group.members:
            host = Host.objects(id=member.id).first()
            if host:
                members.append({
                    "id": str(host.id),
                    "name": host.name,
                    "ip": host.ip,
                    "port": host.port,
                    "username": host.username,
                    "status": host.status,
                    "location": host.location,
                    "os": host.os,
                    "cec": host.cec
                })

        group_data = {
            "name": group.name,
            "id": str(group.id),
            "description": group.description,
            "members": members
        }
        groups_list.append(group_data)

    return jsonify(groups_list), 200

@main.route('/admin/groups/add', methods=['POST'])
def add_group():
    try:
        new_group = Group(
            name=request.json.get('name'),
            description=request.json.get('description'),
            members=request.json.get('members', [])  # IDs of Hosts
        )
        new_group.save()
        return jsonify({"message": "Group added successfully"}), 201
    except NotUniqueError:
        return jsonify({"error": "A group with the specified name already exists"}), 400
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@main.route('/admin/groups/update/<id>', methods=['PUT'])
def update_group_by_id(id):
    group = Group.objects(id=id).first()
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    try:
        data = request.get_json()
        if 'name' in data:
            group.name = data['name']
        if 'description' in data:
            group.description = data['description']
        if 'members' in data:
            # Convert string IDs in the members list to ObjectId instances
            member_ids = [ObjectId(member_id) for member_id in data['members']]
            group.members = member_ids

        group.save()
        return jsonify({"message": "Group updated successfully"}), 200
    except ValidationError as e:
        return jsonify({'error': f'Validation Error: {str(e)}'}), 400
    except NotUniqueError:
        return jsonify({'error': 'Group name must be unique'}), 400
    except InvalidQueryError as e:
        return jsonify({'error': f'Invalid Query Error: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
@main.route('/admin/groups/delete/<id>', methods=['DELETE'])
def delete_group_by_id(id):
    group = Group.objects(id=id).first()
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    group.delete()
    return jsonify({"message": "Group deleted successfully"}), 200

@main.route('/admin/hosts', methods=['GET'])
def get_hosts():
    # Fetch hosts with "active" or "inactive" status
    hosts = Host.objects(status__in=["active", "inactive"])

    # Manually construct a list of dictionaries representing each host
    host_list = []
    for host in hosts:
        host_data = {
            "id": str(host.id),
            "name": host.name,
            "ip": host.ip,
            "port": host.port,
            "username": host.username,
            "password": host.password,
            "location": host.location,
            "group": host.group,
            "cec": host.cec,
            "os": host.os,
            "status": host.status  # Include the "status" field
        }
        host_list.append(host_data)
    return jsonify(host_list), 200


@main.route('/admin/hosts/<id>', methods=['GET'])
def get_host_by_id(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404
    return jsonify(host), 200


@main.route('/admin/hosts/add', methods=['POST'])
def add_host():
    try:
        new_host = Host(
            name=request.json.get('name'),
            ip=request.json.get('ip'),
            port=request.json.get('port'),
            username=request.json.get('username'),
            password=request.json.get('password'),
            group=request.json.get('group'),  # ID of the Group
            cec=request.json.get('cec'),
            status=request.json.get('status'),
            schedule=request.json.get('schedule'),  # ID of the Schedule
            os=request.json.get('os'),
            location=request.json.get('location')
        )
        new_host.save()
        return jsonify({"message": "Host added successfully"}), 201
    except NotUniqueError:
        return jsonify({"error": "A host with the specified name already exists"}), 400
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

@main.route('/admin/hosts/update/<id>', methods=['PUT'])
def update_host_by_id(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404
    
    try:
        host.update(**{k: v for k, v in request.json.items() if v is not None})
        return jsonify({"message": "Host updated successfully"}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred updating the host: {}'.format(str(e))}), 500

@main.route('/admin/hosts/delete/<id>', methods=['DELETE'])
def delete_host_by_id(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404
    
    host.delete()
    return jsonify({"message": "Host deleted successfully"}), 200

@main.route('/admin/schedules', methods=['GET'])
def get_schedules():
    schedules = Schedule.objects()
    schedules_list = [{
        'id': str(schedule.id),
        'name': schedule.name,
        'description': schedule.description,
        'start_date': schedule.startDate.isoformat(),
        'end_date': schedule.endDate.isoformat(),
        'shuffle': schedule.shuffle,
        'playlist': [{'id': str(media.id), 'title': media.name} for media in schedule.playlist]
    } for schedule in schedules]
    return jsonify(schedules_list), 200

@main.route('/admin/schedules/add', methods=['POST'])
def add_schedule():
    try:
        startDate = parser.parse(request.json['startDate'])
        endDate = parser.parse(request.json['endDate'])

        new_schedule = Schedule(
            name=request.json['name'],
            description=request.json.get('description', ''),
            startDate=startDate,
            endDate=endDate,
            shuffle=request.json.get('shuffle', False),
            playlist=[Media.objects(id=ObjectId(media_id)).first() for media_id in request.json.get('playlist', [])]
        )
        new_schedule.save()
        return jsonify({"message": "Schedule added successfully"}), 201
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except ValueError as e:  # Catch parsing errors
        return jsonify({"error": f"Date parsing error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@main.route('/admin/schedules/update/<id>', methods=['PUT'])
def update_schedule_by_id(id):
    schedule = Schedule.objects(id=id).first()
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404

    try:
        schedule.update(
            set__name=request.json.get('name', schedule.name),
            set__description=request.json.get('description', schedule.description),
            set__startDate=request.json.get('startDate', schedule.startDate),
            set__endDate=request.json.get('endDate', schedule.endDate),
            set__shuffle=request.json.get('shuffle', schedule.shuffle),
            set__playlist=[Media.objects(id=media_id).first() for media_id in request.json.get('playlist', [])]
        )
        return jsonify({"message": "Schedule updated successfully"}), 200
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred updating the schedule: ' + str(e)}), 500

@main.route('/admin/schedules/delete/<id>', methods=['DELETE'])
def delete_schedule_by_id(id):
    schedule = Schedule.objects(id=id).first()
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404

    schedule.delete()
    return jsonify({"message": "Schedule deleted successfully"}), 200

@main.route('/ctrl/notify/hosts/<id>', methods=['POST'])
def notify_host(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    # Extract the necessary data from the JSON payload
    headline = request.json.get('headline')
    msg = request.json.get('message')
    duration = request.json.get('duration', 5000)  # Default duration is 5000 ms
    image = request.json.get('image', 'info')  # Default image is 'info'

    # Construct the Kodi JSON-RPC command
    command = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "GUI.ShowNotification",
        "params": {
            "title": headline,
            "message": msg,
            "image": image,
            "displaytime": duration
        }
    }

    # Convert the command dictionary to a JSON string
    json_command = json.dumps(command)

    # Build the complete URL with authentication and port
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"

    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=headers, data=json_command)
        response.raise_for_status()  # This checks for HTTP errors
        return jsonify({"message": "Notification sent successfully", "response": response.json()}), 200
    except requests.exceptions.HTTPError as e:
        app.logger.error(f'HTTP error occurred: {str(e)}')
        return jsonify({'error': f'HTTP error occurred: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        app.logger.error(f'Request failed: {str(e)}')
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except json.JSONDecodeError:
        app.logger.error('Failed to decode JSON from Kodi')
        return jsonify({'error': 'Failed to decode JSON from Kodi'}), 500
    except Exception as e:
        app.logger.error(f'An error occurred: {str(e)}')
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main.route('/ctrl/image/hosts/<id>', methods=['POST'])
def display_image_host(id):
    stop_playback(id)
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    # Extract the image URL from the JSON payload
    image_url = request.json.get('image_url')
    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400

    # Construct the Kodi JSON-RPC command to display the image
    command = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "Player.Open",
        "params": {
            "item": {
                "file": image_url
            }
        }
    }

    # Convert the command dictionary to a JSON string
    json_command = json.dumps(command)

    # Build the complete URL with authentication and port
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"

    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=headers, data=json_command)
        response.raise_for_status()  # This checks for HTTP errors
        return jsonify({"message": "Image display initiated successfully", "response": response.json()}), 200
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': f'HTTP error occurred: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON from Kodi'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main.route('/ctrl/youtube/hosts/<id>', methods=['POST'])
def play_youtube_video(id):
    stop_playback(id)
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    youtube_url = request.json.get('youtube_url')
    if not youtube_url:
        return jsonify({'error': 'YouTube URL is required'}), 400

    # Extract video ID from URL
    video_id = extract_youtube_id(youtube_url)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube URL'}), 400

    # Construct the Kodi JSON-RPC command to play the YouTube video
    command = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "Player.Open",
        "params": {
            "item": {
                "file": f"plugin://plugin.video.youtube/play/?video_id={video_id}"
            }
        }
    }

    json_command = json.dumps(command)
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"

    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=headers, data=json_command)
        response.raise_for_status()
        return jsonify({"message": "YouTube video playback initiated", "response": response.json()}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to send command: {str(e)}'}), 500

def extract_youtube_id(url):
    # Regular expression to extract the video ID from both regular and short YouTube URLs
    regex = r"(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    else:
        return None  # Return None if no video ID is found

@main.route('/ctrl/audio/hosts/<id>', methods=['POST'])
def play_audio(id):
    return play_media(id, "audio")

@main.route('/ctrl/video/hosts/<id>', methods=['POST'])
def play_video(id):
    return play_media(id, "video")

def play_media(id, media_type):
    stop_playback(id)
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    media_path = request.json.get('media_path')
    if not media_path:
        return jsonify({'error': f'{media_type.capitalize()} path is required'}), 400

    # Add "smb://" if it's a network path and missing the protocol
    if media_path.startswith("//"):
        media_path = "smb:" + media_path

    command = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "Player.Open",
        "params": {
            "item": {
                "file": media_path
            }
        }
    }

    json_command = json.dumps(command)
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, headers=headers, data=json_command)
        response.raise_for_status()  # Raises stored HTTPError, if one occurred.
        return jsonify({"message": f"{media_type.capitalize()} playback initiated", "response": response.json()}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to send command: {str(e)}'}), 500

@main.route('/ctrl/stop/<id>', methods=['POST'])
def stop_playback(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    # Define the JSON-RPC commands to stop playback on Player 1 and Player 2
    commands = [
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "Player.Stop",
            "params": {
                "playerid": 1
            }
        },
        {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "Player.Stop",
            "params": {
                "playerid": 2
            }
        }
    ]

    # Build the complete URL with authentication and port
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"

    headers = {'Content-Type': 'application/json'}
    results = []

    try:
        # Send the stop command for each player
        for command in commands:
            json_command = json.dumps(command)
            response = requests.post(url, headers=headers, data=json_command)
            response.raise_for_status()
            results.append(response.json())

        return jsonify({"message": "Playback stopped successfully", "responses": results}), 200
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': f'HTTP error occurred: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON from Kodi'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main.route('/admin/playlists/add', methods=['POST'])
def add_playlist():
    try:
        new_playlist = Playlist(
            name=request.json.get('name'),
            description=request.json.get('description', ''),
            createDate=parser.parse(request.json.get('createDate')),
            content=[
                Media(
                    name=content.get('name'),
                    description=content.get('description', ''),
                    type=content.get('type'),
                    path=content.get('path', ''),
                    url=content.get('url', '')
                ) for content in request.json.get('content', [])
            ]
        )
        new_playlist.save()
        return jsonify({"message": "Playlist added successfully"}), 201
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except ValueError as e:  # Catch parsing errors
        return jsonify({"error": f"Date parsing error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@main.route('/admin/host_status', methods=['GET'])
def check_host_status():
    hosts = Host.objects()
    results = []

    for host in hosts:
        try:
            url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"
            headers = {'Content-Type': 'application/json'}

            # Get active players
            active_players_command = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "Player.GetActivePlayers"
            }
            response = requests.post(url, headers=headers, data=json.dumps(active_players_command))
            response.raise_for_status()
            active_players = response.json().get('result', [])

            # Process each active player
            if active_players:
                host.status = 'active'
                playing_info_list = []

                for player in active_players:
                    player_id = player['playerid']
                    
                    # Get details of the current item being played by each player
                    get_item_command = {
                        "jsonrpc": "2.0",
                        "id": 1,
                        "method": "Player.GetItem",
                        "params": {
                            "playerid": player_id,
                            "properties": ["title", "album", "artist", "duration"]
                        }
                    }
                    response = requests.post(url, headers=headers, data=json.dumps(get_item_command))
                    response.raise_for_status()
                    playing_info = response.json().get('result', {}).get('item', {})

                    # Append each player's current playing title to a list
                    playing_info_list.append(playing_info.get('label', 'Unknown Media'))

                # Combine all playing titles for the host
                host.player = ", ".join(playing_info_list)
            else:
                host.status = 'inactive'
                host.player = ''

        except requests.exceptions.RequestException as e:
            host.status = 'error'
            host.player = 'Error accessing host'

        host.save()
        results.append({
            "host_id": str(host.id),
            "status": host.status,
            "playing": host.player
        })

    return jsonify(results), 200

@main.route('/admin/ctrl/kodi/screenshot/<id>', methods=['POST'])
def take_kodi_screenshot(id):
    # Stop any existing playback on the host
    stop_playback(id)

    # Retrieve the host based on the provided ID
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404

    # Construct the Kodi JSON-RPC command to take a screenshot
    command = {
        "jsonrpc": "2.0",
        "method": "Input.ExecuteAction",
        "params": {"action": "screenshot"},
        "id": 5
    }

    # Convert the command to JSON format
    json_command = json.dumps([command])

    # Construct the URL for the Kodi JSON-RPC API endpoint
    url = f"http://{host.username}:{host.password}@{host.ip}:{host.port}/jsonrpc"

    # Define headers for the HTTP request
    headers = {'Content-Type': 'application/json'}

    try:
        # Send the POST request to the Kodi JSON-RPC API endpoint
        response = requests.post(url, headers=headers, data=json_command)
        response.raise_for_status()
        return jsonify({"message": "Screenshot taken successfully", "response": response.json()}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to take screenshot: {str(e)}'}), 500

@main.route('/admin/ctrl/kodi/screenshot/latest/<host_id>', methods=['GET'])
def get_latest_screenshot(host_id):
    screenshot_dir = f'/screenshots/{host_id}/'  # Update the path to your screenshot directory
    if not os.path.isdir(screenshot_dir):
        return jsonify({'error': 'Screenshot directory not found'}), 404

    screenshot_files = [f for f in os.listdir(screenshot_dir) if f.startswith('screenshot') and f.endswith('.png')]
    if not screenshot_files:
        return jsonify({'error': 'No screenshot files found'}), 404

    # Extract and sort the numeric part of the filename to find the latest screenshot
    screenshot_numbers = [int(f.split('screenshot')[-1].split('.')[0]) for f in screenshot_files]
    latest_screenshot_number = max(screenshot_numbers)

    # Pad the number with leading zeros to ensure consistency in the filename format
    latest_screenshot_number_padded = str(latest_screenshot_number).zfill(5)  # Assuming maximum 5-digit numbering

    return jsonify({'latestScreenshotNumber': latest_screenshot_number_padded}), 200

@main.route('/screenshots/<host_id>/<filename>')
def get_screenshot(host_id, filename):
    # Define the directory where the screenshots are stored
    screenshot_dir = f'/screenshots/{host_id}/'  # Update the path to your screenshot directory

    # Return the image file from the specified directory
    return send_from_directory(screenshot_dir, filename)

#####################
# Standard Handling #
#####################

@main.app_errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@main.app_errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
