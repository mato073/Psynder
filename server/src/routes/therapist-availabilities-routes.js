/**
 * Thrapists router of the Psynder' server.
 * @module module:Routes-Therapist-Availabilities
 */

const express = require("express");
const views = require("../controllers/therapist-availabilities-controller.js");
const auth = require("../permissions/auth");
const roles = require("../permissions/roles");

const router = express.Router();

/**
 * @description Route to get therapist's availabilities.
 * @name GET /availabilities/
 * @path {GET} /availabilities
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @example
 * // Example of returned object
 * {
    "days": [
        {
            "day": "monday",
            "timeSlots": [
                {
                    "from": "8:30",
                    "to": "12:00",
                    "type": "AnyAppointments",
                    "color": "#FFFFFF"
                },
                {
                    "from": "13:30",
                    "to": "17:00",
                    "type": "FirstAppointments",
                    "color": "#000000"
                }
            ]
        }
    ]
}
 * @response {JSON} json - Response as JSON type
 * @response {Object[]} json.days - Availabilities of the therapist
 * @response {String} json.days[i].day - Name of the day (monday, tuesday, wednesday, thursday, friday, saturday or sunday)
 * @response {Object[]} json.days[i].timeSlots - Objects that describe time slots from time A to time B
 * @response {String} json.days[i].timeSlots[j].from - String that describe the starting point of a time slot in format HH:MM (or H:MM)
 * @response {String} json.days[i].timeSlots[j].to - String that describe the ending point of a time slot in format HH:MM (or H:MM)
 * @response {String} json.days[i].timeSlots[j].type - (Optionnal) String that describe the type of time slot set by the therapist, could be "FirstAppointments", "GroupAppointments" or "AnyAppointments"
 * @response {String} json.days[i].timeSlots[j].color - (Optionnal) String that describe the color of time slot in hexa
 */
router.get("/", auth.isAuthenticated, roles.isTherapist, views.getAvailabilities);


/**
 * @description Route to set it's availabilities to a therapist. If a week day is not defined, it will be with empty time slots.
 * @name POST /availabilities/
 * @path {POST} /availabilities/
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @example
 * {
    "days": [
        {
            "day": "monday",
            "timeSlots": [
                {
                    "from": "8:30",
                    "to": "12:00",
                    "type": "AnyAppointments",
                    "color": "#FFFFFF"
                },
                {
                    "from": "13:30",
                    "to": "17:00",
                    "type": "FirstAppointments",
                    "color": "#000000"
                }
            ]
        }
    ]
}
 * @body {Object[]} days - Availabilities of the therapist
 * @body {String} days[i].day - Name of the day (monday, tuesday, wednesday, thursday, friday, saturday or sunday)
 * @body {Object[]} days[i].timeSlots - Objects that describe time slots from time A to time B
 * @body {String} days[i].timeSlots[j].from - String that describe the starting point of a time slot in format HH:MM (or H:MM)
 * @body {String} days[i].timeSlots[j].to - String that describe the ending point of a time slot in format HH:MM (or H:MM)
 * @body {String} days[i].timeSlots[j].type - (Optionnal) String that describe the type of time slot set by the therapist, could be "FirstAppointments", "GroupAppointments" or "AnyAppointments"
 * @body {String} days[i].timeSlots[j].color - (Optionnal) String that describe the color of time slot in hexa
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.post("/", auth.isAuthenticated, roles.isTherapist, views.addAvailabilities);


/**
 * @description Route to update it's availabilities to a therapist. If a day is already defined, new values will replace those already existing. If a day isn't already defined, it wont be with this route.
 * @name PATCH /availabilities/
 * @path {PATCH} /availabilities/
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the user
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @example
 * {
    "days": [
        {
            "day": "monday",
            "timeSlots": [
                {
                    "from": "8:30",
                    "to": "12:00",
                    "type": "AnyAppointments",
                    "color": "#FFFFFF"
                },
                {
                    "from": "13:30",
                    "to": "17:00",
                    "type": "FirstAppointments",
                    "color": "#000000"
                }
            ]
        }
    ]
}
 * @body {Object[]} days - Availabilities of the therapist
 * @body {String} days[i].day - Name of the day (monday, tuesday, wednesday, thursday, friday, saturday or sunday)
 * @body {Object[]} days[i].timeSlots - Objects that describe time slots from time A to time B
 * @body {String} days[i].timeSlots[j].from - String that describe the starting point of a time slot in format HH:MM (or H:MM)
 * @body {String} days[i].timeSlots[j].to - String that describe the ending point of a time slot in format HH:MM (or H:MM)
 * @body {String} days[i].timeSlots[j].type - (Optionnal) String that describe the type of time slot set by the therapist, could be "FirstAppointments", "GroupAppointments" or "AnyAppointments"
 * @body {String} days[i].timeSlots[j].color - (Optionnal) String that describe the color of time slot in hexa
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.patch("/", auth.isAuthenticated, roles.isTherapist, views.updateAvailabilities);

/**
 * @description Route to fetch all free time slots for a given time.
 * 
 * In query, if nothing is defined, free time slots from now and for the 7 following days will be returned.
 * If 'startDate' and 'endDate' are defined, free time slots between these dates will be returned.
 * If only 'startDate' is defined, the 7 following days informations will be returned.
 * Else, if only 'endDate' is defined, free time slots from now to this date will be returned.
 *
 * __/!\ Needs access token from therapist ! /!\\__
 * @name GET /availabilities/current/
 * @path {GET} /availabilities/current/
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @query {String} startDate - (Optional) startDate of the timeframe if specified, if not start date of the timeframe will be 'minus infinity'
 * @query {String} endDate - (Optional) endDate of the timeframe if specified, if not end date of the timeframe will be 'plus infinity'
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json_fail.message - Message to know if the opration succeed or failed
 * @response {Object[]} json_success.availabilities - List of current availabilities of the therapist
 * @response {String} json_success.availabilities[i].date - Date in ISO format
 * @response {Object[]} json_success.availabilities[i].timeSlots - Objects that describe time slots from time A to time B
 * @response {String} json_success.availabilities[i].timeSlots[j].from - String that describe the starting point of a time slot in format HH:MM (or H:MM)
 * @response {String} json_success.availabilities[i].timeSlots[j].to - String that describe the ending point of a time slot in format HH:MM (or H:MM)
 */
router.get("/current", auth.isAuthenticated, roles.isTherapist, views.getCurrentAvailabilities);


/**
 * @description Route to fetch all free time slots for a given time of a specified therapist as a user non-therapist.
 * 
 * In query, if nothing is defined, free time slots from now and for the 7 following days will be returned.
 * If 'startDate' and 'endDate' are defined, free time slots between these dates will be returned.
 * If only 'startDate' is defined, the 7 following days informations will be returned.
 * Else, if only 'endDate' is defined, free time slots from now to this date will be returned.
 *
 * __/!\ Needs access token from user non-therapist ! /!\\__
 * @name GET /availabilities/:id/
 * @path {GET} /availabilities/:id/
 * @auth Need a variable **Authorization** in the header with value *Bearer \<accessToken\>*.
 *
 * If authentication fails it will return a 401 error.
 * @header {String} Authorization - Refresh token of the therapist
 * @params {String} :id - ID of the therapist you want to get availabilities
 * @query {String} startDate - (Optional) startDate of the timeframe if specified, if not start date of the timeframe will be 'minus infinity'
 * @query {String} endDate - (Optional) endDate of the timeframe if specified, if not end date of the timeframe will be 'plus infinity'
 * @code {200} If the request is successful
 * @code {400} If the request failed
 * @code {401} If authentication fails
 * @response {JSON} json - Response as JSON type
 * @response {String} json_fail.message - Message to know if the opration succeed or failed
 * @response {Object[]} json_success.availabilities - List of current availabilities of the therapist
 * @response {String} json_success.availabilities[i].date - Date in ISO format
 * @response {Object[]} json_success.availabilities[i].timeSlots - Objects that describe time slots from time A to time B
 * @response {String} json_success.availabilities[i].timeSlots[j].from - String that describe the starting point of a time slot in format HH:MM (or H:MM)
 * @response {String} json_success.availabilities[i].timeSlots[j].to - String that describe the ending point of a time slot in format HH:MM (or H:MM)
 */
router.get("/:id", auth.isAuthenticated, roles.isUserNonTherapist, views.getTherapistAvailabilities);

module.exports = router;