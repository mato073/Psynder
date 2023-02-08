/**
 * Function to check if all questions with a specific name has been answered.
 * @function allQuestionsAnsweredWithNameStartingBy
 * @param {string} name Name of the questions that has to match with.
 * @param {JSON} currentSurvey - Current survey we are working with
 * @returns {(SUCCESS|FAIL)} Return SUCCESS or FAIL depending of what appens.
 */
module.exports = function(currentSurvey, name) {
	let quantity = 0;
	let answered = 0;

	for (let i = 0; i < Survey.Questions.length; i++)
		if (currentSurvey.Questions[i].name.toLowerCase().startsWith(name)) {
			quantity++;
			if (currentSurvey.Questions[i].answered)
				answered++;
		}

	if (answered === quantity)
		return (SUCCESS);
	return (FAIL);
};


/**
 * Module with function to check if all questions with a specific name has been answered.
 * 
 * Code with comments:
 * ```
function(name) {
	let quantity = 0;
	let answered = 0;

	for (let i = 0; i < Survey.Questions.length; i++)
		if (Survey.Questions[i].name.toLowerCase().startsWith(name)) {
			quantity++;
			if (Survey.Questions[i].answered)
				answered++;
		}

	if (answered === quantity)
		return (SUCCESS);
	return (FAIL);
}
```
 * @module module:allQuestionsAnsweredWithNameStartingBy
 */