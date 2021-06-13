const express = require("express")
const router = express.Router()
const { authenticate } = require("../../middlewares/authenticate")
const UserController = require("./user.controller")


/**
 *
 *  All unauthenticated routes will be handled here
 *
 */



/**
 *
 *  All unauthenticated routes will be handled here
 *
 */
router.get("/me", authenticate, UserController.me)

module.exports = router