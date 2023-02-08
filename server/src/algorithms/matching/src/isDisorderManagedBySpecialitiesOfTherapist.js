module.exports = function(disorder, specialties) {
	for (let i = 0; i < specialties.length; i++) { // list of specialties of the therapist
		const disorders = specialties[i].managedDisorders; // list of disorders of each specialty of the therapist
		for (let j = 0; j < disorders.length; j++)
			if (disorder.name === disorders[j])
				return true;
	}
	return false;
};

/**
 * Module that check if the therapist got the disorder as specialty.
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
 * @module module:isDisorderManagedBySpecialitiesOfTherapist
 * @see module:matchingUserTherapist
 */