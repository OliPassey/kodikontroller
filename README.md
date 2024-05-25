![image](https://github.com/OliPassey/kodikontroller/assets/7745805/590ae22c-3e01-493b-94eb-a289f560153d)
## Kodi Kontroller v4 (ish) 
### by Oliver Passey

### Current Status: 
Kodi Controls are working, Media Mgmt is in progress  
In order to get this going you will need to sub in your own config.py with details to your MongoDB Server. I'll move this to docker env variables soon.

### Usage 
This is the control part of an office dashboard display system, utilising Kodi connected to large monitors & TVs. It was designed with offices in mind but it will be useful anywhere you need to manage multiple screens.  
It was originally written in PHP but is now Python Flask and runs from a single Docker container (olipassey/kodikontroller)

Kodi should be set up as usual and a user / pass set on the web browser. Details of each Kodi instance should be added via the admin interface (button, top right)
Everything is very manual at the moment, but the long term goal is to build a scheduler to automate display, and then the use case is to use this app for one-off notifications or amending the schedule.

### New New (2024) To Do List;
- [ ] Media Management

### New To Do List;
MVP Level GUI for sending 
- [x] YouTube links to instances
- [x] Notifications
- [x] Multiple endpoints
- [x] Adding and removing nodes from GUI
- [x] Play Image Content for Dashboarding (Url based for now)
- [ ] Auto Generated Video Notifications with FFMPEG
- [ ] Auto Generated Image with text overlay Notifications
- [ ] Some level of templating for usability
- [ ] Lower Third Notifications from Native Kodi Notifications (Kodi Addon / SKin)
- [ ] Add a default playlist for when no content exists in the system
- [x] Ability to add instances to groups,
- [ ] and target groups.
- [ ] "Open Hours" to stop content and shut off screens (HDMI-CEC)



### Help!
I am not a developer, I like to tinker with code - if you want to see a project like this exist and are able to offer some assistance, please get in contact. Oli @ Infosec.Exchange (Mastodon) oli @ olipassey . me .uk (email)
