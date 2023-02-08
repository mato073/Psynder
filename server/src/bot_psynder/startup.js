const config = require("../../config.json");
const db = require("../db.js");

module.exports = async function() {
	bot.config = config.bot;
	if (!bot.config.prefix)
		bot.config.prefix = "";

	console.log("Bot logging in");
	await bot.login(config.bot.token);

	bot.sendLog = function(content, color) {
		try {
			switch(color){
				case(bot.COLORS.RED):
				case(bot.COLORS.ORANGE):
				case(bot.COLORS.YELLOW):
				case(bot.COLORS.BLUE):
					break;
				default:
					color = bot.COLORS.BLUE;
					break;
			}
			const reportLogChannel = bot.channels.cache.get(bot.config.idLogChannel);
			if (reportLogChannel)
				reportLogChannel.send({embeds: [{color: color, description: content, timestamp: new Date()}]});
		} catch (exception) {
			console.error(`ERROR at ${new Date()}:\n${exception.stack}`);
		}
	};

	bot.COLORS = {
		RED: "#FF0000",
		ORANGE: "#FF4500",
		YELLOW: "#ffff00",
		BLUE: "#006ee6",
	};

	bot.help = function(message, args){
		if (message.author.bot || !message.content.startsWith(bot.config.prefix))
			return;
		if (args.length < 1)
			message.channel.send({embeds: [{color: 3447003, description: 
				"Hi ! I'm the underpaid Intern. I'm here to provide you a list of useful tools in order to ease you in your tasks.\n\n\
			Here's the list of available commands (prefix : !) :\n **- help** : display this page.\n\
			 - **help color** : display the help on the color list for the error messages.\n\
			 - **maintenance** : activate the maintenance system of the server. You can use args such as set/get to setup the maintenance\n\
			 - **mobileAppVersion** : set the mobile version in order to avoid any compatibility problem. You can check the actual version with arg get and setup a new version with set and the version setup l0ike this : Major.Minor.Patch (ex : 1.6.4)\n\
			 - **listLockedTherapists or llt** : display a list of the current therapists account that need verification.\n\
			 - **stats** : display the stats of the server, informations like how many account, appointment and other various things are available here \n\
			 "}]});
		else if (args[0] === "color")
		message.channel.send({embeds: [{color: 3447003, description: "This is the help section for the color list of the error messages. Here's what you need to know : \n\n\
		- **Red** : Critical error, must be solved ASAP.\n\
		- **Orange** : High priority error, usually meaning that a part of the service is down.\n\
		- **Yellow** : Medium error, need to be taken care of when having time. Ex : function error, stuff like that.\n\
		- **Blue** : info tab, not an error, mostly to give info on the situation."}]});
	};

	bot.embedMessage = function(idChannelTarget,content) {
		try {
			const channelTarget = bot.channels.cache.get(idChannelTarget);
			if (channelTarget)
				channelTarget.send({embeds: [{color: 3447003, description: content, timestamp: new Date()}]});
		} catch (exception) {
			console.error(`ERROR at ${new Date()}:\n${exception.stack}`);
		}
	};

	/* initializing database */
	db.connect();
};