const config = require("../../config.json");
const maintenanceFunction = require("./commands/maintenanceFunction.js");
const changeMobileAppVersion = require("./commands/changeMobileAppVersion.js");
const listLockedTherapists = require("./commands/listLockedTherapists.js");
const stats = require("./commands/stats.js");

module.exports = function(message)
{
	bot.config = config.bot;
	if (message.author.bot || !message.content.startsWith(bot.config.prefix))
		return;

	if (!config.bot.whitelist.includes(message.author.id))
		return message.reply("You do not have the permission to use the bot. If you think it's an error, please contact Psynder's administration.");

	const commandBody = message.content.slice(bot.config.prefix.length);
	const args = commandBody.split(" ");
	const command = args.shift();

	switch (command) {
		case("ping"):
			const timeTaken = Date.now() - message.createdTimestamp;
			message.reply(`This message had a latency of ${timeTaken}ms.`);
			break;

		case("maintenance"):
			maintenanceFunction(message, args);
			break;

		case("mobileAppVersion"):
			changeMobileAppVersion(message, args);
			break;

		case("help"):
			bot.help(message, args);
			break;
		
		case("listLockedTherapists"):
		case("llt"):
			listLockedTherapists(message);
			break;

		case("stats"):
			stats(message);
			break;

		default:
			message.channel.send(`Command \`${message.content.trim()}\` not reconized.`);
			break;
	}
};