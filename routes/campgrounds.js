const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campground = require("../controllers/campgrounds");
const {upload} = require("../cloudinary")

router.route("/")
.get(catchAsync(campground.renderIndex))
.post(isLoggedIn, upload.array("images"), validateCampground, catchAsync(campground.createCampgroundForm))

router.get("/new", isLoggedIn, campground.newCampgroundForm)
router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("images"), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, catchAsync(campground.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.editForm))

module.exports = router;