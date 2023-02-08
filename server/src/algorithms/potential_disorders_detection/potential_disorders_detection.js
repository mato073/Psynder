/**
 * Enum to keep in mind the waiting type(s) response.
 * @global
 * @name POSSIBLE_ANSWERS
 * @readonly
 * @enum
 * @type {(string|object.string)}
 */
POSSIBLE_ANSWERS = {
	/** Boolean value 
	 * @type {boolean}
	 */
	BOOL: "bool",
	/** Date format value, could be NEAR or FAR 
	 * @type {(DATE.NEAR|DATE.FAR)}
	*/
	DATE: {
		NEAR: "date.near",
		FAR: "date.far"
	},
	/** Array of strings 
	 * @type {object[]}
	 */
	ANSWERS: "answers",
	/** Brut answer could be INT or STRING type
	 * @type {(INT|STRING)}
	 * */
	BRUT: {
		INT: "brut.int",
		STRING: "brut.string"
	}
};

/**
 * Global return value when success.
 * @global
 * @constant
 * @type {boolean}
 * @default true
 */
SUCCESS = true;

/**
 * Global return value when fail.
 * @global
 * @constant
 * @type {boolean}
 * @default false
 */
FAIL = false;

const getTypesOfAnswers = require("./src/getTypesOfAnswers.js");
const checkAnswer = require("./src/checkAnswer.js");
const countPoints = require("./src/countPoints.js");
const countMaxPoints = require("./src/countMaxPoints.js");
const parsingSurvey = require("./src/parsingSurvey.js");

/**
 * Main loop of the algorithme to detect potentials depression disorders.
 * @function potentialDisordersDetection
 * @param {JSON} surveyFile - Current survey we are working with.
 * @returns {JSON} json - Return object depending on what appened.
 * @returns {boolean} json.success - true or false depending on what appened.
 * @returns {string} fail_json.message - Return object depending on what appened.
 */
module.exports = async function(surveyFile)
{
	try {
		// If the survey is empty, we throw an error
		if (!surveyFile || !parsingSurvey(surveyFile))
			return ({success: false, message: "Informations are missing or they're in a wrong type"});

		for (let i = 0; i < surveyFile.Questions.length; i++) {
			const waitingTypesOfAnswers = getTypesOfAnswers(surveyFile, i);
			const answer = checkAnswer(surveyFile, i, waitingTypesOfAnswers);
			if (answer.success === FAIL)
				return ({success: false, message: `Bad type of answer for question n°${i} : ${answer.message}`});
		}

		const points = countPoints(surveyFile);
		const maxPoints = countMaxPoints(surveyFile);
		const results = {
			name: surveyFile.potentialDisorder,
			getDisorder: (points >= maxPoints / 2 ? true : false),
			score: points,
			maxScore: maxPoints
		};
		return ({success: true, results: results});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

/**
 * Module with main loop of the algorithm to detect potential depression disorders.
 * 
 * Code with comments:
 * ```
POSSIBLE_ANSWERS = {
	BOOL: "bool",
	DATE: {
		NEAR: "date.near",
		FAR: "date.far"
	},
	ANSWERS: "answers",
	BRUT: {
		INT: "brut.int",
		STRING: "brut.string"
	}
};

SUCCESS = true;
FAIL = false;

const getTypesOfAnswers = require("./src/getTypesOfAnswers.js");
const checkAnswer = require("./src/checkAnswer.js");
const countPoints = require("./src/countPoints.js");
const countMaxPoints = require("./src/countMaxPoints.js");
const parsingSurvey = require("./src/parsingSurvey.js");

async function(surveyFile)
{
	try {
		// If the survey is empty, we throw an error
		if (!surveyFile || !parsingSurvey(surveyFile))
			return ({success: false, message: "Informations are missing or they're in a wrong type"});

		for (let i = 0; i < surveyFile.Questions.length; i++) {
			const waitingTypesOfAnswers = getTypesOfAnswers(surveyFile, i);
			const answer = checkAnswer(surveyFile, i, waitingTypesOfAnswers);
			if (answer.success === FAIL)
				return ({success: false, message: `Bad type of answer for question n°${i} : ${answer.message}`});
		}

		const points = countPoints(surveyFile);
		const maxPoints = countMaxPoints(surveyFile);
		const results = {
			name: surveyFile.potentialDisorder,
			getDisorder: (points >= maxPoints / 2 ? true : false),
			score: points,
			maxScore: maxPoints
		};
		return ({success: true, results: results});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}
```
 * @module module:potentialDisordersDetection
 * @see module:nextFile
 * @see module:displayQuestions
 * @see module:checkAnswer
 * @see module:checkConditions
 * @see module:getSurveyNames
 * @see module:parsingSurvey
 */