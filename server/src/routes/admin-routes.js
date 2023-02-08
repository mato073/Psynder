/**
 * Admin router of the Psynder server.
 * @module module:Routes-Admin
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const roles = require("../permissions/roles.js");
const views = require("../controllers/admin-controller.js");

const router = express.Router();

/**
 * @description Route to connect an admin user to its account.
 * @name GET /admin/locked
 * @path {GET} /admin/locked
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 * 
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Access token of the admin user
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {String} success_json.therapists - List of locked therapists
 */
router.get("/therapists/locked", auth.isAuthenticated, roles.isAdmin, views.listLockedTherapists);


/**
 * @description Route to create an admin user account.
 * @name PUT /therapists/:id/unlock
 * @path {PUT} /therapists/:id/unlock
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Access token of the admin user
 * @params {String} :id - ID of the therapist you want to unlock
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.put("/therapists/:id/unlock", auth.isAuthenticated, roles.isAdmin, views.unlock);


/**
 * @description Route to delete the current connected therapist.
 *
 * __/!\ Needs access token ! /!\\__
 * @name DELETE /admin/therapists/:id
 * @path {DELETE} /admin/therapists/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Accesstoken of the admin user
 * @params {String} :id - ID of the therapist you wish to delete
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.delete("/therapists/:id", auth.isAuthenticated, roles.isAdmin, views.deleteTherapistById);


module.exports = router;