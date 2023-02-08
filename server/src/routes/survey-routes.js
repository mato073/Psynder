/**
 * Survey router of the Psynder server.
 * @module module:Routes-Survey
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const roles = require("../permissions/roles.js");
const views = require("../controllers/users-controller.js");
const conditionViews = require("../controllers/conditions-controller.js");
const path = require("path");

const router = express.Router();

/**
 * @description Route to get the survey JSON files names for the algorithm of detection of potential depression disorders.
 * @name GET /survey/names
 * @path {GET} /survey/names
 * @code {200} if the request is successful
 * @response {JSON} json - Response as JSON type
 * @response {String[]} json.names - The names of the JSON files for the algorithm of detection of potential depression disorders
 */
router.get("/names", function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const fs = require("fs");
	const filesNamesArray = fs.readdirSync(path.join(__dirname, "../algorithms/potential_disorders_detection/questions"));
	const filesNames = {"names": filesNamesArray};
	res.status(200).send(filesNames);
});


/**
 * @description Route to send the results of the algorithm of detection of potential depression disorders.
 *
 * __/!\ Needs access token ! /!\\__
 * @name POST /survey/users/results
 * @path {POST} /survey/users/results
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {JSON} body_json - Results of the algorithm of detection of depression disorders (**object as string (may use JSON.stringify)**)
 * @body {String} body_json.potentialDisorder - Name (in french) of the disorder managed by the file
 * @body {Object[]} body_json.Questions - Questions the had to answer
 * @body {String} body_json.Questions[i].name - May be a ID of question
 * @body {String} body_json.Questions[i].question - The question asked to the user
 * @body {String[]} body_json.Questions[i].types - Types waited for question asked to the user. Could be one (or many) of the following: "BOOL", "ANSWERS", "DATE.NEAR", "DATE.FAR", "BRUT.INT", "BRUT.STRING"
 * @body {Bool} body_json.Questions[i].answered - To know if the question answered by the user
 * @body {String} body_json.Questions[i].value - The answer to the question asked to the user
 * @body {Object[]} body_json.Questions[i].answers - (Optionnal) Possible answers to the question asked to the user
 * @body {String} body_json.Questions[i].answers[j].name - Value (answer) of the possible answers to the question asked to the user
 * @body {Number} body_json.Questions[i].answers[j].value - Value (for score) of the possible answers to the question asked to the user
 * @body {Object[]} body_json.Questions[i].forksAnswers - (Optional) Forks of values of a brut answer (as number)
 * @body {String} body_json.Questions[i].forksAnswers[j].fork - The fork of the fork answers to the question asked to the user. Has to be like "value1**-**value2" or "value**+**"
 * @body {Number} body_json.Questions[i].forksAnswers[j].value - Value (for score) of the fork answers to the question asked to the user
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.post("/users/results", auth.isAuthenticated, roles.isUserNonTherapist, views.saveSurveyResults);


/**
 * @description Route to check the conditions of a survey.
 * @name POST /survey/check-conditions
 * @path {POST} /check-conditions
 * @body {JSON} questions - list of the curent survey
 * @body {JSON} conditions - list of the conditions
 * @code {200} if the alog return true
 * @code {400} if the algo return false
 * @code {503} if the server is under maintenance
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration is equal to true or false
 */
router.post("/check-conditions", auth.isAuthenticated, roles.isUserNonTherapist, conditionViews.checkConditions);


/**
 * @description Route to get the survey JSON file asked for the algorithm of detection of potentialdepression disorders.
 * @name GET /survey/:fileName
 * @path {GET} /survey/:fileName
 * @params {String} :fileName - Name of the file you want to get
 * @response {File} file - The survey JSON file asked for the algorithm of detection of potential depression disorders
 */
router.get("/:fileName", function(req, res, next) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const fileName = req.params.fileName;
	res.sendFile(path.join(__dirname, `../algorithms/potential_disorders_detection/questions/${fileName}`), function(err) {
		if (err)
			next(err);
	});
});

module.exports = router;