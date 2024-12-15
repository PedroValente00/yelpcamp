require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const campgroundsRoute = require("./routes/campgrounds")
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users")
const session = require("express-session");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');

const mongoDbUrl = process.env.DATABASE || "mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(mongoDbUrl)
.then(() => console.log("Connected to database"))
.catch(e => console.log("something went wrong:", e))

mongoose.connection.on("open", () => console.log("Database connection open"))

app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs");
app.engine("ejs", ejsMate)

const allowedScripts = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const allowedStyles = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://cdn.jsdelivr.net",
    "https://yelpcamp-three-tau.vercel.app",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

app.use(helmet({
      contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'unsafe-inline'", "'self'", ...allowedScripts],
            styleSrc: ["'self'", "'unsafe-inline'", ...allowedStyles],
            connectSrc: ["'self'", ...connectSrcUrls],
            imgSrc: ["'self'", "blob:", "data:", "https://images.unsplash.com/", "https://res.cloudinary.com/dwnlevtnl/"],
            workerSrc: ["'self'", "blob:"],
            fontSrc: "'self'",
            defaultSrc: [],
            objectSrc: [],
        },
      },
      referrerPolicy: {policy: ["same-origin"]}
    })
  );

app.use(express.urlencoded({ extended: true })) 
app.use(methodOverride("_method"))
app.use(mongoSanitize());

const secret = process.env.SESSION_SECRET || "productionsecret";
const sessionConfig = {
    name:"sesh",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: mongoDbUrl,
        touchAfter: 60 * 60 // 1 hour
    })
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", usersRoute);
app.use("/campgrounds", campgroundsRoute)
app.use("/campgrounds/:id/reviews", reviewsRoute)


app.listen(3000, () => {
    console.log("---server start---");
})

app.get("/", (req,res) => res.render("home"));

app.all("*", (req,res, next) => {
    next(new ExpressError("This page does not exist", 404))
})

app.use((err,req,res,next) => {
    const goBack = req.headers.referer || "/campgrounds";
    if(err.name === "CastError"){ // Mongoose error
        req.flash("error", "Couldn't find this campground.");
        return res.redirect("/campgrounds");
    }
    if(err.message){
    if(err.message === "File too large"){ //Multer error
        req.flash("error", "One or more images are too big. The limit is 10MB per image.");
        return res.redirect(goBack);
    }
    if(err.message === "Too many files"){ // Multer error
        req.flash("error", "You are trying to upload too many files.");
        return res.redirect(goBack);
    }
    if(err.message === "Too many uploads"){ // Custom error thrown when trying to upload more than 10 pictures
        req.flash("error", "You are trying to upload too many pictures.");
        return res.redirect(goBack);
    }
    if(err.message.includes("Image file format")){ // Custom error thrown when picture format not allowed
        req.flash("error", "You can only upload pictures with the following formats: png, jpg, jpeg");
        return res.redirect(goBack);
    }
    if(err.message.includes("must not include HTML")){ // Custom error thrown when picture format not allowed
        req.flash("error", "You cannot use HTML");
        return res.redirect(goBack);
    }
    if(err.message === "\"campground.price\" must be a number"){ // Custom error thrown when trying to upload more than 10 pictures
        req.flash("error", "Price must be a valid number.");
        return res.redirect(goBack);
    }
    if(err.message === "Could not find this campground."){ // Custom error thrown when trying to upload more than 10 pictures
        req.flash("error", "Couldn't find this campground.");
        return res.redirect("/campgrounds");
    }
    // if(err.message === "Cannot read properties of undefined (reading 'geometry')"){ // Custom error thrown when a location cannot be found
    if(err.message.includes("undefined" && "geometry")){ // Custom error thrown when a location cannot be found
        req.flash("error", "Couldn't find a location based on what you wrote.");
        return res.redirect("/campgrounds/new");
    }
    if(err.message === "This page does not exist") return res.redirect("/campgrounds");
    }
    const {statusCode = 500} = err; //defaulting status code to a generic err
    console.log(err)
    req.flash("error", "Something went wrong.");
    res.status(statusCode).redirect("/campgrounds");

})