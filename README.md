# YelpCamp

This is a project called YelpCamp, based on Colt Steele's [Udemy course](https://www.udemy.com/course/the-web-developer-bootcamp).

Watch the live project demo here: https://yelpcamp-ei7h.onrender.com

It's being continuously integrated/deployed from Github to [Render](https://render.com/). Because it's being hosted on the free tier, the server goes to sleep after 15 minutes of no traffic. The first time you access it during its down time, it will take a minute to spin the disk back up. Please have a bit of patience.

Technologies used and main features:  
Backend server running on [Express](https://expressjs.com/) (Node)  
Frontend with [EJS](https://ejs.co/)  
Database is [MongoDB](https://www.mongodb.com/) using Mongoose (and the free tier of cloud atlas giving only network access to Render's IP addresses for safety).  
Used [bootstrap](https://getbootstrap.com/) most for CSS stuff.  
[Mapbox](https://www.mapbox.com/) for maps and geolocation features (whatever you write as a location, mapbox will try to find it in real life).    

Imagine you want to go camping and need to find a campground, or publish the one you have (much like Airbnb, Booking, etc)...  
You can create an account and/or login - authentication done using [Passport](https://www.passportjs.org/).  
You can create/edit/delete campgrounds and upload pictures which are uploaded and stored using [Multer](https://github.com/expressjs/multer) and [Cloudinary](https://cloudinary.com/). There's validation so you can't just upload anything.  
You can find (and filter) campgrounds, or find them on the map. If you are logged in you can also leave reviews (and delete the ones you left).  
Flash messages and redirection are used when errors happen.  
[Helmet](https://helmetjs.github.io/) for CSP (security-related) and [Joi](https://joi.dev/) for more validation.