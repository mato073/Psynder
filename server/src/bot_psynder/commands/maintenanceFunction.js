const stringArrayToString = require("../utils/stringArrayToString.js");

module.exports = function(message, args)
{
	if (args.length < 1)
		return message.channel.send("I need to know if you want to do, **get** or **set** maintenance status ?");

	switch (args[0]) {
		case("get"):
		case("status"):
			message.channel.send((maintenance.isIn ? `**On** until *${(maintenance.retryAfter) ? (new Date().getTime() > new Date(maintenance.retryAfter).getTime() ? `${maintenance.retryAfter}* thats is a past date. Maybe you should update *Retry-After* if maintenance takes more time.` : `${maintenance.retryAfter}*.`) : "no date defined*."}` : "**Off**"));
			break;

		case("set"):
			switch (args[1]) {
				case("off"):
					maintenance.isIn = false;
					message.channel.send(`Maintenance *desactivated*`);
					break;

				case("on"):
					const commandDate = stringArrayToString(args, " ", 2).trim();
					const dateUTCString = new Date(commandDate + " UTC").toUTCString();
					maintenance.retryAfter = (commandDate === "" ? "" : dateUTCString);
					maintenance.isIn = true;
					message.channel.send(`Maintenance *activated* and retry-after set for **${(commandDate === "" ? "no date defined" : dateUTCString)}**.`);
					break;

				default:
					message.channel.send("I didn't understand. With **set** you can only specify **off** or **on** (followed by the date and time you want to set the retry-after in format **DD/MM/YYYY HH:MM:SS**).");
				break;
			}
			break;

		default:
			message.channel.send("I didn't understand. What do you want to **set** or to **get** ?");
			break;
	}
};