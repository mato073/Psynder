const { listLockedTherapists } = require("../../services/admin-service.js");
const Discord = require("discord.js");

module.exports = async function(message) {
	try {
		const list = await listLockedTherapists();

		if (!list.success)
			return (message.channel.send("Error while getting the therapist list"));
		if (list.therapists.length < 1)
			return (message.channel.send("There is no locked therapist account"));

		const listEmbed = new Discord.MessageEmbed()
			.setTitle("Locked therapists");

		for (let i = 0; i < list.therapists.length; i++) {
			listEmbed.addField(`- Mail ${list.therapists[i].email}:`, `ID: *${list.therapists[i]._id}*`);
		}

		message.channel.send({embeds: [listEmbed]});
	} catch (exception) {
		bot.sendLog(`Error exception:\n${exception.stack}`);
		return;
	}
};