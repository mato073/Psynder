/**
 * Specialties router of the Psynder' server.
 * @module module:Routes-Specialties
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const roles = require("../permissions/roles.js");
const views = require("../controllers/specialties-controller.js");

const router = express.Router();


/**
 * @description Route to add a specialty to the list of specialties.
 * @name POST /specialties
 * @path {POST} /specialties
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} name - Name of the specialty
 * @body {String} acronym - (Optional) Acronym of the specialty
 * @body {String} description - (Optional) Description of the specialty
 * @response {JSON} json - Response as JSON type
 * @response {String} success_json.specialtyId - The ID of the specialty added
 * @response {String} fail_json.message - Message to know why the opration failed
 */
router.post("/", auth.isAuthenticated, roles.isTherapistOrAdmin, views.addSpecialty);

/**
 * @description Route to get the list of specialties.
 * @name GET /specialties
 * @path {GET} /specialties
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {object[]} success_json.specialties - The list of existing specialties
 * @response {String} success_json.specialties[i]._id - ID of the specialty
 * @response {String} success_json.specialties[i].name - Name of the specialty
 * @response {String} success_json.specialties[i].acronym - Acronym of the specialty
 * @response {String} success_json.specialties[i].description - Description of the specialty
 * @response {String[]} success_json.specialties[i].managedDisorders - Disorders managed by the specialty
 * @response {String} fail_json.message - Message to know why the opration failed
 */
router.get("/", auth.isAuthenticated, views.listSpecialties);

/**
 * @description Route to get informationsa about a specialty.
 * @name GET /specialties/:id
 * @path {GET} /specialties/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @params {String} :id - ID of the specialty you want informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 * @response {object} success_json.specialty - The specialty you asked information about
 * @response {String} success_json.specialty._id - ID of the specialty
 * @response {String} success_json.specialty.name - Name of the specialty
 * @response {String} success_json.specialty.acronym - Acronym of the specialty
 * @response {String} success_json.specialty.description - Description of the specialty
 * @response {String[]} success_json.specialty[i].managedDisorders - Disorders managed by the specialty
 */
router.get("/:id", auth.isAuthenticated, views.retrieveSpecialtyById);


/**
 * @description Route to add a specialty to the list of specialties.
 * @name PATCH /specialties/:id
 * @path {PATCH} /specialties/:id

 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @params {String} :id - ID of the specialty you want to update informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} name - (Optional) Name of the specialty
 * @body {String} acronym - (Optional) Acronym of the specialty
 * @body {String} description - (Optional) Description of the specialty
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 */
router.patch("/:id", auth.isAuthenticated, roles.isAdmin, views.updateSpecialtyWithId);


/**
 * @description Route to add a specialty to the list of specialties.
 * @name DELETE /specialties/:id
 * @path {DELETE} /specialties/:id

 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @params {String} :id - ID of the specialty you want to delete
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the opration failed
 */
router.delete("/:id", auth.isAuthenticated, roles.isAdmin, views.deleteSpecialtyWithId);


module.exports = router;