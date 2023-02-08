const getValuesOfForksAnswersInArray = require("./getValuesOfForksAnswersInArray.js");

/**
 * Function to get the maximum of points available for a current survey.
 * @function countMaxPoints
 * @param {JSON} currentSurvey - Current survey we are working with
 * @returns {int} maxScore - Returns the maximum score available for the current survey
 */
module.exports = function(currentSurvey) {
	// First we define the variable we'll increment in our loop
	let maxScore = 0;
	
	// We do loop on each questions of the current survey
	for (let i = 0; i < currentSurvey.Questions.length; i++) {
		// We do check each possible answer and keep only the one with the biggest value
		const types = currentSurvey.Questions[i].types;
		let currentBiggestValueToAdd = 0;
		let biggestValue = 0;

		for (let j = 0; j < types.length; j++)
			switch (types[j]) {
				case ("BOOL"):
					if (1 > currentBiggestValueToAdd)
						currentBiggestValueToAdd = 1;
					break;
				case ("DATE.NEAR"):
				case ("DATE.FAR"):
					if (3 > currentBiggestValueToAdd)
						currentBiggestValueToAdd = 3;
					break;
				case ("ANSWERS"):
					// If we got pre-configured answers, we try to get the biggest value by calling the function getValuesOfAnswersObjectArray and sorting the result in descending order
					biggestValue = getValuesOfAnswersObjectArray(currentSurvey.Questions[i].answers).sort((a, b) => {return (b-a);})[0];
					if (biggestValue > currentBiggestValueToAdd)
						currentBiggestValueToAdd = biggestValue;
					break;
				case ("BRUT.INT"):
				case ("BRUT.STRING"):
					if (!currentSurvey.Questions[i].forksAnswers)
						break;
					// If we got a fork of values, we try to get the biggest value by calling the function getValuesOfForksAnswersInArray and sorting the result in descending order
					biggestValue = getValuesOfForksAnswersInArray(currentSurvey.Questions[i].forksAnswers).sort((a, b) => {return (b-a);})[0];
					if (biggestValue > currentBiggestValueToAdd)
						currentBiggestValueToAdd = biggestValue;
					break;
				default:
					throw Error(`Type ${types[i]} is not valid`);
			}

		maxScore += currentBiggestValueToAdd;
	}

	return (maxScore);
};

/**
 * Function to get an array of int that are points of answer pre-configured for the curent question.
 * @function getValuesOfAnswersObjectArray
 * @param {object[]} anwsers Answer of the current question (in the array of questions in the Survey) we are counting points of (stored like [{"name": string, "value": int}])
 * @returns {int[]} Return an array of int that are points of answer pre-configured
 */
function getValuesOfAnswersObjectArray(answers) {
	const res = [];

	// We just do loop on each value on the array of *answers* and get the value parameter to store it in the array *res* to return it then
	for (let i = 0; i < answers.length; i++)
		res.push(answers[i].value);

	return (res);
}

/**
 * Module with function to get the maximum of points available for a current survey.
 * 
 * Code with comments for the function countMaxPoints:
 * ```
function(currentSurvey) {
	// First we define the variable we'll increment in our loop
	let maxScore = 0;
	
	// We do loop on each questions of the current survey
	for (let i = 0; i < currentSurvey.Questions.length; i++) {
		// We do check each possible answer and keep only the one with the biggest value
		const types = currentSurvey.Questions[i].types;
		let currentBiggestValueToAdd = 0;
		let biggestValue = 0;

		switch (types[i]) {
			case ("BOOL"):
				if (1 > currentBiggestValueToAdd)
					currentBiggestValueToAdd = 1;	
				break;
			case ("DATE.NEAR"):
			case ("DATE.FAR"):
				if (3 > currentBiggestValueToAdd)
					currentBiggestValueToAdd = 3;
				break;
			case ("ANSWERS"):
				// If we got pre-configured answers, we try to get the biggest value by calling the function getValuesOfAnswersObjectArray and sorting the result in descending order
				biggestValue = getValuesOfAnswersObjectArray(currentSurvey.Questions[i].answers).sort((a, b) => {return (b-a);})[0];
				if (biggestValue > currentBiggestValueToAdd)
					currentBiggestValueToAdd = biggestValue;
				break;
			case ("BRUT.INT"):
			case ("BRUT.STRING"):
				if (!currentSurvey.Questions[i].forksAnswers)
					break;
				// If we got a fork of values, we try to get the biggest value by calling the function getValuesOfForksAnswersInArray and sorting the result in descending order
				biggestValue = getValuesOfForksAnswersInArray(currentSurvey.Questions[i].forksAnswers).sort((a, b) => {return (b-a);})[0];
				if (biggestValue > currentBiggestValueToAdd)
					currentBiggestValueToAdd = biggestValue;
				break;
			default:
				throw Error(`Type ${type[i]} is not valid`);
		}

		maxScore += currentBiggestValueToAdd;
	}

	return (maxScore);
}
```
 * Code with comments for the function getValuesOfAnswersObjectArray:
 * ```
function getValuesOfAnswersObjectArray(answers) {
	const res = [];

	// We just do loop on each value on the array of *answers* and get the value parameter to store it in the array *res* to return it then
	for (let i = 0; i < answers.length; i++)
		res.push(answers[i].value);

	return (res);
}
```
 * @module module:countMaxPoints
 * @see module:getValuesOfForksAnswersInArray
 */