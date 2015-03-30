var xplalarm = require("./lib/xpl-alarm");
var schema_alarmbasic = require('/etc/wiseflat/schemas/alarm.basic.json');

var wt = new xplalarm(null, {
	//xplSource: 'bnz-shell.wiseflat'
        //xplLog: true
});

wt.init(function(error, xpl) { 

	if (error) {
		console.error(error);
		return;
	}
        
	xpl.addBodySchema(schema_alarmbasic.id, schema_alarmbasic.definitions.body);

        // Load config file into hash
        wt.readConfig();
        wt.readBasic();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
                wt.sendBasic();
        }, 60 * 1000);
        
        //wt.play('http://www.tv-radio.com/station/france_inter_mp3/france_inter_mp3-128k.m3u');
                
        xpl.on("xpl:alarm.request", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.sendConfig();
        });
        
        /*xpl.on("xpl:alarm.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.read();
        }); */

        xpl.on("xpl:alarm.basic", function(evt) {
                if(evt.headerName == 'xpl-cmnd') {
                    console.log(evt);
                    if(evt.body.command == 'play') wt.play(evt.body);
                    if(evt.body.command == 'stop') wt.stop(evt.body);
                    if(evt.body.command == 'loop') wt.loop(evt.body);
                    if(evt.body.command == 'timelimit') wt.timeLimit(evt.body);
                    //if(evt.body.command == 'stopTimeLimit') wt.stopTimeLimit(evt.body);
                }
        });
});

