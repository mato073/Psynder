const express = require("express");
const views = require("../controllers/token-controller.js");

const router = express.Router();

/**
 * @description Route to refresh an authenticated session (user or therapist). Both access AND refresh Tokens are refreshed, so it goes for their expiration date as well.
 * @name POST /token/refresh
 * @path {POST} /token/refresh
 * @body {String} refreshToken - Refresh token provided earlier to the user or therapist
 * @code {200} if the request is successful
 * @code {400} if the request failed
 * @response {JSON} json - Response as JSON type
 * @response {String} fail_json.message - Message to know if the opration succeed or failed
 * @response {String} success_json.accessToken - New accessToken
 * @response {String} success_json.refreshToken - New refreshToken
 */
router.post("/refresh", views.refreshJWTPair);


module.exports = router;