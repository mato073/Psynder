const db = require("../db.js");
const status = require("http-status-codes").StatusCodes;
const path = require("path");
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const redisService = require("../services/redis-service");
const socialAuthUtils = require("../utils/social-auth-utils");
const jwt = require("jsonwebtoken");
const config = require("../../config.json");

const emailConf = config.emailTransporter; 

const senderAddr = emailConf.addr;

const transporter = nodemailer.createTransport({
	port: emailConf.port,
	host: emailConf.host,
	auth: {
		user: senderAddr,
		pass: emailConf.password
	},
	secure: true,
});

_sendEmail = async function(receiverAddr, pathToTemplate) {
	if (!receiverAddr || typeof(receiverAddr) !== "string")
		throw Error("Invalid receiver email address");
		const out = new Email();
	out.renderAll(pathToTemplate, {
		juice: true,
		juiceResources: {
			preserveImportant: true,
			webResources: {
				relativeTo: pathToTemplate
			}
		}
	}).then(res => {
		transporter.sendMail({
			from: `Psynder <${senderAddr}>`,
			to: receiverAddr,
			subject: res.subject,
			text: res.text,
			html: res.html
		}).then(console.log);
	});
};

exports.sendRegistrationEmail = async function(emailAddr) {
	_sendEmail(emailAddr, path.join(__dirname, "..", "emails", "registration"));
};

exports.sendTherapistRegistrationEmail= async function(emailAddr) {
	_sendEmail(emailAddr, path.join(__dirname, "..", "emails", "registration-therapist"));
};

exports.sendTherapistAccountEnabledEmail = async function(emailAddr) {
	_sendEmail(emailAddr, path.join(__dirname, "..", "emails", "account-enabled-therapist"));
};

exports.sendPasswordResetEmail = async function(reqOrigin, body) {
	const cachedKeyName = "password_reset";
	try {
		if (!db.get())
			return ({success: false, code: status.SERVICE_UNAVAILABLE});
		if (!body.email || !body.redirectTo || !body.hasOwnProperty("isTherapist"))
			return ({success: false, code: status.BAD_REQUEST, message: "Missing body parameters"});
		
			let user;
		if (body.isTherapist === true || body.isTherapist === "true")
			user = await db.get().collection("Therapists").findOne({"email": body.email});
		else if (body.isTherapist === false || body.isTherapist === "false")
			user = await db.get().collection("Users").findOne({"email": body.email});
		else
			return ({success: false, code: status.BAD_REQUEST, message: "isTherapist must be boolean"});   
		if (!user)
			return ({success: false, code: status.BAD_REQUEST, message: "User or therapist not found"});
		
		/* Checking if the user registered with Google or another social auth provider thus doesn"t have a password */
		const registeredWithSocial = socialAuthUtils.authorizedProviders.some(e => user._id.toString().includes(e));
		if (registeredWithSocial)
			return ({success: false, code: status.FORBIDDEN, message: "User registered via social auth provider, he doesn't have a password."});
		
		/* Checking if the password reset token has already been issued less than 10 mins ago and is still in cache */
		const cachedToken = await redisService.getCachedUserLinkedToken(user ._id.toString(), cachedKeyName);
		if (cachedToken)
			return ({success: false, code: status.CONFLICT, message: "Password reset token already issued, wait for expiry (10 min)"});
	   
		const token = await redisService.createAndCacheUserLinkedToken(user._id.toString(), cachedKeyName, 600);
		const email = new Email();
		email.renderAll(path.join(__dirname, "..", "emails", "password-reset"), {
			redirectUrl: body.redirectTo + "?token=" + token
		}).then(res => {
			transporter.sendMail({
				from: `Psynder <${senderAddr}>`,
				to: body.email,
				subject: res.subject,
				text: res.text,
				html: res.html,
			}).then(console.log);
		});
		return ({success: true, code: status.OK});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, code: status.INTERNAL_SERVER_ERROR});
	}
};

exports.isResetPwdTokenValid = async function(query) {
	try {
		if (!db.get())
			return ({success: false, code: status.SERVICE_UNAVAILABLE});
		if (!query.token || typeof(query.token) !== "string")
			return ({success: false, code: status.BAD_REQUEST});
		let uid;
		try {
			jwt.verify(query.token, config.accessTokenSecret, function(err, decoded) {
				if (err != null)
				throw Error("Invalid or expired token");
				uid = decoded.uid;
			});
		} catch(_) {
			return ({success: false, code: status.BAD_REQUEST});
		}
		const storedToken = await redisService.getCachedUserLinkedToken(uid, "password_reset");
		if (!storedToken || storedToken !== query.token)
			return ({success: false, code: status.BAD_REQUEST});
		return ({success: true, code: status.OK});
	} catch (e) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, code: status.INTERNAL_SERVER_ERROR});
	}
};