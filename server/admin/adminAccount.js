const readline = require("readline");
const util = require("util");
const bcrypt = require("bcrypt");
const db = require("./db.js");
const tokenUtils = require("./token-utils.js");
const actualId = require("./social-auth-utils.js").actualId;
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

let uid;
let email;
let pwd;

async function createAccount()
{
	try {

		email = await question("Email: ");
		pwd = await question("Password: ", true);

		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("AdminUsers").findOne({"email": email});
		if (resGettingDB)
			return ({success: false, message: "Email already used"});

		const res = await bcrypt.hash(pwd, 10).then(async (hash) => {
			if (!hash)
				return ({success: false, message: "Hashing pasword error"});

			const resInsertDB = await db.get().collection("AdminUsers").insertOne({
				"email": email,
				"password": hash,
			});

			if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
				return ({success: false, message: "Error when inserting into collection"});

			return ({success: true});
		});

		return res;
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		let message = exception.message;

		if (exception.message !== "Email already used" && exception.message !== "Bad type informations" && exception.message !== "Informations are missing") {
			const resGettingDB = await db.get().collection("AdminUsers").findOne({"email": email});
			if (!resGettingDB)
				message += ". Error when fetching user from collection (user may not have been added)";

			const resDeletingDB = await db.get().collection("AdminUsers").deleteOne(resGettingDB);
			if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1)
				message += ". Error when removing user into collection (user may not have been added)";
		}

		console.log(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		return ({success: false, message: message});
	}
}

async function connectAccount()
{
	try {
		email = await question("Email: ");
		pwd = await question("Password: ", true);

		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("AdminUsers").findOne({"email": email});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching user from collection"});

		const jwtPair = await bcrypt.compare(pwd, resGettingDB.password).then((isValid => {
			if (!isValid)
				return ({success: false, message: "Incorrect password"});
			return ({success: true, res: tokenUtils.generateJWTPair(resGettingDB._id, role = "admin")});
		}));

		if (!jwtPair.success)
			return ({success: false, message: jwtPair.message});
		return ({success: true, jwtPair: jwtPair.res, uid: resGettingDB._id});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function deleteAccount()
{
	try {
		uid = await question("Admin uid: ");

		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("AdminUsers").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching AdminUsers from collection"});

		const resDeletingDB = await db.get().collection("AdminUsers").deleteOne(resGettingDB);
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when removing admin from collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function parseArgs()
{
	if (!args[0]) {
		console.log("Please add a flag to let know what you want to do (you can check flags with --help / -H / -h)");
		process.exit(-1);
	}

	let res;
	switch (args[0]) {
		case ("--create"):
		case ("-C"):
			res = await createAccount();
			if (!res.success) {
				console.log(res.message);
				process.exit(-1);
			}
			console.log("Admin account created");

			break;

		case ("--login"):
		case ("-L"):
			res = await connectAccount();
			if (!res.success) {
				console.log(res.message);
				process.exit(-1);
			}
			console.log(`Admin account logged:\n\t- tokens: ${util.inspect(res.jwtPair, {showHidden: false, depth: null})}\n\t- uid: ${res.uid}`);
			break;

		case ("--delete"):
		case ("-D"):
			res = await deleteAccount();
			if (!res.success) {
				console.log(res.message);
				process.exit(-1);
			}
			console.log("Admin account deleted");
			break;

		case ("--help"):
		case ("-H"):
		case ("-h"):
			console.log("Authorized args:\n\t--create / -C (will ask email and password)\n\t--login / -L (will ask email and password, will return access token)\n\t--delete / -D (will ask for admin uid)\n\t--help / -H / -h");
			process.exit(0);
			break;

		default:
			console.log(`Arg '${args[0]}' not reconized`);
			process.exit(-1);
			break;
	}
}

async function _main()
{
	await db.connect();
	setTimeout(async() => {
		await parseArgs();
		process.exit(0);
	}, 1000);
}

_main();