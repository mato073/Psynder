const axios = require("axios");

module.exports = async function sendRequest(config)
{
	try {
		const response = await axios(config);
		return ({status: response.status, body: response.data});
	} catch (exception) {
		if (exception.response.data)
			return ({error: true, message: exception.stack, data: exception.response.data});
		return ({error: true, message: exception.stack});
	}
};