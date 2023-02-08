/**
 * Function to get the user's current points for a current survey.
 * @function countPoints
 * @param {JSON} currentSurvey - Current survey we are working with
 * @returns {int} score - Returns the score of the user for the current survey
 */
module.exports = function(currentSurvey) {
	// First we define the vaiable we'll increment in our loop
	let score = 0;

	for (let i = 0; i < currentSurvey.Questions.length; i++) {
		// If the question isn't answered, we cannot add points so with jump to next loop turn
		if (!currentSurvey.Questions[i].answered)
			continue;
		score += currentSurvey.Questions[i].score;
	}
	return (score);
};

/**
 * Module with function to get the user's current points for a current survey.
 * 
 * Code with comments:
 * ```
function(currentSurvey) {
	// First we define the vaiable we'll increment in our loop
	let score = 0;

	for (let i = 0; i < currentSurvey.Questions.length; i++) {
		// If the question isn't answered, we cannot add points so with jump to next loop turn
		if (!currentSurvey.Questions[i].answered)
			continue;
		score += currentSurvey.Questions[i].score;
	}
	return (score);
}
```
 * @module module:countPoints
 */