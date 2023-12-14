import axios from 'axios';

import Submission from '../models/submission.model.js';

export const submit = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
              title: "Report Title",
              description: "Report Description",
              imageUrl: "https://static.wikia.nocookie.net/gensin-impact/images/8/88/Hu_Tao_Card.png",
              lat: -6.123456,
              lon: 106.123456
            }
    }
    */
  const {
    title, imageUrl, description, lat, lon,
  } = req.body;

  try {
    const { id: userId, role } = req.user;

    if (role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude',
      });
    }

    const submission = await Submission.create({
      userId,
      lat,
      lon,
      title,
      imageUrl,
      description,
      coords: {
        type: 'Point',
        coordinates: [lon, lat],
        crs: { type: 'name', properties: { name: 'EPSG:4326' } },
      },
    });

    // send to ML with axios
    await axios.put(process.env.ML_ENDPOINT, {
      submissionId: submission.id,
      imageUrl,
    });

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubmissionsByUserId = async (req, res) => {
  const { userId } = req.params;

  const attributes = [
    'id',
    'title',
    'description',
    'imageUrl',
    'lat',
    'lon',
    'status',
    'statusReason',
  ];
  try {
    const submissions = await Submission.findAll({
      where: { userId },
      attributes,
    });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getSubmissionsBySelf = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
     #swagger.description = 'Get all submissions by current logged in user'
  */
  const attributes = [
    'id',
    'title',
    'description',
    'imageUrl',
    'lat',
    'lon',
    'status',
    'statusReason',
  ];
  try {
    if (req.user.role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    const userId = req.user.id;

    const submissions = await Submission.findAll({
      where: { userId },
      attributes,
    });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getSubmissionById = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
     #swagger.description = 'Get submission by id'
  */
  const { id } = req.params;

  const attributes = [
    'id',
    'title',
    'description',
    'imageUrl',
    'lat',
    'lon',
    'status',
    'statusReason',
  ];
  try {
    const submission = await Submission.findOne({
      where: { id },
      attributes,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
