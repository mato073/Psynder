/**
 * Function to get the values that correspond to the values of each fork value.
 * @async
 * @function getValuesOfForksAnswersInArray
 * @param {object[]} arr Array of objects that looks like [{"fork": "int-int", "value": int}]
 * @returns {int[]} Return an array of int corresponding to the values of each fork value.
 */

module.exports = function(arr) {
	const values = [];

	for (let i = 0; i < arr.length; i++)
		values.push(arr.value);
	return (values);
};

/**
 * Module with function to get the values that correspond to the values of each fork value.
 * 
 * Code with comments:
 * ```
function(arr) {
	const values = [];

	for (let i = 0; i < arr.length; i++)
		values.push(arr.value);
	return (values);
}
```
 * @module module:getValuesOfForksAnswersInArray
 */