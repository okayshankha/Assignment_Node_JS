const express = require("express")
const router = express.Router()
const { authenticate } = require("../../middlewares/authenticate")
const StockController = require("./stock.controller")


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


router.get("/scan", authenticate, StockController.scan)
router.get("/scan/history", authenticate, StockController.scanHistory)

module.exports = router