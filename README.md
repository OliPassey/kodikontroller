![KodiKontroller Logo](https://github.com/OliPassey/kodikontroller/raw/master/logo.PNG)
## by Oliver Passey
### Current Status: Restarted over December 2022.

### Usage

This is the control part of an office dashboard display system, utilising Kodi.
The PHP code should be install on a webserver, and accessed from a web-browser within the same network as the Kodi instances, commands are sent via the browser currently and so network access must be available.

Kodi should be set up as usual and a user / pass set on the web browser. Details of each Kodi instance should be added to the kodi_endpoints.json file and are then referenced through the browser. 

Everything is very manual at the moment, but the long term goal is to build a scheduler to automate display, and then the use case is to use this app for one-off notifications or amending the schedule.

Longer term is to build an API so alerting platforms can call and display alerts on screen.

### New To Do List;
MVP Level GUI for sending 
- [x] YouTube links to instances
- [x] Notifications
- [x] Multiple endpoints
- [ ] Image Content for Dashboarding (Url based for now)
- [ ] Auto Generated Video Notifications with FFMPEG
- [ ] Auto Generated Image with text overlay Notifications
- [ ] Some level of templating for usability
- [ ] Lower Third Notifications from Native Kodi Notifications (Kodi Addon / SKin)
- [ ] Adding and removing nodes from GUI
- [ ] Add a default playlist for when no content exists in the system
- [ ] Ability to add instances to groups, and target groups.
- [ ] "Open Hours" to stop content and shut off screens (HDMI-CEC)

### Scheduler
In order for the scheduler to work you must set a cron entry to hit scheduler.php every minute (or whatever frequency you wish)
* * * * * /usr/local/bin/php /path/to/scheduler.php

Note this is a work in progress feature and is currently not working.

### Help!
I am not a developer, I like to tinker with code - if you want to see a project like this exist and are able to offer some assistance, please get in contact. 