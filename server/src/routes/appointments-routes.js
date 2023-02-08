/**
 * Appointments router of the Psynder server.
 * @module module:Routes-Appointments
 */

const express = require("express");
const auth = require("../permissions/auth.js");
const views = require("../controllers/appointments-controller.js");

const router = express.Router();

/**
 * @description Route to create an appointment
 *
 * __/!\ Needs access token ! /!\\__
 * @name POST /appointments
 * @path {POST} /appointments
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} date - Date in ISO format (in js send as: new Date() then date.toISOString())
 * @body {String} user - ID of the non-therapist user
 * @body {String} therapist - ID of the therapist
 * @body {String} type - ID of the custom appointment type of therapist
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.appointmentId - ID of the appointment created
 * @response {String} success_json.message - Can return an error message if it fails to add user to the terapist's list of active therapies
 */
router.post("/", auth.isAuthenticated, views.createAppointment);

/**
 * @description Route to retrieve an appointment by ID
 *
 * __/!\ Needs access token ! /!\\__
 * @name GET /appointments/:id
 * @path {GET} /appointments/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the appointment you want informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know why the operation failed
 * @response {String} success_json.appointment - Appointment object linked to ID
 * @response {String} success_json.appointment.date - Date in ISO format (in js send as: new Date() then date.toISOstring())
 * @response {String} success_json.appointment.user - ID of the nont-therapist user
 * @response {String} success_json.appointment.therapist - ID of the therapist
 * @response {Object} success_json.appointment.type - ID of the custom appointment type of the therapist
 * @response {String} success_json.appointment.type[i]._id - ID of the custom appointment type
 * @response {String} success_json.appointment.type[i].name - Name of the appointment type
 * @response {String} success_json.appointment.type[i].description - Description of the appointment type
 * @response {String} success_json.appointment.type[i].duration - Duration of the appointment type in format HH:MM
 * @response {String} success_json.appointment.type[i].color - Color of the appointment type in hexadecimal in format #RRGGBBAA or #RRGGBB
 */
router.get("/:id", auth.isAuthenticated, views.retrieveAppointmentById);

/**
 * @description Route to update an appointment linked to ID
 *
 * __/!\ Needs access token ! /!\\__
 * @name PATCH /appointments/:id
 * @path {PATCH} /appointments/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the appointment you want to update informations
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @body {String} date - (Optionnal) Date in ISO format (in js send as: new Date() then date.toISOString())
 * @body {String} type - (Optionnal) ID of the custom appointment type of he therapist
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.patch("/:id", auth.isAuthenticated, views.updateAppointmentWithId);

/**
 * @description Route to delete an appointment by ID
 *
 * __/!\ Needs access token ! /!\\__
 * @name DELETE /appointments/:id
 * @path {DELETE} /appointments/:id
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token
 * @params {String} :id - ID of the appointment you want to delete
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeed or failed
 */
router.delete("/:id", auth.isAuthenticated, views.deleteAppointmentWithId);

module.exports = router;