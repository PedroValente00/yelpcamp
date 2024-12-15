const { campgroundSchema, reviewSchema } = require("./schemas")
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //1 - get req.originalUrl and store it in req.session.returnTo
        //2 - if it's a delete req or a review being submitted without being logged in,
        //then set set the "returnTo" to /campgrounds
        const {id} = req.params
        req.session.returnTo = (req.query._method === 'DELETE' || req.originalUrl === `/campgrounds/${id}/reviews` ? `/campgrounds/${id}` : req.originalUrl)
        req.flash("error", "You must be signed in");
        return res.redirect("/login")
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
        // console.log("gotta remove this from the frontend")
    } next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) return next({message: "Could not find this campground."})
    if (!req.user.equals(campground.author)) {
        req.flash("error", "You don't have permission for that.");
        return res.redirect("/campgrounds")
    } next()

}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID)
    if (!req.user.equals(review.author)) {
        req.flash("error", "You are not allowed to do this.");
        return res.redirect(`/campgrounds/${id}`)
    } next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } next();
}