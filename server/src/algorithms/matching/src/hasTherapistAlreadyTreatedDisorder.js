module.exports = function(disorder, disordersAlreadyTreated) {
	for (let i = 0; i < disordersAlreadyTreated.length; i++) {
		const alreadyTreatedDisorder = disordersAlreadyTreated[i];
		if (disorder.name === alreadyTreatedDisorder.name) {
			if (alreadyTreatedDisorder.cured)
				return ({has: true, withSuccess: true});
			return ({has: true, withSuccess: false});
		}
	}
	return ({has: false});
};

/**
 * Module that check if the therapist has already treaded someone with this disorder and if the person was cured.
 * 
 * Code with comments:
 * ```
function(disorder, specialties) {
	for (let i = 0; i < specialties.length; i++) { // list of specialties of the therapist
		const disorders = specialties[i].managedDisorders; // list of disorders of each specialty of the therapist
		for (let j = 0; j < disorders.length; j++)
			if (disorder.name === disorders[j])
				return true;
	}
	return false;
}
```
 * @module module:hasTherapistAlreadyTreatedDisorder
 * @see module:matchingUserTherapist
 */