const readline = require("readline");
const sendRequest = require("./sendRequest.js");

function question(str, hidden = false)
{
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	if (hidden) {
		let t = true;
		rl._writeToOutput = (a) => {
			if (t) {
				rl.output.write(a);
				t = false;
			} else
				rl.output.write("*");
		};
	}

	return new Promise(resolve => rl.question(str, answer => {
		if (hidden)
			rl.output.write("\n");
		rl.close();
		resolve(answer);
	}));
}

module.exports.getToken = async function()
{
	try {
		adminToken = await question("Admin token: ", true);

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

async function getTherapistsUIDs()
{
	try {
		const reqConfig = {
			method: "get",
			url: "http://localhost:8080/admin/therapists/locked",
			headers: { 
				"Authorization": `Bearer ${adminToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, lockedTherapists: res.body.therapists});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
}

function assignUIDsToGoodTherapist(therapistUIDs)
{
	for (let i = 0; i < therapistUIDs.length; i++) {
		const therapistIndex = test_config.therapists.findIndex(elem => elem.email === therapistUIDs[i].email);
		if (therapistIndex > -1)
			test_config.therapists[therapistIndex].uid = therapistUIDs[i]._id;
	}
}

module.exports.activateTherapists = async function()
{
	try {
		const therapistsUIDs = await getTherapistsUIDs();
		assignUIDsToGoodTherapist(therapistsUIDs.lockedTherapists);

		for (let i = 0; i < test_config.therapists.length; i++) {
			const therapist = test_config.therapists[i];
			const therapistLogged = await unlockTherapist(therapist.uid);

			if (!therapistLogged.success) {
				console.error(therapistLogged.message);
				process.exit(1);
			}
		}
		console.log("Therapists UIDs get");

		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

async function unlockTherapist(therapistUid)
{
	try {
		const reqConfig = {
			method: "put",
			url: `http://localhost:8080/admin/therapists/${therapistUid}/unlock/`,
			headers: { 
				"Authorization": `Bearer ${adminToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
}