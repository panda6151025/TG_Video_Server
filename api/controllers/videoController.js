const Video = require("../models/video");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.addVideo = async (req, res) => {
  const title = req.params.title;
  const files = req.files["video"];

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ errors: { general: "No files were uploaded." } });
  }

  try {
    for (const file of files) {
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `video/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      const newvideo = new Video({
        title: title,
        source: uploadResult.Location,
      });
      await newvideo.save();
      res.json({ flag: true, data: newvideo });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: { general: "There was an error uploading the videos." },
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
