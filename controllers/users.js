const User = require("../models/user");

module.exports.newUserForm = (req, res) => {
    res.render("users/register")
}

module.exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome!");
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register")
    }
}

module.exports.loginForm = (req, res) => {
    if (req.user) {
        req.flash("error", "You are already logged in.");
        return res.redirect("/campgrounds")
    }
    // if previous page was a campground with an ID
    // redirect back to that campground afterwards
    // when reaching the welcomeRedirect function
    const referrer = req.headers.referer;
    if (referrer) {
        const id = referrer.split("/campgrounds/")[1];
        if (id) {
            req.session.returnTo = `/campgrounds/${id}`;
        }
    }
    res.render("users/login")
}

module.exports.welcomeRedirect = (req, res) => {
    const redirectUrl = res.locals.returnTo || "/campgrounds"
    req.flash("success", "Welcome back!")
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) return next(err)
        req.flash("success", "You have logged out.");
        res.redirect("/campgrounds")
    })
}