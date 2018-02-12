// KodiKontroller init functions

(function($) {

    // Set up logging function
    var log = function (source, msg) {

        // Create a timestamp
        // (OMG JS Date formatting sucks...)
        var timestamp = new Date();
        var timestamp_human = ("0"+(timestamp.getDate()+1)).slice(-2) + '/' + ("0"+(timestamp.getMonth()+1)).slice(-2) + '/' + timestamp.getFullYear()
            + ' ' + ("0" + timestamp.getHours()).slice(-2) + ':' + ("0"+timestamp.getMinutes()).slice(-2) + ':' + ("0"+timestamp.getSeconds()).slice(-2);

        msg = '[' + timestamp_human + ']  [' + source + ']  ' + msg + "\n";

        var output = $('[name="response"]');
        output.val( output.val() + msg);
        if(output.length) {
            output.scrollTop(output[0].scrollHeight - output.height());
        }
    };


    // Add actions to all buttons
    $('.panel button').each( function() {

        var $this = $(this);

        $this.click( function() {

            // Walk up the DOM to find a data-kodi-target attribute on a parent element
            var panel = $this.parent();
            while (typeof panel.data('kodi-target') === 'undefined') {
                panel = panel.parent();
            }

            var target = panel.data('kodi-target');
            var panel = $(panel);
            var action  = $this.data('kodi-action');

            if (typeof target === 'undefined') {
                log("ERROR", "No target was defined, nothing to send.");
                return;
            }

            if (typeof action === 'undefined') {
                log(target, "No action defined, nothing to send.");
                return;
            }

            var url = panel.find('[name="url"]')[0].value;
            var message = panel.find('[name="message"]')[0].value;

            var rpc_data = '';


            log(target, 'Action: ' + action);

            switch (action) {

                case 'play':

                    if (url === '') {
                        // Exit if url is empty
                        // TODO: validate url
                        log(target, "Error: No URL supplied\n");
                        break;
                    }

                    // Prepare regex var
                    var re;

                    // Handle youtube URLs
                    // TODO: generalize and include playlists
                    // https://www.youtube.com/watch?v=B7AjF4of300
                    if (url.search('youtube.com') !== -1) {
                        re = /v=[^&$]*/i;
                        var ytid = url.match(re)[0].substr(2);
                        url = 'plugin://plugin.video.youtube/play/?video_id=' + ytid;
                    }

                    // https://youtu.be/B7AjF4of300
                    if (url.search('youtu.be') !== -1) {
                        re = /be\/[^&$]*/i;
                        var ytid = url.match(re)[0].substr(3);
                        url = 'plugin://plugin.video.youtube/play/?video_id=' + ytid;
                    }

                    // Handle vimeo URLs
                    // TODO: all the things.
                    // https://vimeo.com/xxxxxxxx -> plugin://plugin.video.vimeo/play/?video_id=xxxxxxxx
                    if (url.search('vimeo.com') !== -1) {
                       re = /vimeo\.com\/[^&$]*/i;
                       var vimid = url.match(re)[0].substr(10);
                       url = 'plugin://plugin.video.vimeo/play/?video_id=' + vimid;
                    }


                    // Handle SAMBA shares
                    log(target, "Sending URL \"" + url + "\" ... ");

                    // Set the RPC data variable
                    rpc_data = 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Player.Open","params":{"item":{"file":"' + url + '"}},"id":"1"}' );

                    break;


                case 'notify':

                    if (message === '') {
                        // Exit if message is empty
                        // TODO: escape/check message
                        log(target, "Error: No message supplied\n");
                        break;
                    }

                    log(target, "Sending message \"" + message + "\" ... ");

                    // Set the RPC data variable
                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"1","method":"GUI.ShowNotification","params":{"title":"Notification","message":"' + message + '","displaytime":20000}}' );

                    break;

                case 'reset' :


                    log(target, "Rebooting Instance ... ");

                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"1","method":"System.Reboot"}' );

                    break;

				case 'stats' :


					log(target, "Loading general stats and KPIs");

					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"2","method":"Player.Open","params":{"item":{"directory":"smb://EMBASSY-NAS/photo/"}}}' );

					break;

				case 'social' :


					log(target, "Loading web, digital & social content...");

					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"2","method":"Player.Open","params":{"item":{"directory":"smb://EMBASSY-NAS/photo/"}}}' );

					break;

				case 'technical' :


					log(target, "Loading technical dashboards...");

					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"2","method":"Player.Open","params":{"item":{"directory":"smb://EMBASSY-NAS/photo/"}}}' );

					break;

				case 'cec-activate' :

					// This function requires the Kodi JSON-CEC Plugin from https://github.com/joshjowen/script.json-cec
					// Tested and working well.

					log(target, "Display On ... ");

					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"script.json-cec","params":{"command":"activate"}},"id":1}' );

					break;

				case 'cec-standby' :

					// This function requires the Kodi JSON-CEC Plugin from https://github.com/joshjowen/script.json-cec
					// Tested and working well.

					log(target, "Display Off ... ");

					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"script.json-cec","params":{"command":"standby"}},"id":1}' );

					break;

                case 'img-notify-bottom' :

                    // This function requires the Kodi Banners Addon from http://kodi.lanik.org/banners.html
                    // Tested and working well.

                    log(target, "Image Notification Sent ... ");

                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"service.lowerthird","params":{"imageloc":"smb://10.20.0.241/kodi-kontroller/gfx/alert-statuscake.jpg","displaytime":"45000","position":"bottom"}},"id":1}' );

                    break;

                case 'img-notify-cent' :

                    // This function requires the Kodi Banners Addon from http://kodi.lanik.org/banners.html
                    // Tested and working well.

                    log(target, "Image Notification Sent ... ");

                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"service.lowerthird","params":{"imageloc":"D:\\img.jpg","displaytime":"45000","position":"center"}},"id":1}' );

                    break;

				case 'img-notify-top' :

                    // This function requires the Kodi Banners Addon from http://kodi.lanik.org/banners.html
                    // Tested and working well.

                    log(target, "Image Notification Sent ... ");

                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"service.lowerthird","params":{"imageloc":"D:\\img.jpg","displaytime":"45000","position":"top"}},"id":1}' );

                    break;

				case 'set-screen-on-time' :
					$(document).ready(function(){
					$('input.timepicker').timepicker({
					timeFormat: 'HH:mm:ss',
					// year, month, day and seconds are not important
					minTime: new Date(0, 0, 0, 8, 0, 0),
					maxTime: new Date(0, 0, 0, 19, 0, 0),
					// time entries start being generated at 8AM but the plugin
					// shows only those within the [minTime, maxTime] interval
					startHour: 8,
					// the value of the first item in the dropdown, when the input
					// field is empty. This overrides the startHour and startMinute
					// options
					startTime: new Date(0, 0, 0, 8, 00, 0),
					// items in the dropdown are separated by at interval minutes
					interval: 30,
					defaultTime: 8
					});
					});
					break;

				case 'set-screen-off-time' :
					$(document).ready(function(){
					$('input.timepicker').timepicker({
					timeFormat: 'HH:mm:ss',
					// year, month, day and seconds are not important
					minTime: new Date(0, 0, 0, 8, 0, 0),
					maxTime: new Date(0, 0, 0, 19, 0, 0),
					// time entries start being generated at 8AM but the plugin
					// shows only those within the [minTime, maxTime] interval
					startHour: 8,
					// the value of the first item in the dropdown, when the input
					// field is empty. This overrides the startHour and startMinute
					// options
					startTime: new Date(0, 0, 0, 8, 00, 0),
					// items in the dropdown are separated by at interval minutes
					interval: 30,
					defaultTime: 18
					});
					});
					break;

                default:

                    // Not a recognised action
                    log(target, "Error: unknown action\n");

            }

            // Send the AJAX XHR if rpc_data variable is not the empty string
            if (rpc_data !== '') {

                $.ajax({
                    url: '/send/' + target,
                    async: true,
                    type: "POST",
                    timeout: 5000,
                    data: rpc_data
                })

                // If Success, Notify User
                .done( function( data, textStatus, jqXHR ) {
                    if ( jqXHR.status == 200 && data['result'] == 'OK' ) {
                        log(target, "Done\n");
                    } else {
                        log(target, "Error\n");
                    }
                })

                // Older Versions Of Kodi/XBMC Tend To Fail Due To CORS But Typically If a '200' Is Returned Then It Has Worked!
                .fail( function( jqXHR, textStatus ) {
                    if ( jqXHR.status == 200 ) {
                        log(target, "Done\n" );
                    } else {
                        log(target, "Error: " + textStatus + "\n" );
                    }
                });

            }
        })
    });
})(jQuery);
