// KodiKontroller init functions



$(function() {

    // Build the individual interfaces
    var interface_holder = $('section.screens');
    var interface_template = $('article.screen#template');
    var interface_counter = 0;

    var interface_groups = {};

    // Hide the template
    interface_template.detach();

    
    // Create interfaces from config array
    for (var i in screen_list) {

        interface_groups[screen_list[i].group] = true;

        var new_screen = interface_template.clone();

        new_screen.css({opacity:0});

        new_screen.removeAttr('id');
        new_screen.data('kodi-target', screen_list[i].host);
        new_screen.data('kodi-group', screen_list[i].group);
        new_screen.find('h2').text(screen_list[i].name);

        new_screen.appendTo(interface_holder);
        new_screen.delay(100*interface_counter++).animate({opacity:1}, 300, 'easeOutSine');
        
    }


    // Normalise interface_groups into simple array
    console.log(interface_groups);
    var temp_groups = [];
    for (var group in interface_groups) {
        if (interface_groups.hasOwnProperty(group)) {
            temp_groups.push(group);
        }
    }
    interface_groups = temp_groups;


    // Set up logging function
    var log = function( msg ) {
        var output = $('[name="response"]');
        output.val( output.val() + msg );
        if(output.length) {
            output.scrollTop(output[0].scrollHeight - output.height());
        }
    };


    // Add actions to all buttons
    $( 'button' ).each( function() {

        var $this = $(this);
        
        
        $this.click( function() {
        
        
            var kodi_address = $this.parent().data('kodi-target');
            var kodi_action  = $this.data('kodi-action');
            var screen_name  = $this.parent().find('h2').text();
            var screen_group = $this.parent().data('kodi-group');
            
            var url = $this.parent().find('[name="url"]')[0].value;
            var message = $this.parent().find('[name="message"]')[0].value;
            
            var rpc_data = '';
            
            
            // Create a timestamp
            // (OMFG JS Date formatting sucks...)
            var timestamp = new Date();
            var timestamp_human = ("0"+(timestamp.getDate()+1)).slice(-2) + '/' + ("0"+(timestamp.getMonth()+1)).slice(-2) + '/' + timestamp.getFullYear()
                + ' ' + ("0" + timestamp.getHours()).slice(-2) + ':' + ("0"+timestamp.getMinutes()).slice(-2) + ':' + ("0"+timestamp.getSeconds()).slice(-2);
                
            // Add the timestamp and screen name to the output log
            log('[' + timestamp_human + '] ' + '<' + screen_name + '> : ');     
            
            switch (kodi_action) {
                
                case 'play':
                
                    if (url === '') {
                        // Exit if url is empty
                        // TODO: validate url
                        log("Error: No URL supplied\n");
                        break;
                    }

                    // Handle youtube URLs
                    // TODO generalize and include playlists, youtu.be URLs
                    if (url.search('youtube.com') !== -1) {
                        var re = /v=[^&$]*/i;
                        var ytid = url.match(re)[0].substr(2);
                        url = 'plugin://plugin.video.youtube/play/?video_id=' + ytid;
                    }

                    // Handle SAMBA shares
                    log("Sending URL \"" + url + "\" ... ");
                    
                    // Set the RPC data variable
                    rpc_data = 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Player.Open","params":{"item":{"file":"' + url + '"}},"id":"1"}' );
                    
                    break;
                
                
                case 'notify':
                
                    if (message === '') {
                        // Exit if message is empty
                        // TODO: escape/check message
                        log("Error: No message supplied\n");
                        break;
                    }
                    
                    log("Sending message \"" + message + "\" ... ");
                    
                    // Set the RPC data variable
                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"1","method":"GUI.ShowNotification","params":{"title":"Notification","message":"' + message + '"}}' );

                    break;
                
                case 'reset' :


                    log("Rebooting Instance ... ");

                    rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"1","method":"System.Reboot"}' );
                    
                    break;
                
				case 'logos' :
				
				
					log("Cycling FOE Logos ... ");
					
					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"2","method":"Player.Open","params":{"item":{"directory":"smb://EMBASSY-NAS/photo/"}}}' );
					
					break;
				
				case 'genvideo' :
				
				
					log("Cycling generic public FOE Videos ... ");
					
					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","id":"2","method":"Player.Open","params":{"item":{"directory":"smb://EMBASSY-NAS/photo/"}}}' );
					
					break;
                
				case 'cec-activate' :
				
					// This function requires the Kodi JSON-CEC Plugin from https://github.com/joshjowen/script.json-cec
					// Kodi Support Thread: https://forum.kodi.tv/showthread.php?tid=149356&page=2
					// Currently Untested
					log("Display On ... ");
					
					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"script.json-cec","params":{"command":"activate"}},"id":1}' );
					
					break;

				case 'cec-standby' :
				
					// This function requires the Kodi JSON-CEC Plugin from https://github.com/joshjowen/script.json-cec
					// Kodi Support Thread: https://forum.kodi.tv/showthread.php?tid=149356&page=2
					// Currently Untested
					log("Display Off ... ");
					
					rpc_data= 'request=' + encodeURIComponent( '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"script.json-cec","params":{"command":"standby"}},"id":1}' );
					
					break;					
                
				default:
                
                    // Not a recognised action
                    log("Error: unknown action\n");
                    
            }
            
            
            
            // Send the AJAX XHR if rpc_data variable is not the empty string
            if (rpc_data !== '') {
            
                $.ajax({
                    url: kodi_address + '/jsonrpc',
                    dataType: 'jsonp',
                    jsonpCallback: 'jsonCallback',
                    type: 'GET',
                    async: true,
                    timeout: 10000,
                    data: rpc_data
                })
                
                // If Success, Notify User
                .done( function( data, textStatus, jqXHR ) {
                    if ( jqXHR.status == 200 && data['result'] == 'OK' ) {
                        log("Done\n");
                    } else {
                        log("Error\n");
                    }
                })
                
                // Older Versions Of Kodi/XBMC Tend To Fail Due To CORS But Typically If A '200' Is Returned Then It Has Worked!
                .fail( function( jqXHR, textStatus ) {
                    if ( jqXHR.status == 200 ) {
                        log("Done\n" );
                    } else {
                        log("Error: " + textStatus + "\n" );
                    }
                });
            
            }                
        })
    });
});
