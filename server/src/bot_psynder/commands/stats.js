const Discord = require("discord.js");
const db = require("../../db.js");

module.exports = async function(message) {
	try {
		if (!db.get()) {
			message.channel.send("There is no database, I cannot make stats from nothing");
			return;
		}

		const listTherapists = await db.get().collection("Therapists").find({}).toArray();
		const listUsers = await db.get().collection("Users").find({}).toArray();
		const listAppointments = await db.get().collection("Appointments").find({}).toArray();
		const listSpecialties = await db.get().collection("Specialties").find({}).toArray();

		message.channel.send(
			{
				embeds: [
					{
						color: 3447003,
						title: "Psynder' stats",
						fields: [
							{
								name: `- Number of therapists:`,
								value: `\`${listTherapists.length}\``
							},
							{
								name: `- Number of locked therapists:`,
								value: `\`${countLockedTherapists(listTherapists)}\``
							},
							{
								name: `- Number of users non-therapists:`,
								value: `\`${listUsers.length}\``
							},
							{
								name: `- Number of appointments registered:`,
								value: `\`${listAppointments.length}\``
							},
							{
								name: `- Number of past appointment:`,
								value: `\`${countPastAppointments(listAppointments)}\``
							},
							{
								name: `- Number of therapist spcialities:`,
								value: `\`${listSpecialties.length}\``
							}
						]
					}
				]
			}
		);

	} catch (exception) {
		bot.sendLog(`Error exception:\n${exception.stack}`);
		return;
	}
};

function countLockedTherapists(list)
{
	let nb = 0;

	for (let i = 0; i < list.length; i++)
		if (list[i].locked && list[i].locked === true)
			nb++;

	return (nb);
}

function countPastAppointments(list)
{
	let nb = 0;

	for (let i = 0; i < list.length; i++)
		if (new Date(list[i].date).getTime() < new Date().getTime())
			nb++;

	return (nb);
}