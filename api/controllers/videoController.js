const Video = require("../models/video");

exports.addVideo = async (req, res) => {
  try {
    const { title, source } = req.body;

    const newVideo = new Video({
      title: title,
      source: source,
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video added successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding video",
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
      errors: { general: "There was an error fetching the videos" },
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ flag: true, data: {} });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting video", error: error.message });
  }
};
