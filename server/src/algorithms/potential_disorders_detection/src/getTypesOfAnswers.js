/**
 * Function to display questions and possible answers depending of variables in the current question.
 * @function getTypesOfAnswer
 * @param {JSON} currentSurvey - Current survey we are working with.
 * @param {int} currentQuestionNumber - Number of the current question in the survey we are working with.
 * @returns {object} - Returns an array of [possible answers]{@link POSSIBLE_ANSWERS}.
 * @throws Throw an error if the type of [POSSIBLE_ANSWERS.BRUT]{@link POSSIBLE_ANSWERS} isn't a int or a string.
 * @throws Throw an error if brutAnswer AND forksAnswers aren't both defined in the current question.
 */
module.exports = function(currentSurvey, currentQuestionNumber) {
	// First we initialize the array of waitnig types response
	const waitingTypesOfAnswer = [];
	const question = currentSurvey.Questions[currentQuestionNumber];
	const types = question.types;

	for (let i = 0; i < types.length; i++)
		switch (types[i]) {
			case ("BOOL"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BOOL);
				break;

			case ("DATE.NEAR"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.DATE.NEAR);
				break;

			case ("DATE.FAR"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.DATE.FAR);
				break;

			case ("ANSWERS"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.ANSWERS);
				break;

			case ("BRUT.INT"):
				if (!question.forksAnswers) {
					// If BRUT.INT is a possible type of answer, forksAnswers must also be defined in the question else we'll throw an error
					throw Error("If BRUT.INT is a possible type of answer, forksAnswers must also be defined in the question to be used");
				}
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BRUT.INT);
				break;

			case ("BRUT.STRING"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BRUT.STRING);
				break;

			default:
				throw Error(`Type ${types[i]} is not valid`);
		}
	return (waitingTypesOfAnswer);
};

/**
 * Module with the function getTypesOfAnswers to know waited types of answers for a question.
 * 
 * Code with comments:
 * ```
function(currentSurvey, currentQuestionNumber) {
	// First we initialize the array of waitnig types response
	const waitingTypesOfAnswer = [];
	const question = currentSurvey.Questions[currentQuestionNumber];
	const types = questions.types;

	for (let i = 0; i < types.length; i++)
		switch (types[i]) {
			case ("BOOL"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BOOL);
				break;

			case ("DATE.NEAR"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.DATE.NEAR);
				break;

			case ("DATE.FAR"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.DATE.FAR);
				break;

			case ("BRUT.INT"):
				if (!question.forksAnswers) {
					// If BRUT.INT is a possible type of answer, forksAnswers must also be defined in the question else we'll throw an error
					throw Error("If BRUT.INT is a possible type of answer, forksAnswers must also be defined in the question to be used");
				}
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BRUT.INT);
				break;

			case ("BRUT.STRING"):
				waitingTypesOfAnswer.push(POSSIBLE_ANSWERS.BRUT.STRING);
				break;

			default:
				throw Error(`Type ${type[i]} is not valid`);
		}
	return (waitingTypesOfAnswer);
}
```
 * @module module:getTypesOfAnswers
 * @see module:countMaxPoints
 * @see module:countPoints
*/