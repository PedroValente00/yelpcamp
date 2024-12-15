const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")
const imageSchema = new Schema({
        url: String,
        filename: String
})
const { cloudinary } = require("../cloudinary");


imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("upload/", "upload/c_auto,h_250,w_250/")
})
imageSchema.virtual("display").get(function(){
    return this.url.replace("upload/", "upload/f_auto,fl_lossy,q_auto,h_400,c_scale/e_sharpen/")
})

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [imageSchema],
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    averageRating: {
        type:Number
    },
    geometry: {
        type:{
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    creationDate: {
        type: Number,
        required: true
    }
})

CampgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
        console.log("all reviews under this campground were deleted")
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);