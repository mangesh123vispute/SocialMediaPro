import multer from "multer";

const storage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./public/temp");
    console.log(file.size);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file);
  },
});

export const upload = multer({ storage: storage });
