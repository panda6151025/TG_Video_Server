const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `video/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 4 * 1024 * 1024 * 1024 },
});

router.post(
  "/addVideo/:title",
  upload.single("video"),
  videoController.addVideo
);
router.get("/videoTitle", videoController.getVideoTitle);
router.get("/delVideo/:id", videoController.deleteVideo);
router.post("/updateTitle/:id", videoController.updateVideo);
module.exports = router;
