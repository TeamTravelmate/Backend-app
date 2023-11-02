const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: 'Images/upgrade_guide/SLTDA', // Specify the folder where uploaded files will be stored
    filename: function (req, file, cb) {
      // Generate a unique file name to avoid overwriting
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const tg_SLTDAMiddleware = multer({ storage: storage });

  module.exports = { tg_SLTDAMiddleware };