# ======================================================================== #
# place this file in the userdata folder of a LibreElec rPi                #
# once Kodi has loaded it will display the awaiting_data image             #
# until KodiKontroller picks it up as online and sends a content command   #
# ======================================================================== #
import xbmc
xbmc.executebuiltin("SlideShow(/storage/pictures/)")
