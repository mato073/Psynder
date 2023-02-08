const readline = require("readline");
const path = require("path");
const db = require("./db.js");

const args = process.argv.slice(2);

function question(str, hidden = false)
{
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	if (hidden) {
		let t = true;
		rl._writeToOutput = (a) => {
			if (t) {
				rl.output.write(a);
				t = false;
			} else
				rl.output.write("*");
		};
	}

	return new Promise(resolve => rl.question(str, answer => {
		if (hidden)
			rl.output.write("\n");
		rl.close();
		resolve(answer);
	}));
}

let filepath = "N/A";
let collectionName = "N/A";

function parseArgs()
{
	if (!args[0]) {
		console.log("Please add a flag to give parameters to the script (you can check flags with --help / -H / -h)");
		process.exit(1);
	}

	let res;

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case ("-p"):
			case ("--path"):
				if (!args[i + 1] || args[i + 1].startsWith("-")) {
					console.log("The next argument cannot be inexistant or another flag");
					process.exit(1);
				}
				i++;
				filepath = args[i];
				break;

				case ("-cn"):
				case ("--collectionName"):
					if (!args[i + 1] || args[i + 1].startsWith("-")) {
						console.log("The next argument cannot be inexistant or another flag");
						process.exit(1);
					}
					i++;
					collectionName = args[i];
					break;

			case ("--help"):
			case ("-H"):
			case ("-h"):
				console.log("This script was made to create,remove or update variables in schema validation for MongoDB collections.\n\x1b[31mIf a schema validator is not close enough of the previous one, it could fail or worse corrupt the collection. Be warned !\x1b[0m\n\nAuthorized args:\n\t--collectionName / -cn\tTo tell which collection to edit\n\t--path / -p\t\tTo tell which file to edit collection with\n\t--help / -H / -h\tTo get the help page");
				process.exit(0);
				break;

			default:
				console.log(`Arg '${args[0]}' not reconized`);
				process.exit(1);
				break;
		}
	}

	if (filepath === "N/A" || collectionName === "N/A") {
		console.log("The file path and the name of the collection have to be both defined");
		process.exit(1);
	}
}

async function _main()
{
	parseArgs();

	const absoluteFilePath = path.resolve(process.cwd(), filepath);
	const schemaValidator = require(absoluteFilePath);

	const validationWarning = await question("Modifying schema validator will result in the modification of filed '\x1b[33mvalidationLevel\x1b[0m' to '\x1b[33mmoderate\x1b[0m' and filed '\x1b[33mvalidationAction\x1b[0m' to '\x1b[33mwarn\x1b[0m'.\nDo you agree with that ? [yes/No] ");
	const validationWarningString = validationWarning.toLowerCase();
	if (validationWarningString[0] !== "y") {
		console.log("Process exited with success");
		process.exit(0);
	}

	await db.connect();

	setTimeout(async() => {
		const collectionNames = await db.getCollectionNames();

		if (collectionNames.find(elem => elem.name === collectionName)) {
			console.log(`Collection ${collectionName} found`);

			const objCommand = {};
			objCommand.collMod = collectionName;
			objCommand.validator = schemaValidator.validator;
			objCommand.validationLevel = "moderate";
			objCommand.validationAction = "warn";

			const res = await db.get().command(objCommand);
			if (res.ok == 1) {
				console.log("Operation succeed !");
				process.exit(0);
			} else {
				console.log("Operation failed...");
				process.exit(1);
			}

		} else {
			console.log(`Collection ${collectionName} not found\nCollection will be created with schema validator given as parameter`);
			db.createCollection(db.get(), collectionName, schemaValidator);
		}
	}, 1000);
}

_main();