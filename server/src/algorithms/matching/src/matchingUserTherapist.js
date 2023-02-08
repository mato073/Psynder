const getSpecialtiesFromIDs = require("./getSpecialtiesFromIDs.js");
const hasTherapistAlreadyTreatedDisorder = require("./hasTherapistAlreadyTreatedDisorder.js");
const isDisorderManagedBySpecialitiesOfTherapist = require("./isDisorderManagedBySpecialitiesOfTherapist.js");

module.exports = async function (user, therapist) {
	let matchingPercentage = 0;
	let majorDisordereMatched = false;

	const potentialDisorders = user.potentialDisorders; // potential disorders of the user
	const disordersAlreadyTreated = therapist.alreadyTreated; // disorders treated by the therapist and if at least one person cured
	let specialties = await getSpecialtiesFromIDs(therapist.specialties); // get specialties of the therapist from their ID

	if (!specialties.success)
		return ({message: specialties.message});
	specialties = specialties.specialties;

	// We do loop on each potential disorder of the user
	for (let i = 0; i < potentialDisorders.length; i++) {
		const disorder = potentialDisorders[i];
		// Then we check if the therapist has already treaded someone with this disorder and if the person was cured
		const therapistHasAlreadyTreatedDisorder = hasTherapistAlreadyTreatedDisorder(disorder, disordersAlreadyTreated);

		// if the user doesn't get the disorder but get a score precentage between 30 and 49 (included) we add 3 to the matching percentage
		if (!disorder.getDisorder) {
			const scorePercentage = disorder.score * 100 / disorder.maxScore;

			if (scorePercentage >= 30 && scorePercentage < 50 && therapistHasAlreadyTreatedDisorder.has) {
				if (!therapistHasAlreadyTreatedDisorder.withSuccess)
					matchingPercentage -= 3;
				matchingPercentage += 3;
			}
			continue;
		}

		// We check if the therapist got the disorder as specialty
		if (isDisorderManagedBySpecialitiesOfTherapist(disorder, specialties)) {
			// if yes, and we don't already found a specialty for the therapist we add 50 to matching percentage, else we add 5
			if (!majorDisordereMatched) {
				matchingPercentage += 50;
				majorDisordereMatched = true;
			} else
				matchingPercentage += 5;
		}

		if (therapistHasAlreadyTreatedDisorder.has) {
			// if the person cured, we add 2% else we remove them
			if (therapistHasAlreadyTreatedDisorder.withSuccess)
				matchingPercentage += 2;
			else
				matchingPercentage -= 2;
		}
	}

	return ({therapistId: therapist._id, matchingPercentage: matchingPercentage});
};

/**
 * Module that compares the user with one therapist to make the matching percentage.
 * 
 * Code with comments:
 * ```
async function (user, therapist) {
	let matchingPercentage = 0;
	let majorDisordereMatched = false;

	const potentialDisorders = user.potentialDisorders; // potential disorders of the user
	const disordersAlreadyTreated = therapist.alreadyTreated; // disorders treated by the therapist and if at least one person cured
	let specialties = await getSpecialtiesFromIDs(therapist.specialties); // get specialties of the therapist from their ID

	if (!specialties.success)
		return ({message: specialties.message});
	specialties = specialties.specialties;

	// We do loop on each potential disorder of the user
	for (let i = 0; i < potentialDisorders.length; i++) {
		const disorder = potentialDisorders[i];
		// Then we check if the therapist has already treaded someone with this disorder and if the person was cured
		const therapistHasAlreadyTreatedDisorder = hasTherapistAlreadyTreatedDisorder(disorder, disordersAlreadyTreated);

		// if the user doesn't get the disorder but get a score precentage between 30 and 49 (included) we add 3 to the matching percentage
		if (!disorder.getDisorder) {
			const scorePercentage = disorder.score * 100 / disorder.maxScore;

			if (scorePercentage >= 30 && scorePercentage < 50 && therapistHasAlreadyTreatedDisorder.has) {
				if (!therapistHasAlreadyTreatedDisorder.withSuccess)
					matchingPercentage -= 3;
				matchingPercentage += 3;
			}
			continue;
		}

		// We check if the therapist got the disorder as specialty
		if (isDisorderManagedBySpecialitiesOfTherapist(disorder, specialties)) {
			// if yes, and we don't already found a specialty for the therapist we add 50 to matching percentage, else we add 5
			if (!majorDisordereMatched) {
				matchingPercentage += 50;
				majorDisordereMatched = true;
			} else
				matchingPercentage += 5;
		}

		if (therapistHasAlreadyTreatedDisorder.has) {
			// if the person cured, we add 2% else we remove them
			if (therapistHasAlreadyTreatedDisorder.withSuccess)
				matchingPercentage += 2;
			else
				matchingPercentage -= 2;
		}
	}

	return ({therapistId: therapist._id, matchingPercentage: matchingPercentage});
}
```
 * @module module:matchingUserTherapist
 * @see module:matching
 * @see module:getSpecialtiesFromIDs
 * @see module:isDisorderManagedBySpecialitiesOfTherapist
 * @see module:hasTherapistAlreadyTreatedDisorder
 */