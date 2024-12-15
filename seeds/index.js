require('dotenv').config()
const mongoDbUrl = process.env.DATABASE || "mongodb://127.0.0.1:27017/yelp-camp"

const mongoose = require("mongoose");
mongoose.connect(mongoDbUrl)
const Campground = require("../models/campground")
const Review = require("../models/review")
const { cloudinary } = require("../cloudinary");

const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers")

const rnd = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const seedDB = async (num) => {
  const campgrounds = await Campground.find({});
  // await Review.deleteMany({})
  // delete all uploaded images from the campgrounds
  for (const eachCampground of campgrounds) {
    for (const eachImg of eachCampground.images) {
      if (eachImg.filename !== "YelpCamp/placeholder_1" || "YelpCamp/placeholder_2") {
        cloudinary.uploader.destroy(eachImg.filename);
      }
    }
  }

  // now delete the campgrounds themselves
  console.log("Deleting campgrounds...")
  const deleted = await Campground.deleteMany({})
  console.log(`Deleted ${deleted.deletedCount} campgrounds.`)

  // now let's seed the database with some dummy campgrounds
  console.log("Creating campgrounds...")
  for (let i = 0; i < num; i++) {
    const location = rnd(cities);
    const now = new Date();
    const entry = new Campground({
      author: "675f04e414b6faf91e48e879",
      title: `${rnd(descriptors)} ${rnd(places)}`,
      location: `${location.city}, ${location.state}`,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur sapiente magnam nostrum, veniam aliquid, fuga sunt rerum, esse inventore ullam amet ipsum necessitatibus ad minus harum architecto delectus molestias distinctio!",
      price: Math.floor(Math.random() * 20 + 10),
      reviews:
        [
          await new Review({
            body: "random review", author: "675ef4fc59bd734b33b4926d",
            rating: Math.floor(Math.random() * 5) + 1
          }).save(),
          await new Review({
            body: "another random review", author: "675c861f596285a82527ef71",
            rating: Math.floor(Math.random() * 5) + 1
          }).save()
        ],
      geometry: {
        type: "Point",
        coordinates: [
          location.longitude,
          location.latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dwnlevtnl/image/upload/v1727777603/YelpCamp/template1.jpg',
          filename: 'YelpCamp/placeholder_1',
        },
        {
          url: 'https://res.cloudinary.com/dwnlevtnl/image/upload/v1727777603/YelpCamp/template2.jpg',
          filename: 'YelpCamp/placeholder_2',
        }
      ],
      creationDate: now.getTime(),
    })
    const ratings = await entry.reviews.map(review => review.rating);
    const average = ratings.reduce((sum, curr) => sum + curr) / ratings.length
    entry.averageRating = average;
    await entry.save()
  }
  const data = await Campground.find();
  console.log(`Created ${data.length} campgrounds.`);
}

seedDB(2).then(() => mongoose.connection.close())