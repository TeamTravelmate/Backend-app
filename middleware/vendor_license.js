const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'Images/upgrade_vendor/license', // Specify the folder where uploaded files will be stored
    filename: function (req, file, cb) {
      // Generate a unique file name to avoid overwriting
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const vendor_licenseMiddleware = multer({ storage: storage });

  module.exports = { vendor_licenseMiddleware };