/**
 * Function to parse the input received and tell if the input is valid dependind on what we were waiting as response.
 * @function checkAnswer
 * @param {JSON} currentSurvey - Current survey we are working with.
 * @param {int} currentQuestionNumber - Number of the current question in the survey we are working with.
 * @param {object} waitingTypesOfAnswer - Array of types of answers that can be waited for this questions {@link POSSIBLE_ANSWERS}.
 * @returns {JSON} json - Return object depending on what appened.
 * @returns {boolean} json.success - true or false depending on what appened.
 * @returns {string} fail_json.message - String to explain what appened.
 */
module.exports = function(currentSurvey, currentQuestionNumber, waitingTypesOfAnswer) {
	const answer = (typeof(currentSurvey.Questions[currentQuestionNumber].value) === "string" ? currentSurvey.Questions[currentQuestionNumber].value.toLowerCase().trim() : currentSurvey.Questions[currentQuestionNumber].value);

	// We do loop on each response we were waiting for and each types of response we can have
	for (let i = 0; i < waitingTypesOfAnswer.length; i++) {
		if (!currentSurvey.Questions[currentQuestionNumber].answered)
			return ({success: true});

		// If answer is only *oui* or *non*
		if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BOOL) {
			//  We do set the variable *value* to true if the anwser is *yes* because by default it's false
			currentSurvey.Questions[currentQuestionNumber].score = (answer === "oui" ? 1 : 0);
			return ({success: true});

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.FAR || waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.NEAR) {
			// If the answer dosn't match with a dat like DD/MM/YYYY (year commencing between 19 or 20) it will be considered as not a date send
			if (!answer.match(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/))
				continue;
			return (checkValidityofDateAnswer(currentSurvey, currentQuestionNumber, answer, waitingTypesOfAnswer, i));

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BRUT.INT && Number.isInteger(parseInt(answer)))
			return (checkValidityofIntAnswer(currentSurvey, currentQuestionNumber, answer));

		else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BRUT.STRING) {
			// Here, there is nothing to analyze so we only give a point (by setting *value* to true)
			currentSurvey.Questions[currentQuestionNumber].value = 1;
			return ({success: true});

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.ANSWERS) {
			// Here we check is the answer is in an array of answers given
			const answers = currentSurvey.Questions[currentQuestionNumber].answers;
			for (let j = 0; j < answers.length; j++)
				if (answer === answers[j].name.toLowerCase().trim()) {
					currentSurvey.Questions[currentQuestionNumber].score = answers[j].value;
					return ({success: true});
				}
		}
	}

	// By default we return an error message and FAIL
	return ({success: false, message: `${answer} is not a good value`});
};

/**
 * Function to check if the date given exists and is valid.
 * @function checkValidityofDateAnswer
 * @param {string} answer The input of the user.
 * @param {int} i To know if the awaited answer is near or far.
 * @returns {JSON} json - Return object depending on what appened.
 * @returns {boolean} json.success - true or false depending on what appened.
 * @returns {string} fail_json.message - String to explain what appened.
 */
function checkValidityofDateAnswer(currentSurvey, currentQuestionNumber, answer, waitingTypesOfAnswer, i) {
	// We do split the answer by / character to get the day (2 digits), the month (2 digits) and the year (4 digits)
	const pdate = answer.split('/');
	const dd = parseInt(pdate[0]);
	const mm  = parseInt(pdate[1]);
	const yy = parseInt(pdate[2]);
	// Create list of days of a month (assume there is no leap year by default)
	const nbOfDays = [31,28,31,30,31,30,31,31,30,31,30,31];

	// Then we do chck if the date is valid
	if ((mm == 1 || mm > 2) && dd > nbOfDays[mm - 1])
		return ({success: false, message: "Invalid date"});

	if (mm == 2) {
		let lyear = FAIL;
		if ((yy % 4 !== 0 && yy % 100 === 0) || yy % 400 === 0)
			lyear = true;
		if (!lyear && dd >= 29)
			return ({success: false, message: "Invalid date"});
		if (lyear && dd > 29)
			return ({success: false, message: "Invalid date"});
	}

	const now = new Date();
	const answerDate = new Date(+yy, mm - 1, +dd);

	if (!answerDate || answerDate > now)
		return ({success: false, message: "Invalid date"});

	const yearsDiff =  now.getFullYear() - answerDate.getFullYear();
	const monthsDiff = (yearsDiff * 12) + (now.getMonth() - answerDate.getMonth());

	// At the end we compare if the result is near or far from today's date
	if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.FAR) {
		// If it's a far date awaited we give more score for date superior to one year
		if (monthsDiff > 12)
			currentSurvey.Questions[currentQuestionNumber].score = 3;
		else
			currentSurvey.Questions[currentQuestionNumber].score = 1;
	} else {
		// If it's a near date awaited we give more score for date inferior to six months
		if (monthsDiff < 6)
			currentSurvey.Questions[currentQuestionNumber].score = 3;
		else
			currentSurvey.Questions[currentQuestionNumber].score = 1;
	}
	return ({success: true});
}

/**
 * Function to check if the answer as int is in a fork of values.
 * @function checkValidityofIntAnswer
 * @param {string} answer The input of the user.
 * @returns {JSON} json - Return object depending on what appened.
 * @returns {boolean} json.success - true or false depending on what appened.
 * @returns {string} fail_json.message - String to explain what appened.
 */
function checkValidityofIntAnswer(currentSurvey, currentQuestionNumber, answer) {
	// We do transform the string into an int to use it as it
	const intAnswer = parseInt(answer);
	// We do get the object representing our fork of answers with their value
	const forksAnswers = currentSurvey.Questions[currentQuestionNumber].forksAnswers;
	let scoreToGive = NaN;

	loop : {
		for (let j = 0; j < forksAnswers.length; j++) {
			let limits = forksAnswers[j].fork.split("-");

			// If the valu get isn't containing a *-* we consider that it's a maximum value and above (ex: 10+)
			if (!limits[1]) {
				limits = forksAnswers[j].fork.split("+");
				const fork = {min: limits[0], max: NaN};
				// Then if the answer we had as parameter is superior or equal to the value of the fork, we assign the score for this fork to the variabl *value* of th question
				if (intAnswer >= fork.min) {
					scoreToGive = forksAnswers[j].value;
					// Break for the block named loop (not the for loop) to be able to return
					break loop;
				} else {
					// Else we try with the next fork value
					continue;
				}
			}

			const fork = {min: limits[0], max: limits[1]};
			// Then if the answer we had as parameter is between the values of the fork, we assign the score for this fork to the variable *value* of th question
			if (intAnswer >= fork.min && intAnswer <= fork.max) {
				scoreToGive = forksAnswers[j].value;
				// Break for the block named loop (not the for loop) to be able to return
				break loop;
			} else {
				// Else we try with the next fork value
				continue;
			}
		}
	}

	// If the value receinved isn't in the fork values, we return FAIL and send an error message
	if (isNaN(scoreToGive))
		return ({success: false, message: "Variable scoreToGive isn't a number"});

	currentSurvey.Questions[currentQuestionNumber].score = scoreToGive;
	return ({success: true});
}


/**
 * Module with function to parse the input received and tell if the input is valid dependind on what we were waiting as response.
 *
 * Code of function checkAnswer with comments:
 * ```
function(currentSurvey, currentQuestionNumber, waitingTypesOfAnswer) {
	const answer = (typeof(currentSurvey.Questions[currentQuestionNumber].value) === "string" ? currentSurvey.Questions[currentQuestionNumber].value.toLowerCase().trim() : currentSurvey.Questions[currentQuestionNumber].value);

	// We do loop on each response we were waiting for and each types of response we can have
	for (let i = 0; i < waitingTypesOfAnswer.length; i++) {
		// If answer is only *yes* or *no*
		if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BOOL && (answer === "oui" || answer === "non")) {
			//  We do set the variable *value* to true if the anwser is *yes* because by default it's false
			currentSurvey.Questions[currentQuestionNumber].score = (answer === "oui" ? 1 : 0);
			return ({success: true});

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.FAR || waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.NEAR) {
			// If the answer dosn't match with a dat like DD/MM/YYYY (year commencing between 19 or 20) it will be considered as not a date send
			if (!answer.match(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/))
				continue;
			return (checkValidityofDateAnswer(currentSurvey, currentQuestionNumber, answer, waitingTypesOfAnswer, i));

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BRUT.INT && Number.isInteger(parseInt(answer)))
			return (checkValidityofIntAnswer(currentSurvey, currentQuestionNumber, answer));

		else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.BRUT.STRING) {
			// Here, there is nothing to analyze so we only give a point (by setting *value* to true)
			currentSurvey.Questions[currentQuestionNumber].value = 1;
			return ({success: true});

		} else if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.ANSWERS) {
			// Here we check is the answer is in an array of answers given
			const answers = currentSurvey.Questions[currentQuestionNumber].answers;
			for (let j = 0; j < answers.length; j++)
				if (answer === answers[j].name.toLowerCase().trim()) {
					currentSurvey.Questions[currentQuestionNumber].score = answers[j].value;
					return ({success: true});
				}
		}
	}

	// By default we return an error message and FAIL
	return ({success: false, message: `${answer} is not a good value`});
}
```
 *
 * Code of function checkValidityofDateAnswer with comments:
 * ```
function checkValidityofDateAnswer(currentSurvey, currentQuestionNumber, answer, waitingTypesOfAnswer, i) {
	// We do split the answer by / character to get the day (2 digits), the month (2 digits) and the year (4 digits)
	const pdate = answer.split('/');
	const dd = parseInt(pdate[0]);
	const mm  = parseInt(pdate[1]);
	const yy = parseInt(pdate[2]);
	// Create list of days of a month (assume there is no leap year by default)
	const nbOfDays = [31,28,31,30,31,30,31,31,30,31,30,31];

	// Then we do chck if the date is valid
	if ((mm == 1 || mm > 2) && dd > nbOfDays[mm - 1])
		return ({success: false, message: "Invalid date"});

	if (mm == 2) {
		let lyear = FAIL;
		if ((yy % 4 !== 0 && yy % 100 === 0) || yy % 400 === 0)
			lyear = true;
		if (!lyear && dd >= 29)
			return ({success: false, message: "Invalid date"});
		if (lyear && dd > 29)
			return ({success: false, message: "Invalid date"});
	}

	const now = new Date();
	const answerDate = new Date(+yy, mm - 1, +dd);

	if (!answerDate || answerDate > now)
		return ({success: false, message: "Invalid date"});

	const yearsDiff =  now.getFullYear() - answerDate.getFullYear();
	const monthsDiff = (yearsDiff * 12) + (now.getMonth() - answerDate.getMonth());

	// At the end we compare if the result is near or far from today's date
	if (waitingTypesOfAnswer[i] == POSSIBLE_ANSWERS.DATE.FAR) {
		// If it's a far date awaited we give more score for date superior to one year
		if (monthsDiff > 12)
			currentSurvey.Questions[currentQuestionNumber].score = 3;
		else
			currentSurvey.Questions[currentQuestionNumber].score = 1;
	} else {
		// If it's a near date awaited we give more score for date inferior to six months
		if (monthsDiff < 6)
			currentSurvey.Questions[currentQuestionNumber].score = 3;
		else
			currentSurvey.Questions[currentQuestionNumber].score = 1;
	}
	return ({success: true});
}
```
 *
 * Code of function checkValidityofIntAnswer with comments:
 * ```
function checkValidityofIntAnswer(currentSurvey, currentQuestionNumber, answer) {
	// We do transform the string into an int to use it as it
	const intAnswer = parseInt(answer);
	// We do get the object representing our fork of answers with their value
	const forksAnswers = currentSurvey.Questions[currentQuestionNumber].forksAnswers;
	let scoreToGive = NaN;

	loop : {
		for (let j = 0; j < forksAnswers.length; j++) {
			let limits = forksAnswers[j].fork.split("-");

			// If the valu get isn't containing a *-* we consider that it's a maximum value and above (ex: 10+)
			if (!limits[1]) {
				limits = forksAnswers[j].fork.split("+");
				const fork = {min: limits[0], max: NaN};
				// Then if the answer we had as parameter is superior or equal to the value of the fork, we assign the score for this fork to the variabl *value* of th question
				if (intAnswer >= fork.min) {
					scoreToGive = forksAnswers[j].value;
					// Break for the block named loop (not the for loop) to be able to return
					break loop;
				} else {
					// Else we try with the next fork value
					continue;
				}
			}

			const fork = {min: limits[0], max: limits[1]};
			// Then if the answer we had as parameter is between the values of the fork, we assign the score for this fork to the variable *value* of th question
			if (intAnswer > fork.min && intAnswer <= fork.max) {
				scoreToGive = forksAnswers[j].value;
				// Break for the block named loop (not the for loop) to be able to return
				break loop;
			} else {
				// Else we try with the next fork value
				continue;
			}
		}
	}

	// If the value receinved isn't in the fork values, we return FAIL and send an error message
	if (isNaN(scoreToGive))
		return ({success: false, message: "Variable scoreToGive isn't a number"});

	currentSurvey.Questions[currentQuestionNumber].score = scoreToGive;
	return ({success: true});
}
```
 * @module module:checkAnswer
 * @see checkValidityofDateAnswer
 * @see checkValidityofIntAnswer
 */