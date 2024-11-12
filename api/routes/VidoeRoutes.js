const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

router.post("/addVideo", videoController.addVideo);
router.get("/videoTitle", videoController.getVideoTitle);
router.delete("/delVideo/:id", videoController.deleteVideo);

module.exports = router;
