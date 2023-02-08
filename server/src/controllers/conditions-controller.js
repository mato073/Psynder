
function getLastQuestionName(questions)
{
	const i = (questions.length - 1) ;
	return (questions[i].name);
}

function findCondition(conditions, questions)
{
	let result = 0;
	let value = true;

	conditions.map((condition) => {
		questions.map((question) => {
			if (question.name.startsWith(condition.name) && question.value === "oui" && condition.value === true )
				result++;
			else if (question.name.startsWith(condition.name)&& question.value === "non" && condition.value === false)
				result++;
		});

		if (result < condition.number)
			value = false;
		result = 0;
	});

	return (value);
}

function parseConditions(questions, conditions)
{
	let name = getLastQuestionName(questions);
	let value = false;

	if (name.length >= 3)
		name = name.substring(0, 2);

	conditions.map((condition) => {
		if (condition.find(newName => newName.name === name )) {
			if (findCondition(condition, questions))
				value = true;
		}
	});

	return (value);
}

// POST
exports.checkConditions = function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	if (!req.body.questions|| !req.body.conditions) {
		res.status(400).send({
			message: "Failed to get conditions or questions in body",
		});
	}

	const result = parseConditions(req.body.questions, req.body.conditions);
	if (result === true) {
		res.status(200).send({
			message: "Condition true, exit survey",
			continuer: result
		});
	} else if (result === false) {
		res.status(200).send({
			message: "Condition false, continue survey",
			continuer: result
		});
	} else {
		res.status(400).send({
			message: "Conditions not found",
		});
	}
};