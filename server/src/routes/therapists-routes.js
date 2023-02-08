/**
 * Thrapists router of the Psynder' server.
 * @module module:Routes-Therapists
 */

const express = require("express");
const views = require("../controllers/therapists-controller.js");
const socialAuthViews = require("../controllers/social-auth-controller.js");
const locationViews = require("../controllers/location-controller.js");
const appointmentViews = require("../controllers/appointments-controller.js");
const appointmentTypesViews = require("../controllers/appointment-types-controller.js");
const communicationSystemViews = require("../controllers/communication-system-controller.js");
const auth = require("../permissions/auth.js");
const roles = require("../permissions/roles.js");

const router = express.Router();

/**
 * @description Route to create a therapist account.
 * @name POST /therapists/signup
 * @path {POST} /therapists/signup
 * @body {String} email - Email of the therapist
 * @body {String} password - Password of the therapist
 * @body {String} firstName - First name of the therapist
 * @body {String} lastName - Last name of the therapist
 * @body {String} phoneNumber - Phone number of the therapist
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/signup", views.signup);

/**
 * @description Route to connect a therapist to its account.
 * @name POST /therapist/login
 * @path {POST} /therapists/login
 * @body {String} email - Email of the therapist
 * @body {String} password - Password of the therapist
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.accessToken - Access token of the user
 * @response {String} success_json.refreshToken - Refresh token of the therapist
 * @response {String} success_json.uid - ID of the therapist
 */
router.post("/login", views.login);

/**
 * @description Route to create a therapist account (via a social media provider).
 * @name POST /therapists/social/signup
 * @path {POST} /therapists/social/signup
 * @body {String} uid - Id of the therapist for any social media platform (google, fb, twitter)
 * @body {String} provider - Social media providing the oauth. Must be one of those 3 values: "GOOGLE", "FACEBOOK" or "TWITTER"
 * @body {String} email - email of the therapist for the social media platform
 * @body {String} firstName - First name of the therapist on the social media platform
 * @body {String} lastName - Last name of the therapist on the social media platform
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/social/signup", socialAuthViews.signupTherapist);

/**
 * @description Route to connect a therapist to its account (linked to a social media provider).
 * @name POST /therapists/social/login
 * @path {POST} /therapists/social/login
 * @body {String} uid - Id of the therapist for any social media platform (google, fb, twitter)
 * @body {String} provider - Social media providing the oauth. Must be one of those 3 values: "GOOGLE", "FACEBOOK" or "TWITTER"
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.accessToken - Access token of the therapist
 * @response {String} success_json.refreshToken - Refresh token of the therapist
 * @response {String} success_json.uid - ID of the therapist
 */
router.post("/social/login", (req, res) => {
	socialAuthViews.login(req, res, "Therapists", "therapist");
});


/**
 * @description Route to get the current connected therapist's informations.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name GET /therapists/current
 * @path {GET} /therapists/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {Object} success_json.therapist - The therapist's informations
 * @response {String} success_json.therapist._id - The therapist's ID
 * @response {String} success_json.therapist.email - The therapist's email
 * @response {String} success_json.therapist.firstName - The therapist's first name
 * @response {String} success_json.therapist.lastName - The therapist's last name
 * @response {String} success_json.therapist.phoneNumber - The usetherapistr's phone number
 * @response {String} success_json.therapist.position - The therapist's position
 * @response {Object[]} success_json.therapist.specialties - Array of objects reprensenting the therapist's specialties
 * @response {String} success_json.therapist.specialties[i]._id - ID of the specialty
 * @response {String} success_json.therapist.specialties[i].name - Name of the specialty
 * @response {String} success_json.therapist.specialties[i].acronym - Acronym of the specialty
 * @response {String} success_json.therapist.specialties[i].description - Description of the specialty
 * @response {String[]} success_json.therapist.specialties[i].managedDisorders - Disorders managed by the specialty
 * @response {String} success_json.therapist.description - The therapist's description
 * @response {String} success_json.therapist.tags - The therapist's tags
 * @response {ObjectID[]} success_json.therapist.activeTherapies - Array of IDs of user in active therapy with the therapist
 * @response [Object[]} success_json.therapist.typesOfAppointment - Array of objects representing the custom appointment types of the therapist
 * @response {String} success_json.therapist.typesOfAppointment[i]._id - ID of the custom appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].name - Name of the appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].description - Description of the appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].duration - Duration of the appointment type in format HH:MM
 * @response {String} success_json.therapist.typesOfAppointment[i].color - Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBB
 */
router.get("/current", auth.isAuthenticated, roles.isTherapist, views.retrieveCurrentTherapist);

/**
 * @description Route to delete the current connected therapist.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name DELETE /therapists/current
 * @path {DELETE} /therapists/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.delete("/current", auth.isAuthenticated, roles.isTherapist, views.deleteCurrentTherapist);

/**
 * @description Route to update the current connected therapist's informations.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name PATCH /therapists/current
 * @path {PATCH} /therapists/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} email - (Optional) Email of the therapist
 * @body {String} password - (Optional) Password of the therapist
 * @body {String} phoneNumber - (Optional) Email of the therapist
 * @body {String} position - (Optional) Position of the therapist
 * @body {String} description - (Optional) Description of the therapist
 * @body {String[]} tags - (Optional) Tags of the therapist (array of strings)
 * @body {ObjectID[]} activeTherapies - (Optional) Array of IDs of user in active therapy with the therapist, use to remove IDs from the array /!\ Only defined IDs in this array will stay /!\
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.patch("/current", auth.isAuthenticated, roles.isTherapist, views.updateCurrentTherapist);


/**
 * @description Route to assign a location to current therapist
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name POST /therapists/current/location
 * @path {POST} /therapists/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @body {Number} lat - Latitude of the therapist
 * @body {Number} lng - Longitude of the therapist
 * @body {String} formattedAddress - Plain formatted address as returned by Google Maps API
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.locationId - ID of the location object newly created
 */
router.post("/current/location", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	locationViews.assignLocation(req, res, "Therapists");
});

/**
 * @description Route to retrieve the current therapist's location
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name GET /therapists/current/location
 * @path {GET} /therapists/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @code {200} If the request is successful and the location of the therapist is found in the database
 * @code {204} If the request is successful but the location of the therapist is not found in the database
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.location - The therapist's bound location object if it exists
 */
router.get("/current/location", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	locationViews.retrieveOwnerLinkedLocation(req, res, "Therapists");
});

/**
 * @description Route to update the current therapist's location.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name PATCH /therapists/current/location
 * @path {PATCH} /therapists/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {Number} lat - (Optional) latitude of the therapist (if specified, lng must be specified as well)
 * @body {Number} lng - (Optional) longitude of the therapist (if specified, lat must be specified as well)
 * @body {String} formattedAddress - (Optional) Plain formatted address as returned by google maps api
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.locationId - The therapist's bound location object ID
 */
router.patch("/current/location", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	locationViews.updateOwnerLinkedLocation(req, res, "Therapists");
});

/**
 * @description Route to retrieve all appointments registered for therapist within the timeframe specified
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name GET /current/appointments
 * @path {GET} /current/appointments
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @query {Number} startDate - (Optional) startDate of the timeframe if specified, if not start date of the timeframe will be 'minus infinity'
 * @query {Number} endDate - (Optional) endDate of the timeframe if specified, if not end date of the timeframe will be 'plus infinity'
 * @query {String} sort - (Optional) sort method. Can either be 'ascending' or 'descending'
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.appointments - Array containing all the appointments for the therapist within the timeframe
 */
router.get("/current/appointments", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	appointmentViews.listOwnerAppointmentsWithinTimeframe(req, res, "Therapists");
});


/**
 * @description Route to assign a specialty to current therapist
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name POST /therapists/current/specialties
 * @path {POST} /therapists/current/specialties
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @body {String} specialty - ID of the specialty object
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/current/specialties", auth.isAuthenticated, roles.isTherapist, views.addSpecialty);

/**
 * @description Route to remove a specialty from current therapist
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name DELETE /therapists/current/specialties
 * @path {DELETE} /therapists/current/specialties
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @body {String} specialty - ID of the specialty object
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.delete("/current/specialties", auth.isAuthenticated, roles.isTherapist, views.deleteSpecialty);


/**
 * @description Route to assign a disorder already treated to current therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name POST /therapists/current/disorderAlreadyTreated
 * @path {POST} /therapists/current/disorderAlreadyTreated
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @body {String} body.alreadyTreated.name - Name of the disorder already treated by the therapist
 * @body {String} body.alreadyTreated.cured - To tell if the therapist has already cured someone with this disorder
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
 router.post("/current/disorderAlreadyTreated", auth.isAuthenticated, roles.isTherapist, views.addDisorderAlreadyTreated);

/**
 * @description Route to remove a disorder already treated from current therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name DELETE /therapists/current/disorderAlreadyTreated
 * @path {DELETE} /therapists/current/disorderAlreadyTreated
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @body {String} body.alreadyTreated.name - Name of the disorder already treated by the therapist
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.delete("/current/disorderAlreadyTreated", auth.isAuthenticated, roles.isTherapist, views.deleteDisorderAlreadyTreated);


/**
 * @description Route to retrieve the clients of the last 3 appointments
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name GET /therapists/current/clients
 * @path {GET} /therapists/current/clients
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @query {Number} search - (Optional) search string (can be used as autocomplete), to be queried in db for the firstName or lastName
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.clients - Array containing the clients of the past 3 appointments
 */
router.get("/current/clients", auth.isAuthenticated, roles.isTherapist, views.listPastClients);


/**
 * @description Route to add a custom type of appointment the a therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name POST /therapists/current/appointmentType
 * @path {POST} /therapists/current/appointmentType
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} name - Name of the appointment type
 * @body {String} description - (Optional) Description of the appointment type
 * @body {String} duration - Duration of the appointment type in format HH:MM
 * @body {String} color - (Optional, default value #FFFFFFFF) Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBBB
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/current/appointmentType", auth.isAuthenticated, roles.isTherapist, appointmentTypesViews.createAppointmentType);


/**
 * @description Route to get a custom type of appointment for the therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name GET /therapists/current/appointmentTypes
 * @path {GET} /therapists/current/appointmentTypes
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json - Array of appointment types

 */
router.get("/current/appointmentTypes", auth.isAuthenticated, roles.isTherapist, appointmentTypesViews.listAppointmentTypesByUid);


/**
 * @description Route to get a custom type of appointment for the therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name GET /therapists/current/appointmentType/:id
 * @path {GET} /therapists/current/appointmentType/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @params {String} :id - ID of the custom appointement type you want informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json._id - ID of the appointment type
 * @response {String} success_json.ownerId - ID of the owner (therapist) of the appointment type
 * @response {String} success_json.name - Name of the appointment type
 * @response {String} success_json.description - Description of the appointment type
 * @response {String} success_json.duration - Duration of the appointment type in format HH:MM
 * @response {String} success_json.color - Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBB
 */
router.get("/current/appointmentType/:id", auth.isAuthenticated, roles.isTherapist, appointmentTypesViews.fetchAppointmentTypeById);

/**
 * @description Route to modify fields value of a custom type of appointment for the therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name PATCH /therapists/current/appointmentType/:id
 * @path {PATCH} /therapists/current/appointmentType/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @params {String} :id - ID of the custom appointement type you want to edit
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} name - (Optionnal) Name of the appointment type
 * @body {String} description - (Optionnal) Description of the appointment type
 * @body {String} duration - (Optionnal) Duration of the appointment type in format HH:MM
 * @body {String} color - (Optionnal) Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBB
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.patch("/current/appointmentType/:id", auth.isAuthenticated, roles.isTherapist, appointmentTypesViews.updateAppointmentTypeById);

/**
 * @description Route to delete a custom type of appointment for the therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name DELETE /therapists/current/appointmentType/:id
 * @path {DELETE} /therapists/current/appointmentType/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @params {String} :id - ID of the custom appointement type you want to edit
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.delete("/current/appointmentType/:id", auth.isAuthenticated, roles.isTherapist, appointmentTypesViews.deleteAppointmentTypeWithId);


/**
 * @description Route to send a message to a non-therapist user as a therapist
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name POST /therapists/current/sendMessage
 * @path {POST} /therapists/current/sendMessage
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} receiver - Id of the receiver (should be ID of a non-therapist user)
 * @body {String} content - Content of the message
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/current/message", auth.isAuthenticated, roles.isTherapist, (req, res) => { communicationSystemViews.sendMessage(req, res, true); });

/**
 * @description Route to get messages between a non-therapist user and the therapist
 * @name GET /therapists/current/messages?nlasts=0
 * @path {GET} /therapists/current/messages?nlasts=0
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @params {String} :receiverId - ID of the therapist you want to fetch messages with
 * @query {(String | Int)} [nLasts=0] (Optional) If specified and number is superior to 0, will return the N last messages, else all messages will be returned
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json_fail.message - Message to know if the operation succeed or failed
 * @response {String} json_success.messages - Array of messages
 * @response {String} json_success.messages[i]._id - ID of the message instance
 * @response {String} json_success.messages[i].sender - String to know who sent the message, should be 'therapist' or 'user'
 * @response {String} json_success.messages[i].date - Date of the message
 * @response {String} json_success.messages[i].content - Content of the message
 */
router.get("/current/messages/:receiverId", auth.isAuthenticated, roles.isTherapist, (req, res) => { communicationSystemViews.getMessages(req, res, true); });


// TODO: error management if user is registered with google?
/**
 * @description Route to update the current connected user's informations.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name PATCH /therapists/reset-password
 * @path {PATCH} /therapists/reset-password
 * @auth Need a variable **Authorization** in the header with value *Bearer \<email reset token provided in email\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Unique token provided in password reset email
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @body {String} password - New password of the user
 * @response {JSON} json Response as JSON type
 * @response {String} json.message Message to know if the operation succeed or failed
 */
router.patch("/reset-password", views.resetTherapistPassword);


/**
 * @description Route to retrieve all therapists close to user within radius
 *
 * __/!\ Needs access token of the therapist ! /!\\__
 * @name GET /therapists/close-to-me
 * @path {GET} /therapists/close-to-me
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the non therapist user
 * @query {Number} lat - (Optional) latitude of the user non therapist (if specified, lng must be specified as well. If not, the request will use the lat registered in the db for this user.)
 * @query {Number} lng - (Optional) longitude of the user non therapist (if specified, lng must be specified as well. If not, the request will use the lat registered in the db for this user.)
 * @query {Number} radius - (Optional) radius that the user wants to query in km. Defaults to 60 km if not specified.
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.therapists - Array containing the therapists within the zone of center (lat, lng) and radius specified in query
 */
router.get("/close-to-me", auth.isAuthenticated, roles.isUserNonTherapist, views.listTherapistsCloseToUser);


/**
 * @description Route to get the therapist with this ID.
 * @name GET /therapists/:id
 * @path {GET} /therapists/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @params {String} :id - ID of the therapist you want informations
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {Object} success_json.therapist - The therapist's informations
 * @response {String} success_json.therapist._id - The therapist's ID
 * @response {String} success_json.therapist.email - The therapist's email
 * @response {String} success_json.therapist.firstName - The therapist's first name
 * @response {String} success_json.therapist.lastName - The therapist's last name
 * @response {String} success_json.therapist.phoneNumber - The usetherapistr's phone number
 * @response {String} success_json.therapist.position - The therapist's position
 * @response {Object[]} success_json.therapist.specialties - Array of objects reprensenting the therapist's specialties
 * @response {String} success_json.therapist.specialties[i]._id - ID of the specialty
 * @response {String} success_json.therapist.specialties[i].name - Name of the specialty
 * @response {String} success_json.therapist.specialties[i].acronym - Acronym of the specialty
 * @response {String} success_json.therapist.specialties[i].description - Description of the specialty
 * @response {String[]} success_json.therapist.specialties[i].managedDisorders - Disorders managed by the specialty
 * @response {String} success_json.therapist.description - The therapist's description
 * @response {String} success_json.therapist.tags - The therapist's tags
 * @response {ObjectID[]} success_json.therapist.activeTherapies - Array of IDs of user in active therapy with the therapist
 * @response {Object[]} success_json.therapist.typesOfAppointment - Array of objects representing the custom appointment types of the therapist
 * @response {String} success_json.therapist.typesOfAppointment[i]._id - ID of the custom appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].name - Name of the appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].description - Description of the appointment type
 * @response {String} success_json.therapist.typesOfAppointment[i].duration - Duration of the appointment type in format HH:MM
 * @response {String} success_json.therapist.typesOfAppointment[i].color - Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBB
 */
router.get("/:id", auth.isAuthenticated, views.retrieveTherapistById);


/**
 * @description Route to assign a location to therapist with specified ID
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name POST /therapists/:id/location
 * @path {POST} /therapists/:id/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @params {String} :id - ID of the location you want to tell the therapist is the owner
 * @body {(Number|String)} lat - latitude of the therapist
 * @body {(Number|String)} lng - longitude of the therapist
 * @body {String} formattedAddress - Plain formatted address as returned by google maps api
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} json.locationId - ID of the location object newly created
 */
router.post("/:id/location", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	req.uid = req.params.id;
	locationViews.assignLocation(req, res, "Therapists");
});

/**
 * @description Route to retrieve the ID linked therapist's location
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name GET /therapists/:id/location
 * @path {GET} /therapists/:id/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @params {String} :id - ID of the location you want informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.location - The therapist's bound location object
 */
router.get("/:id/location", auth.isAuthenticated, (req, res) => {
	req.uid = req.params.id;
	locationViews.retrieveOwnerLinkedLocation(req, res, "Therapists");
});

/**
 * @description Route to update the ID linked therapist's location.
 *
 * __/!\ Need the access token of the therapist ! /!\\__
 * @name PATCH /therapists/:id/location
 * @path {PATCH} /therapists/:id/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @params {String} :id - ID of the location you want to update informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {(Number|String)} lat - (Optional) latitude of the therapist (if specified, lng must be specified as well)
 * @body {(Number|String)} lng - (Optional) longitude of the therapist (if specified, lat must be specified as well)
 * @body {String} formattedAddress - (Optional) Plain formatted address as returned by google maps api
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.locationId - The therapist's bound location object ID
 */
router.patch("/:id/location", auth.isAuthenticated, roles.isTherapist, (req, res) => {
	req.uid = req.params.id;
	locationViews.updateOwnerLinkedLocation(req, res, "Therapists");
});


module.exports = router;