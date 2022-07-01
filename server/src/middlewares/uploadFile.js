const multer = require("multer");

exports.uploadFile = (imageFile) => {
  // Destination Folder and Rename File Image
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //Call Back , left side is Error and right side what we want to do
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // Filter type file
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only Image files are allowed!!",
        };

        return cb(new Error("Only Image files are allowed!!"), false);
      }
    }
    cb(null, true);
  };

  // Make Maximum File Size Upload
  const size = 10;
  const maxSize = size * 1000 * 1000;
  const limits = {
    fileSize: maxSize,
  };

  const upload = multer({
    storage,
    fileFilter,
    limits,
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      // 1st Step : Filter
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      }

      // 2nd Step : File Empty
      // if (!req.file && !err) {
      //   return res.send({
      //     message: "Please select any files to upload!",
      //   });
      // }

      // 3rd Step : Limit
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.send({
            message: "Max file Sized 10MB!",
          });
        }
        return res.send(err);
      }

      return next();
    });
  };
};
