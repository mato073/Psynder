/**
 * Location router of the Psynder server.
 * @module module:Routes-Location
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const views = require("../controllers/location-controller");

const router = express.Router();

/**
 * @description Route to retrieve the ID linked location
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /locations/:id
 * @path {GET} /locations/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the location you want informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.location - The location object
 */
router.get("/:id", auth.isAuthenticated, views.retrieveLocationById);

/**
 * @description Route to retrieve the ID linked location
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /locations/:id
 * @path {PATCH} /locations/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the location you want to update informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {(Number|String)} lat - (Optional) latitude (if specified, lng must be specified as well)
 * @body {(Number|String)} lng - (Optional) longitude (if specified, lat must be specified as well)
 * @body {String} formattedAddress - (Optional) Plain formatted address as returned by google maps api
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.location - The location object
 */
router.patch("/:id", auth.isAuthenticated, views.updateLocationWithId);

/**
 * @description Route to retrieve the ID linked location
 *
 * __/!\ Needs access token ! /!\\__
 * @name DELETE /locations/:id
 * @path {DELETE} /locations/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the location you want to delete
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 */
router.delete("/:id", auth.isAuthenticated, views.deleteLocationWithId);

module.exports = router;