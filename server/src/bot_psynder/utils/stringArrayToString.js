/**
 * @function stringArrayToString
 * @param {string[]} arr - Array of strings
 * @param {string} separator - Element to put between each string, empty string by default
 * @param {int} start - Index to start, 0 by default
 * @param {int} end - Index to stop, array length by default
 * @returns {string}
 */

module.exports = function stringArrayToString(arr, separator = "", start = 0, end = arr.length)
{
	let res = "";

	for (let i = start; i < end; i++)
		res += (i === start ? "" : separator) + arr[i];

	return res;
};