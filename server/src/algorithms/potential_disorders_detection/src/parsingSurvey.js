module.exports = function(survey) {
	if (survey.potentialDisorder === undefined || typeof(survey.potentialDisorder) !== "string")
		return false;

	if (survey.Questions === undefined || typeof(survey.Questions) !== "object" || !survey.Questions.length)
		return false;

	for (let i = 0; i < survey.Questions.length; i++) {
		const question = survey.Questions[i];
		if (question.types === undefined || typeof(question.types) !== "object" || !question.types.length || !checkValuesTypesOfAnswer(question.types))
			return false;
		if (question.answered === undefined || typeof(question.answered) !== "boolean")
			return false;
		if (question.value === undefined || (typeof(question.value) !== "boolean" && typeof(question.value) !== "string" && typeof(question.value) !== "number"))
			return false;
	}

	return true;
};

function checkValuesTypesOfAnswer(types) {
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (type === undefined || (type !== "BOOL" && type !== "DATE.NEAR" && type !== "DATE.FAR" && type !== "ANSWERS" && type !== "BRUT.INT" && type !== "BRUT.STRING"))
			return false;
	}

	return true;
}

/**
 * Module with a function to parse the survey received by the algorithm to detect potential depression disorders.
 * 
 * Code with comments:
 * ```
function(survey) {
	if (survey.potentialDisorder === undefined || typeof(survey.potentialDisorder) !== "string")
		return false;

	if (survey.Questions === undefined || typeof(survey.Questions) !== "object" || !survey.Questions.length)
		return false;

	for (let i = 0; i < survey.Questions.length; i++) {
		const question = survey.Questions[i];
		if (question.types === undefined || typeof(question.types) !== "object" || !question.types.length || !checkValuesTypesOfAnswer(question.types))
			return false;
		if (question.answered === undefined || typeof(question.answered) !== "boolean")
			return false;
		if (question.value === undefined || (typeof(question.value) !== "boolean" && typeof(question.value) !== "string" && typeof(question.value) !== "number"))
			return false;
	}

	return true;
};

function checkValuesTypesOfAnswer(types) {
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (type === undefined || (type !== "BOOL" && type !== "DATE.NEAR" && type !== "DATE.FAR" && type !== "ANSWERS" && type !== "BRUT.INT" && type !== "BRUT.STRING"))
			return false;
	}

	return true;
}
```
 * @module module:parsingSurvey
 * @see module:potentialDisordersDetection
 */