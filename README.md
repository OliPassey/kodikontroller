## Kodi Kontroller v4 (ish) 
### by Oliver Passey
v4.0
![image](https://github.com/OliPassey/kodikontroller/assets/7745805/66125687-3568-4da6-ba1a-cf25535f25f6)

v4.0.5
![image](https://github.com/OliPassey/kodikontroller/assets/7745805/ab615168-a278-4aa6-bfc3-255fea628c47)


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
There is no scheduling available yet and all controls are manual. 

Kodi should be set up as usual and a user / pass set on the web control / api. Details of each Kodi instance should be added via the admin interface (button, top right)
Everything is very manual at the moment, but the long term goal is to build a scheduler to automate display, and then the use case is to use this app for one-off notifications or amending the schedule.

### New New (2024) To Do List;
- [x] Media Management MVP
- [ ] Sort layout for non 1440p resolutions (sorry)
- [ ] Playlists, Schedules, Groups
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
