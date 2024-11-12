const AWS = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const Video = require("../models/video");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.getPresignedUrl = async (req, res) => {
  const fileName = req.params.fileName;
  const fileType = req.query.fileType;

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: `video/${Date.now()}_${fileName}`,
    Expires: 60 * 5,
    ContentType: fileType,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);
    res.json({ uploadUrl: signedUrl });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return res
      .status(500)
      .json({ errors: { general: "Error generating presigned URL" } });
  }
};

exports.addVideo = async (req, res) => {
  const title = req.params.title;
  const file = req.files["video"];

  if (!file || !file.length) {
    return res
      .status(400)
      .json({ errors: { general: "No files were uploaded." } });
  }

  try {
    const tempFilePath = path.join(__dirname, "temp_video.mp4");

    ffmpeg(file.buffer)
      .output(tempFilePath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions("-preset", "ultrafast") // Prioritize speed
      .on("end", async () => {
        // Upload compressed video to S3
        const uploadParams = {
          Bucket: process.env.S3_BUCKET,
          Key: `video/${Date.now()}_${file.name}`,
          Body: fs.createReadStream(tempFilePath),
          ContentType: "video/mp4", // You can set this to the actual content type if needed
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        // Save video details to database
        const newVideo = new Video({
          title: title,
          source: uploadResult.Location,
        });
        await newVideo.save();

        // Delete temporary file
        fs.unlinkSync(tempFilePath);

        res.json({ flag: true, data: newVideo });
      })
      .on("error", (err) => {
        console.error("Error during compression:", err);
        return res.status(500).json({
          errors: { general: "Error compressing video." },
        });
      })
      .run();
  } catch (error) {
    console.error("Error during video upload:", error);
    return res.status(500).json({
      errors: { general: "There was an error uploading the video." },
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
