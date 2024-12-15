const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxClient = require('@mapbox/mapbox-sdk');
const baseClient = mbxClient({ accessToken: process.env.API_MAPBOX });
const mbxGeoservice = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeoservice(baseClient)

module.exports.renderIndex = async (req, res, next) => {
    const query = req.query.q;
    if (query) {
        const campgrounds = await Campground.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        });
        return res.render("campgrounds", { campgrounds })
    } else {
        const campgrounds = await Campground.find({});
        return res.render("campgrounds", { campgrounds })
    }
}

module.exports.newCampgroundForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampgroundForm = async (req, res) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(img => ({ url: img.path, filename: img.filename }))
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    const now = new Date();
    campground.creationDate = now.getTime();
    await campground.save();
    console.log(campground)
    req.flash("success", "Campground created")
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate("author")
        .populate({ path: "reviews", populate: { path: "author" } })
    if (!campground) {
        req.flash("error", "Couldn't find this campground.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground })

}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Couldn't find this campground.")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const update = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, update, { runValidators: true })
    const alreadyUploaded = campground.images.length;
    const tryingToUpload = req.files.length;
    if (alreadyUploaded + tryingToUpload > 10) throw new ExpressError("Too many uploads", 405)
    const uploadedImages = req.files.map(img => ({ url: img.path, filename: img.filename }))
    campground.images.push(...uploadedImages)
    await campground.save()
    if (req.body.deleteImages) {
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        for (const img of req.body.deleteImages) {
            await cloudinary.uploader.destroy(img);
        }
    }
    req.flash("success", "Campground updated successfully")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    for (img of campground.images) {
        await cloudinary.uploader.destroy(img.filename)
    }
    req.flash("success", "Campground deleted successfully")
    res.redirect("/campgrounds")
}