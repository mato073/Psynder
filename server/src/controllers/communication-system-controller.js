const communicationSystemService = require("../services/communication-system-service.js");

// POST
exports.sendMessage = async function(req, res, senderIsTherapist) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addRes = await communicationSystemService.addMessage(req.uid, req.body, senderIsTherapist);
	const code = (addRes.code ? addRes.code : (addRes.success ? 200 : 400));
	if (addRes.success)
		res.status(code).send({
			message: "Message successfuly sent"
		});
	else
		res.status(code).send({
			message: (addRes.message ? addRes.message : "Failed to register message")
		});
};

// GET
exports.getMessages = async function(req, res, senderIsTherapist) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const getRes = await communicationSystemService.getMessages(req.uid, req.params.receiverId, senderIsTherapist, req.query.nLasts && req.query.nLasts > 0 ? req.query.nLasts : 0);
	const code = (getRes.code ? getRes.code : (getRes.success ? 200 : 400));
	if (getRes.success)
		res.status(code).send({
			messages: getRes.messages
		});
	else
		res.status(code).send({
			message: (getRes.message ? getRes.message : "Failed to fetch messages")
		});
};