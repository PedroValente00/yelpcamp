const express = require("express");
const router = express.Router();
const passport = require("passport")
const catchAsync = require("../utils/catchAsync")
const { storeReturnTo } = require('../middleware');
const user = require("../controllers/users");

router.get("/logout", user.logout)

router.route("/register")
    .get(user.newUserForm)
    .post(catchAsync(user.createUser))

router.route("/login")
    .get(user.loginForm)
    .post(storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        user.welcomeRedirect
    )

module.exports = router;