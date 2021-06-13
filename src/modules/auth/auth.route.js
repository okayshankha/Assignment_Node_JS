const express = require("express")
const router = express.Router()
const AuthController = require("./auth.controller")

/**
 *
 *  All unauthenticated routes will be handled here
 *
 */

router.post("/login", AuthController.login)
router.post("/register", AuthController.register)


/**
 *
 *  All authenticated routes will be handled here
 *
 */


module.exports = router