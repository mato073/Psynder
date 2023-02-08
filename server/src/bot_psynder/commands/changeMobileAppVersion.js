const stringArrayToString = require("../utils/stringArrayToString.js");
const validateMobileVersion = require("../utils/validateMobileVersion.js");

module.exports = function(message, args)
{
	if (args.length < 1)
		return message.channel.send("I need to know if you want to do, **get** or **set** mobile app version ?");

	switch (args[0]) {
		case("get"):
			message.channel.send((mobileAppVersion && mobileAppVersion != "" ? `Current mobile app version: **${mobileAppVersion}**` : "Mobile version not defined"));
			break;

		case("set"):
			const newVersion = stringArrayToString(args, "", 1).trim();
			const parsedNewVersion = validateMobileVersion(mobileAppVersion, newVersion);
			if (!parsedNewVersion.success)
				message.channel.send((parsedNewVersion.message ? parsedNewVersion.message :`Bad mobile app version given, *${newVersion}* doesn't look like a good versioning (\`major.minor.patch\`)`));
			else {
				mobileAppVersion = newVersion;
				message.channel.send(`Mobile app version set to **${mobileAppVersion}**`);
			}
			break;

		default:
			message.channel.send("I didn't understand. What do you want to **set** or to **get** ?");
			break;
	}
};