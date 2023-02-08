const express = require("express");
const views = require("../controllers/email-controller.js");

const router = express.Router();

/**
 * @description Route to request a password reset email
 * @name POST /emails/reset-password
 * @path {POST} /emails/reset-password
 * @body {String} email - Email of the user or therapist
 * @body {String} redirectTo - Route you the user redirected to when he clicks on the link provided in the email. Ex: http://psynder.fr/auth/reset-password. The domain the user is redirected to is automatically deciphered by the server when request sent through web client.
 * @body {Boolean} isTherapist - Specifies if the request is supposed to be sent by a therapist or not
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @code {500} if there was an internal server error
 * @code {503} if the database got disconnected
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the opration succeed or failed
 */
router.post("/reset-password", views.sendPasswordResetEmail);


/**
 * @description Route to verify password reset token provided in email received via POST /reset-password
 * @name GET /emails/is-password-reset-token-valid
 * @path {GET} /emails/is-password-reset-token-valid
 * @query {String} token - Password reset token provided in the password reset email
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @code {401} if the request is unauthorized and the token is therefore invalid
 * @code {500} if there was an internal server error
 * @code {503} if the database got disconnected
 * @response {JSON} json - Response as JSON type
 * @response {String} json.message - Message to know if the operation succeeded or failed
 */
 router.get("/is-password-reset-token-valid", views.isResetPwdTokenValid);


module.exports = router;