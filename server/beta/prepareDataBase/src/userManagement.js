const sendRequest = require("./sendRequest.js");

module.exports.createUser = async function(email, password, firstName, lastName, phoneNumber)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/users/signup",
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

module.exports.connectUser = async function(email, password)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/users/login",
			headers: { 
				"Content-Type": "application/json"
			},
			data : JSON.stringify({"password": password, "email": email})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, user: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};