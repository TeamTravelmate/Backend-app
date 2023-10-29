const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'Images/pro_pic', // Specify the folder where uploaded files will be stored
    filename: function (req, file, cb) {
      // Generate a unique file name to avoid overwriting
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const uploadMiddleware = multer({ storage: storage });

  module.exports = { uploadMiddleware };