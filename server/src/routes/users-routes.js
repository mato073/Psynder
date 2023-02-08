/**
 * Users router of the Psynder' server.
 * @module module:Routes-Users
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const roles = require("../permissions/roles.js");
const views = require("../controllers/users-controller.js");
const socialAuthViews = require("../controllers/social-auth-controller.js");
const locationViews = require("../controllers/location-controller.js");
const appointmentViews = require("../controllers/appointments-controller.js");
const communicationSystemViews = require("../controllers/communication-system-controller.js");

const router = express.Router();

/**
 * @description Route to get results of the matching between the user and therapists.
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /users/matching
 * @path {GET} /users/matching
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message Message to know why the opration failed
 * @response {Object[]} success_json.results - Array of therapists the user matchs with
 * @response {String} success_json.results[i].therapistId - ID of the therapist
 * @response {String} success_json.results[i].matchingPercentage - Percentage of matching with the therapist
 */
router.get("/matching", auth.isAuthenticated, roles.isUserNonTherapist, views.getMatchingResults);


/**
 * @description Route to create a user account.
 * @name POST /users/signup
 * @path {POST} /users/signup
 * @body {String} email - Email of the user
 * @body {String} password - Password of the user
 * @body {String} firstName - First name of the user
 * @body {String} lastName - Last name of the user
 * @body {String} phoneNumber - Phone number of the user
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.post("/signup", views.signup);

/**
 * @description Route to connect a user to its account.
 * @name POST /users/login
 * @path {POST} /users/login
 * @body {String} email - Email of the user
 * @body {String} password - Password of the user
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.accessToken - Access token of the user
 * @response {String} success_json.refreshToken - Refresh token of the user
 * @response {String} success_json.uid - ID of the user
 */
router.post("/login", views.login);

/**
 * @description Route to create a user account (via a social media provider).
 * @name POST /users/social/signup
 * @path {POST} /users/social/signup
 * @body {String} uid - Id of the user for any social media platform (google, fb, twitter)
 * @body {String} provider - Social media providing the oauth. Must be one of those 3 values: "GOOGLE", "FACEBOOK" or "TWITTER"
 * @body {String} email - email of the user for the social media platform
 * @body {String} firstName - First name of the user on the social media platform
 * @body {String} lastName - Last name of the user on the social media platform
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.post("/social/signup", socialAuthViews.signupUser);

/**
 * @description Route to connect a user to its account (linked to a social media provider).
 * @name POST /users/social/login
 * @path {POST} /users/social/login
 * @body {String} uid - Id of the user for any social media platform (google, fb, twitter)
 * @body {String} provider - Social media providing the oauth. Must be one of those 3 values: "GOOGLE", "FACEBOOK" or "TWITTER"
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.accessToken - Access token of the user
 * @response {String} success_json.refreshToken - Refresh token of the user
 * @response {String} success_json.uid - ID of the user
 */
router.post("/social/login", (req, res) => { socialAuthViews.login(req, res, "Users", "user"); });


/**
 * @description Route to get the current connected user's informations.
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /users/current
 * @path {GET} /users/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {Object} json.user - The user's informations
 * @response {String} fail_json.message Message to know why the opration failed
 * @response {String} success_json.user._id - The user's ID
 * @response {String} success_json.user.email - The user's email
 * @response {String} success_json.user.firstName - The user's first name
 * @response {String} success_json.user.lastName - The user's last name
 * @response {String} success_json.user.phoneNumber - The user's phone number
 * @response {String} success_json.user.position - The user's position
 * @response {String} success_json.user.potentialDisorders - The user's potential disorders (array of objects containing 'name', 'getDisorder', 'score' and 'maxScore' fields)
 * @response {ObjectID[]} success_json.user.activeTherapies - Array of IDs of therapists in active therapy with the user
 */
router.get("/current", auth.isAuthenticated, roles.isUserNonTherapist, views.retrieveCurrentUser);

/**
 * @description Route to delete the current connected user.
 *
 * __/!\ Needs access token ! /!\\__
 * @name DELETE /users/current
 * @path {DELETE} /users/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json Response as JSON type
 * @response {String} json.message Message to know if the opration succeed or failed
 */
router.delete("/current", auth.isAuthenticated, roles.isUserNonTherapist, views.deleteCurrentUser);

/**
 * @description Route to update the current connected user's informations.
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /users/current
 * @path {PATCH} /users/current
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} email - (Optional) Email of the user
 * @body {String} password - (Optional) Password of the user
 * @body {String} phoneNumber - (Optional) Email of the user
 * @body {String} position - (Optional) Position of the user
 * @response {JSON} json Response as JSON type
 * @response {String} json.message Message to know if the opration succeed or failed
 */
router.patch("/current", auth.isAuthenticated, roles.isUserNonTherapist, views.updateCurrentUser);


// TODO: error management if user is registered with google?
/**
 * @description Route to update the current connected user's informations.
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /users/reset-password
 * @path {PATCH} /users/reset-password
 * @auth Need a variable **Authorization** in the header with value *Bearer \<email reset token provided in email\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @body {String} password - New password of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @response {JSON} json Response as JSON type
 * @response {String} json.message Message to know if the opration succeed or failed
 */
router.patch("/reset-password", views.resetUserPassword);


/**
 * @description Route to assign a location to current user
 *
 * __/!\ Needs access token ! /!\\__
 * @name POST /users/current/location
 * @path {POST} /users/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @body {(Number|String)} lat - Latitude of the user
 * @body {(Number|String)} lng - Longitude of the user
 * @body {String} formattedAddress - Plain formatted address as returned by Google Maps API
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.locationId - ID of the location object newly created
 */
router.post("/current/location", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => { locationViews.assignLocation(req, res, "Users"); });

/**
 * @description Route to retrieve the current user's location
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /users/current/location
 * @path {GET} /users/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful and the location of the user is found in the database
 * @code {204} If the request is successful but the location of the user is not found in the database
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.location - The user's bound location object if it exists
 */
router.get("/current/location", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => { locationViews.retrieveOwnerLinkedLocation(req, res, "Users"); });

/**
 * @description Route to update the current user's location.
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /users/current/location
 * @path {PATCH} /users/current/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {Number} lat - (Optional) latitude of the user (if specified, lng must be specified as well)
 * @body {Number} lng - (Optional) longitude of the user (if specified, lat must be specified as well)
 * @body {String} formattedAddress - (Optional) Plain formatted address as returned by google maps api
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.locationId - The user's bound location object ID
 */
router.patch("/current/location", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => {
	locationViews.updateOwnerLinkedLocation(req, res, "Users");
});


/**
 * @description Route to retrieve all appointments registered for user within the timeframe specified
 *
 * __/!\ Needs access token from user ! /!\\__
 * @name GET users/current/appointments
 * @path {GET} users/current/appointments
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @query {String} startDate - (Optional) startDate of the timeframe if specified, if not start date of the timeframe will be 'minus infinity'
 * @query {String} endDate - (Optional) endDate of the timeframe if specified, if not end date of the timeframe will be 'plus infinity'
 * @query {String} sort - (Optional) sort method. Can either be 'ascending' or 'descending
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.appointments - Array containing all the appointments for the therapist within the timeframe
 */
router.get("/current/appointments", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => { appointmentViews.listOwnerAppointmentsWithinTimeframe(req, res, "Users"); });


/**
 * @description Route to send a message to a therapist as a non-therapist user
 * @name POST /users/current/message
 * @path {POST} /users/current/message
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the requist failed
 * @code {401} If the authentification fails
 * @body {String} receiver - Id of the receiver (should be ID of a non-therapist user)
 * @body {String} content - Content of the message
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.post("/current/message", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => { communicationSystemViews.sendMessage(req, res, false); });

/**
 * @description Route to get messages between a therapist and the non-therapist user
 * @name GET /users/current/messages?nlasts=0
 * @path {GET} /users/current/messages?nlasts=0
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 * @header {String} Authorization - Refresh token of the user
 * @params {String} :receiverId - ID of the therapist you want to fetch messages with
 * @query {(String | Int)} [nLasts=0] (Optional) If specified and number is superior to 0, will return the N last messages, else all messages will be returned
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If the authentification fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json_fail.message - Message to know if the operation succeed or failed
 * @response {String} json_success.messages - Array of messages
 * @response {String} json_success.messages[i]._id - ID of the message instance
 * @response {String} json_success.messages[i].sender - String to know who sent the message, should be 'therapist' or 'user'
 * @response {String} json_success.messages[i].date - Date of the message
 * @response {String} json_success.messages[i].content - Content of the message
 */
router.get("/current/messages/:receiverId", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => { communicationSystemViews.getMessages(req, res, false); });


/**
 * @description Route to get results of the matching between the user and therapists.
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /users/matching
 * @path {GET} /users/matching
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message Message to know why the opration failed
 * @response {Object[]} success_json.results - Array of therapists the user matchs with
 * @response {String} success_json.results[i].therapistId - ID of the therapist
 * @response {String} success_json.results[i].matchingPercentage - Percentage of matching with the therapist
 */
router.get("/matching", auth.isAuthenticated, roles.isUserNonTherapist, views.getMatchingResults);


/**
 * @description Route to get the user with this ID.
 *
 * __/!\ Doesnot Needs access token ! /!\\__
 * @name GET /users/:id
 * @path {GET} /users/:id
 * @auth If authentication fails it will return a 401 error.
 * @params {String} :id - ID of the user you want informations
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message Message to know why the opration failed
 * @response {Object} success_json.user - The user's informations
 * @response {String} success_json.user._id - The user's ID
 * @response {String} success_json.user.email - The user's email
 * @response {String} success_json.user.firstName - The user's first name
 * @response {String} success_json.user.lastName - The user's last name
 * @response {String} success_json.user.phoneNumber - The user's phone number
 * @response {String} success_json.user.position - The user's position
 * @response {String} success_json.user.potentialDisorders - The user's potential disorders (array of objects containing 'name', 'getDisorder', 'score' and 'maxScore' fields)
 * @response {ObjectID[]} success_json.user.activeTherapies - Array of IDs of therapists in active therapy with the user
 */
router.get("/:id", auth.isAuthenticated, views.retrieveUserById);


/**
 * @description Route to update the ID linked user's location.
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /users/:id/location
 * @path {PATCH} /users/:id/location
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @params {String} :id - ID of the location you want to update informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {(Number|String)} lat - (Optional) latitude of the user (if specified, lng must be specified as well)
 * @body {(Number|String)} lng - (Optional) longitude of the user (if specified, lat must be specified as well)
 * @body {String} formattedAddress - (Optional) Plain formatted address as returned by google maps api
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.locationId - The user's bound location object ID
 */
router.patch("/:id/location", auth.isAuthenticated, roles.isUserNonTherapist, (req, res) => {
	req.uid = req.params.id;
	locationViews.updateOwnerLinkedLocation(req, res, "Users");
});


module.exports = router;