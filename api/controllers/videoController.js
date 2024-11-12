const Video = require("../models/video");

exports.addVideo = async (req, res) => {
  try {
    const { title } = req.params;
    const videoUrl = req.file.location;

    const newVideo = new Video({
      title: title,
      source: videoUrl,
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading video",
      error: error.message,
    });
  }
};

exports.getVideoTitle = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.json({ flag: true, data: videos });
  } catch (error) {
    return res.status(500).json({
      errors: { general: "There was an error uploading the videos" },
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.deleteOne({ _id: req.params.id });
    return res.json({ flag: ture, data: {} });
  } catch (error) {}
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id });
    video.title = req.body.title;
    video.save();
    res.json({ flag: true, data: video });
  } catch (error) {}
};
