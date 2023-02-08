const fs = require("fs");
const path = require("path");

module.exports = function()
{
	const pathToFiles = path.join(__dirname, "../../prepareDataBase/results");
	const filesNamesArray = fs.readdirSync(pathToFiles);

	for (let i = 0; i < filesNamesArray.length;) {
		if (!filesNamesArray[i].endsWith(".json")) {
			filesNamesArray.splice(i, 1);
			i = 0;
		} else
			i++;
	}

	const dates = [];
	for (let i = 0; i < filesNamesArray.length; i++) {
		const getDate = resetToCleanDateFormat(filesNamesArray[i]);
		if (isValidDate(getDate))
			dates.push(getDate);
	}
	dates.sort((a,b) => a.getTime() - b.getTime());


	const latestDate = dates.pop();
	const fileName = `${pathToFiles}/${latestDate.toISOString().replace(/:/g, "-")}.json`;
	const rawdata = fs.readFileSync(fileName);
	const latestsFile = JSON.parse(rawdata);
	fs.unlinkSync(fileName);

	return (latestsFile);
};

function isValidDate(d) {
	return d instanceof Date && !isNaN(d);
}

function resetToCleanDateFormat(str)
{
	const splitDate = str.split('T');

	const regroupedDate = new Date(`${splitDate[0]}T${splitDate[1].split(".json")[0].replace(/-/g, ':')}`);

	return (regroupedDate);
}