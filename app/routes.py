from flask import request, jsonify, Blueprint, render_template
from app.models import Host  # Assuming you have these models defined as shown earlier
from mongoengine.errors import ValidationError, NotUniqueError
from bson.objectid import ObjectId
from mongoengine import InvalidQueryError
from dateutil import parser
import requests
import json
import re

# Define the Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def index():
    # Fetch all hosts from the database
    hosts = Host.objects.all()  # This fetches all Host records
    return render_template('index.html', hosts=hosts)

@main.route('/media', methods=['GET'])
def get_media():
    media_list = Media.objects()
    return jsonify(media_list), 200

@main.route('/media/add', methods=['POST'])
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

@main.route('/media/<id>', methods=['GET'])
def get_media_by_id(id):
    media = Media.objects(id=id).first()
    if not media:
        return jsonify({'error': 'Media not found'}), 404
    return jsonify(media), 200

@main.route('/media/update/<id>', methods=['PUT'])
def update_media(id):
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

@main.route('/media/delete/<id>', methods=['DELETE'])
def delete_media(id):
    media = Media.objects(id=id).first()
    if not media:
        return jsonify({'error': 'Media not found'}), 404
    
    media.delete()
    return jsonify({"message": "Media deleted successfully"}), 200

@main.route('/groups', methods=['GET'])
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
                    "username": host.username,  # Changed from 'user' to 'username'
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

@main.route('/groups/add', methods=['POST'])
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

@main.route('/groups/update/<id>', methods=['PUT'])
def update_group(id):
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
    
@main.route('/groups/delete/<id>', methods=['DELETE'])
def delete_group(id):
    group = Group.objects(id=id).first()
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    group.delete()
    return jsonify({"message": "Group deleted successfully"}), 200

@main.route('/hosts', methods=['GET'])
def get_hosts():
    hosts = Host.objects()
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
            "os": host.os
        }
        host_list.append(host_data)
    return jsonify(host_list), 200

@main.route('/hosts/add', methods=['POST'])
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

@main.route('/hosts/update/<id>', methods=['PUT'])
def update_host(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404
    
    try:
        host.update(**{k: v for k, v in request.json.items() if v is not None})
        return jsonify({"message": "Host updated successfully"}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred updating the host: {}'.format(str(e))}), 500

@main.route('/hosts/delete/<id>', methods=['DELETE'])
def delete_host(id):
    host = Host.objects(id=id).first()
    if not host:
        return jsonify({'error': 'Host not found'}), 404
    
    host.delete()
    return jsonify({"message": "Host deleted successfully"}), 200

@main.route('/schedules', methods=['GET'])
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

@main.route('/schedules/add', methods=['POST'])
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

@main.route('/schedules/update/<id>', methods=['PUT'])
def update_schedule(id):
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

@main.route('/schedules/delete/<id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.objects(id=id).first()
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404

    schedule.delete()
    return jsonify({"message": "Schedule deleted successfully"}), 200

@main.route('/notify/hosts/<id>', methods=['POST'])
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
        return jsonify({'error': f'HTTP error occurred: {str(e)}'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON from Kodi'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
@main.route('/image/hosts/<id>', methods=['POST'])
def display_image_host(id):
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
    
@main.route('/youtube/hosts/<id>', methods=['POST'])
def play_youtube_video(id):
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

@main.route('/audio/hosts/<id>', methods=['POST'])
def play_audio(id):
    return play_media(id, "audio")

@main.route('/video/hosts/<id>', methods=['POST'])
def play_video(id):
    return play_media(id, "video")

def play_media(id, media_type):
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


#####################
# Standard Handling #
#####################

@main.app_errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404

@main.app_errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
