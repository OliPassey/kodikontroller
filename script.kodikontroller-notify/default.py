import xbmc
import xbmcgui
import xbmcaddon
import sys
import json

class FullScreenNotification(xbmcgui.WindowXMLDialog):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.message = kwargs.get('message', '')

    def onInit(self):
        self.getControl(2).setLabel(self.message)

def show_fullscreen_notification(message):
    addon = xbmcaddon.Addon()
    addon_path = addon.getAddonInfo('path')
    notification = FullScreenNotification('fullscreen-notify.xml', addon_path, 'default', '1080i', message=message)
    notification.doModal()
    del notification

if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            params = json.loads(sys.argv[1])
            message = params.get('message', 'This is a full screen notification!')
        except json.JSONDecodeError:
            message = 'This is a full screen notification!'
    else:
        message = 'This is a full screen notification!'

    show_fullscreen_notification(message)
