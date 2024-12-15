const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate("reviews");
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    const reviews = await campground.reviews;
        const ratings = reviews.map(review => review.rating);
        campground.averageRating = ratings.reduce((sum, curr) => sum + curr) / ratings.length
    await review.save();
    await campground.save();
    req.flash("success", "Review successfully created")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    const campground = await Campground.findById(req.params.id)
        .populate("reviews");
    const reviews = await campground.reviews;
    console.log("review length: ", reviews.length)
    if (reviews.length > 0) {
        const ratings = reviews.map(review => review.rating);
        campground.averageRating = ratings.reduce((sum, curr) => sum + curr) / ratings.length
    } else {
        campground.averageRating = false
    }
    await campground.save();
    req.flash("success", "Review successfully deleted")
    res.redirect(`/campgrounds/${id}`)
}