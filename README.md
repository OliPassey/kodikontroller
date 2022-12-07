![KodiKontroller Logo](https://github.com/OliPassey/kodikontroller/raw/master/logo.PNG)
## by Oliver Passey
### Current Status: Restarted over December 2022.

#### New To Do List;
MVP Level GUI for sending 
- [x] YouTube links to instances
- [x] Notifications
- [x] Multiple endpoints
- [x] Image Content for Dashboarding (Url based for now)
- [ ] Auto Generated Video Notifications with FFMPEG
- [ ] Some level of templating for usability

Phase 2:
- [ ] Lower Third Notifications
- [ ] Adding and removing nodes from GUI

### Instructions
In order to use this code you must create / amend the kodi_endpoints.json file with your endpoints.
File will looks like this;

{
    "Office": {
      "username": "kodi",
      "password": "kodi",
      "host": "192.168.0.12",
      "port": "8080"
    },
    "Bedroom": {
      "username": "kodi",
      "password": "kodi",
      "host": "192.168.0.17",
      "port": "8080"
    }
  }