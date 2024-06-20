import xbmc
import xbmcgui
import xbmcaddon
import sys
import json

class FullScreenNotification(xbmcgui.WindowXMLDialog):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.message = kwargs.get('message', '')
        self.headline = kwargs.get('headline', '')

    def onInit(self):
        self.getControl(1112).setLabel(self.message)
        self.getControl(1113).setLabel(self.headline)

def show_fullscreen_notification(message, headline):
    addon = xbmcaddon.Addon()
    addon_path = addon.getAddonInfo('path')
    notification = FullScreenNotification('fullscreen-notify.xml', addon_path, 'default', '1080i', message=message, headline=headline)
    notification.doModal()
    del notification

if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            params_str = sys.argv[1]
            params = json.loads(params_str)
            xbmc.log(f"Parsed params: {params}", level=xbmc.LOGDEBUG)
            message = params.get('message', 'This is a full screen notification!')
            headline = params.get('headline', 'No Headline')
        except json.JSONDecodeError:
            xbmc.log("Failed to decode JSON", level=xbmc.LOGERROR)
            message = 'This is a full screen notification!'
            headline = 'JSONDecodeError'
    else:
        message = 'This is a full screen notification!'
        headline = 'No Headline'

    show_fullscreen_notification(message, headline)
