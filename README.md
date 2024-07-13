## Kodi Kontroller v4 (ish) 
### by Oliver Passey
v4.0
![image](https://github.com/OliPassey/kodikontroller/assets/7745805/66125687-3568-4da6-ba1a-cf25535f25f6)

v4.0.5
![image](https://github.com/OliPassey/kodikontroller/assets/7745805/5760b7e3-207d-45ae-8896-898729e4814e)

v4.0.7
![image](https://github.com/OliPassey/kodikontroller/assets/7745805/ff677022-fc81-4f27-a8e1-04a7114c2106)

### Current Status: 
Kodi Controls are working, Media Mgmt is in progress but the basics work. It is very rough around the edges but i'm working quickly to get things to a stable point. 
Please do not treat this as production ready yet, it should be noted there is zero authentication on this app and it should be secured by other means - it can change content on big displays ffs...

In order to get this going you will need to host your own MongoDB server and add the below variables to the Docker container, you will also need to expose port 5000 in the container.   
Docker Hub: olipassey/kodikontroller
Variables to add / define; 
- MONGODB_DB
- MONGODB_HOST
- MONGODB_PORT
- MONGODB_USERNAME (Optional)
- MONGODB_PASSWORD (Optional)
- MONGODB_AUTH_SOURCE (Defaults to admin)

Path to add / define
/screenshots must map to a centrally available location that all kodi hosts can write screenshots to.

### Screenshots
If you click on the Kodi logo for any host it will attempt a screenshot of the kodi instance and display it for 10s.
To enable the screenshot functionality you should add a docker path for /screenshots to a centrally available location. This is new functionality and requires some clunky manual setup and has only been tested with Windows based Kodi clients pushing screenshots to a mapped network drive (that appears local to Kodi) there is rumour screenshots cannot be saved to a network location but YMMV. 
All Kodi clients should then be pointed to that dir for screenshots Kodi Setting > System > Logging > Screenshot folder they should point to a unique folder named for each hostid. 
This should appear in the container as /screenshots/<hostID>/screenshot00001.png etc 
You can retrieve the hostIDs by calling http://<your-domain>/admin/hosts

### Usage 
This is the control part of an office dashboard display system, utilising Kodi connected to large monitors & TVs. It was designed with offices in mind but it will be useful anywhere you need to manage multiple screens.  
Once you have the docker container running and connected to MongoDB you should add your Kodi Hosts and some media. 
In it's default state all controls are manual, but a scheduling component exists here: https://github.com/OliPassey/kodikontroller-celery/tree/main

Kodi should be set up as usual and a user / pass set on the web control / api. Details of each Kodi instance should be added via the admin interface (button, top right)
Everything is very manual at the moment, but the long term goal is to build a scheduler to automate display, and then the use case is to use this app for one-off notifications or amending the schedule.

### New New (2024) To Do List;
- [x] Media Management MVP
- [x] Schedule Runner (Celery) Basics
- [ ] Schedule Runner Automation of playlists (In Progress)
- [ ] Sort layout for non 1440p resolutions (sorry)
- [ ] Playlists, Groups
- [x] Screenshot
- [x] Hide Offline Hosts
- [x] YouTube links to instances
- [x] Notifications
- [x] Multiple endpoints
- [x] Adding and removing nodes from GUI
- [x] Play Image Content for Dashboarding (Url based for now)
- [ ] Auto Generated Video Notifications with FFMPEG
- [ ] Auto Generated Image with text overlay Notifications
- [ ] Lower Third Notifications from Native Kodi Notifications (Kodi Addon / SKin)
- [ ] Add a default playlist for when no content exists in the system
- [x] Ability to add instances to groups,
- [ ] and target groups.
- [ ] "Open Hours" to stop content and shut off screens (HDMI-CEC)
- [ ] Incoming webhook notification mapping

### Help!
I am not a developer, I like to tinker with code - if you want to see a project like this exist and are able to offer some assistance, please get in contact. Oli @ Infosec.Exchange (Mastodon) oli @ olipassey . me .uk (email)

### API Routes n stuff
| Route                              | Function                | Description                                                                                      |
|------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------|
| /                                  | index                   | Renders the main index page with lists of hosts and media.                                        |
| /admin/media                       | get_media               | Retrieves a list of all media items and details.                                                  |
| /admin/media/youtube               | get_youtube_media       | Fetches all YouTube media items.                                                                  |
| /admin/media/video                 | get_video_media         | Fetches all video media items, providing URLs or paths.                                            |
| /admin/media/audio                 | get_audio_media         | Retrieves all audio media items and their URLs.                                                    |
| /admin/media/image                 | get_image_media         | Fetches all image media items and their URLs.                                                      |
| /admin/media/add                   | add_media               | Adds a new media item, handling unique and validation errors.                                      |
| /admin/media/<id>                  | get_media_by_id         | Fetches a specific media item by ID.                                                               |
| /admin/media/update/<id>           | update_media_by_id      | Updates a specific media item by ID, handling errors.                                              |
| /admin/media/delete/<id>           | delete_media_by_id      | Deletes a specific media item by ID.                                                               |
| /admin/groups                      | get_groups              | Retrieves a list of all groups and their details.                                                  |
| /admin/groups/add                  | add_group               | Adds a new group, handling unique constraint and validation errors.                                 |
| /admin/groups/update/<id>          | update_group_by_id      | Updates a specific group by ID, handling various errors.                                           |
| /admin/groups/delete/<id>          | delete_group_by_id      | Deletes a specific group by ID.                                                                    |
| /admin/hosts                       | get_hosts               | Retrieves a list of all hosts with their detailed information.                                     |
| /admin/hosts/<id>                  | get_host_by_id          | Fetches a specific host by ID.                                                                     |
| /admin/hosts/add                   | add_host                | Adds a new host and optionally triggers a media playback.                                           |
| /admin/hosts/update/<id>           | update_host_by_id       | Updates a specific host by ID, handling errors during the update.                                   |
| /admin/hosts/delete/<id>           | delete_host_by_id       | Deletes a specific host by ID.                                                                     |
| /admin/schedules                   | get_schedules           | Retrieves all schedules with their detailed information.                                            |
| /admin/schedules/add               | add_schedule            | Adds a new schedule, handling date parsing and other errors.                                        |
| /admin/schedules/update/<id>       | update_schedule_by_id   | Updates a specific schedule by ID, handling various errors.                                         |
| /admin/schedules/delete/<id>       | delete_schedule_by_id   | Deletes a specific schedule by ID.                                                                 |
| /ctrl/notify/hosts/<id>            | notify_host             | Sends a notification to a specific host, handling command sending errors.                           |
| /ctrl/image/hosts/<id>             | display_image_host      | Initiates image display on a specific host, handling command sending errors.                        |
| /ctrl/youtube/hosts/<id>           | play_youtube_video      | Initiates YouTube video playback on a specific host, managing video ID extraction and command sending.|
| /ctrl/audio/hosts/<id>             | play_audio              | Plays audio media on a specific host.                                                              |
| /ctrl/video/hosts/<id>             | play_video              | Plays video media on a specific host.                                                              |
| /ctrl/stop/<id>                    | stop_playback           | Stops all media playback on a specific host.                                                        |
| /admin/playlists                    | get_playlists          | Retrieves all playlists with their content details.                                                 |
| /admin/playlists/<id>               | get_playlist_by_id     | Retrieves a specific playlist by ID.                                                                |
| /admin/playlists/add                | add_playlist           | Adds a new playlist, handling media ID validations and creation time setting.                        |
| /admin/playlists/update/<id>        | update_playlist_by_id  | Updates a specific playlist by ID, managing media items and descriptions.                            |
| /admin/playlists/delete/<id>        | delete_playlist_by_id  | Deletes a specific playlist by ID.                                                                   |
| /admin/host_status                 | check_host_status       | Checks and updates the status of all hosts, handling request errors and status updates.             |
| /admin/ctrl/kodi/screenshot/<id>   | take_kodi_screenshot    | Takes a screenshot on a specific host, handling command sending and response parsing.               |
| /admin/ctrl/kodi/screenshot/latest/<host_id> | get_latest_screenshot | Retrieves the latest screenshot for a specific host, managing directory access and file sorting.    |
| /screenshots/<host_id>/<filename>  | get_screenshot          | Returns an image file from the specified directory.                                                 |
| /404                               | not_found_error         | Handles 404 errors by returning a JSON response.                                                    |
| /500                               | internal_error          | Handles 500 errors by returning a JSON response.                                                    |

### Operational Modes
Kodi Kontroller is being designed to work in a few different scenarios / envrionments. The current thinking is;

1. Manual Mode (main template)

    Functionality: Full manual control with no automation. Users manually control all aspects of media playback, settings, and configurations.
    UI Elements:
        Full access to all control elements.
        Buttons and interfaces for manual playback of audio, video, and images.
        Manual scheduling options and immediate overrides.
    Use Case: Ideal for environments where detailed, moment-to-moment control is necessary, such as in a production setting or when syncing media with live events.

2. Auto Mode

    Functionality: Fully automated, schedule-driven operation. The system autonomously follows a preset schedule without user intervention.
    UI Elements:
        Minimal UI with display of current and upcoming schedules.
        Group, Media, Playlist, Schedule Mgmt.
        No manual control interfaces, beyond assigning host to schedules etc.
        Status indicators showing current playback and what’s next according to the schedule.
    Use Case: Best for environments like digital signage where the system needs to operate independently once schedules are set, such as in transit systems or automated advertising displays.

4. Home Mode

    Functionality: Primarily displays image media. Can be interrupted for manual overrides but generally runs a pre-defined set of visual content.
    UI Elements:
        Simplified interface focusing on image display.
        Optional manual override controls for playing specific media or playlists.
        Background music control if applicable.
        Potential Home Assistant intergration.
    Use Case: Suited for home environments where the system might display art, personal photos, or ambient video without requiring frequent interaction. I'd like to be able to render webpages such as Magic Mirror for display, but this will be screenshots at best as Kodi does not have a browser.

5. Retail Mode

    Functionality: Focuses on playing slideshows of folders containing images and videos during operational hours. Can be set to turn off or display static images outside of business hours.
    UI Elements:
        Schedule setup for operational hours.
        Folder-based media organization for easy slideshow setup.
        Controls for setting duration and transitions of slideshows.
    Use Case: Retail settings where dynamic advertisements or informational displays are necessary during business hours.

6. Office Mode

    Functionality: Primarily runs image slideshows but includes capabilities for live notifications and interrupts such as text notifications or video announcements.
    UI Elements:
        Slideshow controls and setup.
        Notification management interface for scheduling and immediate pushing of text or video notifications.
        Display of current status and content, with options for immediate interruption or updates.
    Use Case: Office environments where internal communications and ambient display media are needed, such as company announcements, news, or webhook based notifications alongside visual media.
