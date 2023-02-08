const createError = require("http-errors");
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("../swagger.json");

// const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

let app = express();

const otherRouter = require("./routes/other-routes.js");
const surveyRouter = require("./routes/survey-routes.js");
const tokenRouter = require("./routes/token-routes.js");
const usersRouter = require("./routes/users-routes.js");
const therapistsRouter = require("./routes/therapists-routes.js");
const locationRouter = require("./routes/location-routes.js");
const specialtiesRouter = require("./routes/specialties-routes.js");
const appointmentsRouter = require("./routes/appointments-routes.js");
const availabilitiesRouter = require("./routes/therapist-availabilities-routes.js");
const emailsRouter = require("./routes/email-routes.js");
const adminRouter = require("./routes/admin-routes.js");
const db = require("./db.js");
const redis = require("./redis.js");


const config = require("../config.json");
/* Maintenance global variable definition */
maintenance = {isIn: config.maintenance.isIn, retryAfter: config.maintenance.retryAfter};
/* Mobile app version global variable definition */
mobileAppVersion = config.mobileAppVersion;


/* Discord bot stuffs */
const { Client } = require("discord.js");
bot = new Client({partials: ["MESSAGE", "CHANNEL", "REACTION"], disableMentions: "everyone", intents: [["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"]]});
const startupBot = require("./bot_psynder/startup.js");
const botCommands = require("./bot_psynder/index.js");

if (process.argv[process.argv.length - 1] === "dev") {
	/* Development running mode env variable definition */
	process.env.runsInDev = "true";
	db.connect();
} else {
	/* Development running mode env variable definition */
	process.env.runsInDev = "false";
	startupBot();

	bot.on("messageCreate", async function(message) {
		try {
			botCommands(message);
		} catch (exception) {
			bot.sendLog(`Error exception:\n${exception.stack}`);
			return;
		}
	});
	
	bot.on("ready", async function() {
		console.log(`Logged in as ${bot.user.tag} !`);
		console.log("Servers :");
		bot.guilds.cache.each(guild => {
			console.log(" - " + guild.name);
		});
		console.log("\n");
		
		bot.user.setActivity(`My prefix is ${bot.config.prefix}`, {type: "WATCHING"});
		const logChannel = bot.channels.cache.get(bot.config.idLogChannel);
		if (logChannel)
			logChannel.send({embeds: [{color: 65330, description: "Started successfully", timestamp: new Date()}]});

		setInterval(() => {
			bot.destroy();
			bot.login(bot.config.token).then(() => bot.user.setActivity(`My prefix is ${bot.config.prefix}`, {type: "WATCHING"}));
		}, 86400000); // 86,400,000ms = 24 hours
		setInterval(async () => {
			if (!(await db.isConnected()))
			bot.sendLog("MongoDB Error : Database not connected !");
		}, 60000); // 60,000ms = 1 minute
	});
}
redis.connect();

/* enabling CORS */
app.use(cors());

/* initializing Sentry as early as possible */
// Sentry.init({
// 	dsn: "https://b9388624f4b249bf995a7c60fca1538a@o460714.ingest.sentry.io/5461423",
// 	integrations: [
// 		//enabling HTTP calls tracing */
// 		new Sentry.Integrations.Http({ tracing: true }),
// 		// enable Express.js middleware tracing */
// 		new Tracing.Integrations.Express({ app }),
// 	],
// 
// 	// We recommend adjusting this value in production, or using tracesSampler
// 	// for finer control
// 	tracesSampleRate: 1.0,
// });



// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());


app.use("/admin-api", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// assign the swig engine to .html files
// app.engine("html", "pug");
// set .html as the default extension
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Registering routes */
app.use("", otherRouter);
app.use("/survey", surveyRouter);
app.use("/token", tokenRouter);
app.use("/users", usersRouter);
app.use("/therapists", therapistsRouter);
app.use("/locations", locationRouter);
app.use("/specialties", specialtiesRouter);
app.use("/appointments", appointmentsRouter);
app.use("/availabilities", availabilitiesRouter);
app.use("/emails", emailsRouter);
app.use("/admin/", adminRouter);

/* catching 404 and forwarding to error handler */
app.use(function(req, res, next) {
	next(createError(404));
});

/* Sentry error handler */
// app.use(Sentry.Handlers.errorHandler());

/* fallthrough error handler */
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});


module.exports = app;
