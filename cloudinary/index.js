const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config()

cloudinary.config({ 
    cloud_name: process.env.API_CLOUDNAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });
 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YelpCamp",
    //format: async (req, file) => {'png', 'jpg', 'jpeg'}, // not sure what this does because I can still upload all kinds of formats
    allowed_formats: ['png', 'jpg', 'jpeg']

    // format: async (req, file) => {'png'}, // not sure what this does because I can still upload all kinds of formats
    // public_id: (req, file) => 'uploadedPictures', //this is the public_id given to the uploaded file in cloudinary
  },
});
// module.exports = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: {fileSize: 10000000, files: 10 }//10 MB per file, up to 5 files per upload
});

module.exports = {upload, cloudinary}