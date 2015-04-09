var xplalarm = require("./lib/xpl-alarm");
var schema_alarmbasic = require('/etc/wiseflat/schemas/alarm.basic.json');
var schema_alarmconfig = require('/etc/wiseflat/schemas/alarm.config.json');

var wt = new xplalarm(null, {
        xplLog: false,
	forceBodySchemaValidation: false
});

wt.init(function(error, xpl) { 

	if (error) {
		console.error(error);
		return;
	}
        
	xpl.addBodySchema(schema_alarmbasic.id, schema_alarmbasic.definitions.body);
	xpl.addBodySchema(schema_alarmconfig.id, schema_alarmconfig.definitions.body);
	
        // Load config file into hash
        wt.readConfig();
        wt.readBasic();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
                wt.sendBasic();
        }, 60 * 1000);
                        
        xpl.on("xpl:alarm.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.writeConfig(evt);
        });
        
        xpl.on("xpl:alarm.basic", function(evt) {
		if(wt.configHash.enable && evt.headerName == 'xpl-cmnd') {
			if(evt.body.command == 'play') wt.play(evt);
			if(evt.body.command == 'stop') wt.stop(evt);
			if(evt.body.command == 'loop') wt.loop(evt);
			if(evt.body.command == 'timelimit') wt.timeLimit(evt);
		}
        });
});

