/**
 * Other router of the Psynder' server.
 * @module module:Routes-Other
 */

const db = require("../db.js");
let express = require("express");
const path = require("path");
let router = express.Router();


/**
 * @description GET homepage route that do nothing exept return a success status with an empty JSON.
 * @name GET /
 * @path {GET} /
 * @code {200} if the request is successful
 * @response {JSON} json - Empty JSON
 */
router.get("/", function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	res.status(200).json({});
});


/**
 * @description GET health check route to check if the database is connected, if not returns 503 (service unavailable)
 * @name GET /health-check
 * @path {GET} /health-check
 * @code {200} if the request is successful
 * @code {503} if couldn't connect to the db thus the request failed
 * @response {JSON} json - Empty JSON
 */
router.get("/health-check", async function(req, res) {
	if (maintenance.isIn || !(await db.isConnected())) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	} else
		res.status(200).send();
});


/**
 * @description GET route to know the lastest version of the mobile app in the following form: major.minor.patch
 * @name GET /mobile-app-version
 * @path {GET} /mobile-app-version
 * @code {200} if the request is successful
 * @response {JSON} json - Response as JSON type
 * @response {String} json.version - Number of the lastest version of the mobile app in the following form: major.minor.patch
 */
router.get("/mobile-app-version", function(req, res) {
	res.status(200).send({
		version: mobileAppVersion
	});
});


/**
 * @description Route to get the Android app file.
 * @name GET /android-app
 * @path {GET} /android-app
 * @code {200} if the request is successful
 * @code {404} if the request failed because the file is not found
 * @response {File} Psynder-mobile-signed.apk - The Psynder's Android mobile app
 */
router.get("/android-app", function(req, res) {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}

		// const file = path.join(__dirname, "../../mobileApps/Psynder-mobile-android-signed.apk");
		res.status(200).sendFile("/user/src/apps/Psynder-mobile-android.apk");
	} catch (err) {
		console.log(`Error exception:\n${err.stack}`);
		res.status(400).send({
			message: err.message
		});
	}
});


/**
 * @description Route to get the logo as PNG file.
 * @name GET /logo{dot}png
 * @path {GET} /logo.png
 * @query {(String | Boolean)} [transparancy=false] (Optional) If specified as true send file with transparency, else not
 * @code {200} if the request is successful
 * @code {404} if the request failed because the file is not found
 * @response {File} logo.png - The Psynder's logo as PNG file
 */
 router.get("/logo.png", function(req, res) {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}

		const file = path.join(__dirname, (req.query.transparency && req.query.transparency === "true" ? "../assets/logo_with_transparency.png" : "../assets/logo_without_transparency.png"));
		res.status(200).sendFile(file);
	} catch (err) {
		console.log(`Error exception:\n${err.stack}`);
		res.status(400).send({
			message: err.message
		});
	}
});


/**
 * @description Route to get the banner as PNG file.
 * @name GET /banner{dot}png
 * @path {GET} /banner.png
 * @query {(String | Boolean)} [transparancy=false] (Optional) If specified as true send file with transparency, else not
 * @code {200} if the request is successful
 * @code {404} if the request failed because the file is not found
 * @response {File} banner.png - The Psynder's banner as PNG file
 */
 router.get("/banner.png", function(req, res) {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}

		const file = path.join(__dirname, (req.query.transparency && req.query.transparency === "true" ? "../assets/banner_with_transparency.png" : "../assets/banner_without_transparency.png"));
		res.status(200).sendFile(file);
	} catch (err) {
		console.log(`Error exception:\n${err.stack}`);
		res.status(400).send({
			message: err.message
		});
	}
});


module.exports = router;