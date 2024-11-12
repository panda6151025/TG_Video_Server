const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const videoController = require("../controllers/videoController");

// router.get("/getMyboat/:userid", videoController.getMyboat);
router.post("/addVideo/:title", videoController.addVideo);
router.get("/videoTitle", videoController.getVideoTitle);
router.get("/delVideo/:id", videoController.deleteVideo);
router.post("/updateTitle/:id", videoController.updateVideo);
module.exports = router;
