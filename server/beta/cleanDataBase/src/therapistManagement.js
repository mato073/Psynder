const sendRequest = require("./sendRequest.js");

module.exports.connectTherapist = async function(email, password)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/login",
			headers: {
				"Content-Type": "application/json"
			},
			data : JSON.stringify({"password": password, "email": email})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, therapist: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.deleteTherapist = async function(accessToken)
{
	try {
		const reqConfig = {
			method: "delete",
			url: "http://localhost:8080/therapists/current",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};