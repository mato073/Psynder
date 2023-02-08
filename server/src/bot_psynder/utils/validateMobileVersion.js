/**
 * @function validateMobileVersion
 * @param {string} currentVersion - Current mobile app version in the following form: major.minor.patch
 * @param {string} newVersion - New mobile app version in the following form: major.minor.patch
 * @returns {object} obj - Object returned
 * @returns {boolean} obj.success - Boolean representing the success or fail of the validation
 * @returns {string} fail_obj.message - In case of fail, a message can be set with explanation of what happened
 */


module.exports = function validateMobileVersion(curVer, newVer)
{
	if (newVer === curVer)
		return ({success: false, message: "The version you want to set is the same as the current one"});

	const curParts = curVer.split(".");
	const newParts = newVer.split(".");
	if (newParts.length != 3)
		return ({success: false});

	for (let i = 0; i < 3; i++) {
		const a = ~~newParts[i]; // parse int
		const b = ~~curParts[i]; // parse int

		if (a >= b)
			continue;
		else
			return ({success: false, message: `**${newParts[i]}** is inferior to current ${(i == 0 ? "major" : (i == 1 ? "minor" : "patch"))} version (**${curParts[i]}**), so not valided`});
	}
	return ({success: true});
};