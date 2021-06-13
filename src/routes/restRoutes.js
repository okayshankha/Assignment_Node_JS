const express = require("express")
const router = express.Router()

const AuthRouter = require("../modules/auth/auth.route")
const UserRouter = require("../modules/user/user.route")
const StockRouter = require("../modules/stock/stock.route")

router.use("/auth", AuthRouter)
router.use("/user", UserRouter)
router.use("/stocks", StockRouter)

module.exports = router