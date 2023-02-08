const sendRequest = require("./sendRequest.js");

module.exports.createTherapist = async function(email, password, firstName, lastName, phoneNumber)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/signup",
			headers: { 
				"Content-Type": "application/json"
			},
			data : JSON.stringify({"password": password, "email": email, "firstName": firstName, "lastName": lastName, "phoneNumber": phoneNumber})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

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

module.exports.addSpecialtyToTherapist = async function(accessToken, spcialtyId)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/current/specialties",
			headers: { 
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data: JSON.stringify({"specialty": spcialtyId})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.addAlreadyTreatedDisorderToTherapist = async function(accessToken, disorderAlreadyTreated)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/current/disorderAlreadyTreated",
			headers: { 
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data: JSON.stringify({"alreadyTreated": disorderAlreadyTreated})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.getCurrentTherapist = async function(accessToken)
{
	try {
		const reqConfig = {
			method: "get",
			url: "http://localhost:8080/therapists/current",
			headers: { 
				"Authorization": `Bearer ${accessToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, therapist: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};