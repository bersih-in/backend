import { Op, Sequelize } from 'sequelize';
import Submission from '../models/submission.model.js';

export const getReports = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
              sortByDate: false,
              lat: "-6.123456",
              lon: "106.123456",
              distanceLimit: 10,
            },
            description: `Get all reports by worker. If sortByDate is true, then sort by date.
            If sortByDate is false, then sort by distance. Distance is optional (Default: 10[km]).`
    }
  */
  if (req.user.role !== 'WORKER') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  }

  const {
    sortByDate, lat, lon,
  } = req.body;
  let { distanceLimit } = req.body;

  if (distanceLimit === undefined) {
    distanceLimit = 10;
  }

  const attributes = ['id', 'title', 'description', 'imageUrl', 'lat', 'lon', 'status', 'statusReason',
    [
      Sequelize.fn(
        'ST_Distance',
        Sequelize.cast(Sequelize.col('coords'), 'geography'),
        Sequelize.cast(Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', lon, lat), 4326), 'geography'),
      ),
      'distance',
    ],
  ];

  try {
    if (sortByDate) {
      const submissions = await Submission.findAll({
        attributes,
        order: [['createdAt', 'DESC']],
        where: {
          status: 'PENDING',
          [Op.and]: [
            Sequelize.fn(
              'ST_DWithin',
              Sequelize.cast(Sequelize.col('coords'), 'geography'),
              Sequelize.cast(Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', lon, lat), 4326), 'geography'),
              distanceLimit * 1000,
            ),
          ],
        },
      });

      return res.status(200).json({
        success: true,
        data: submissions,
      });
    }

    // sort by distance
    const submissions = await Submission.findAll({
      attributes,
      order: [
        Sequelize.fn('ST_Distance', Sequelize.col('coords'), Sequelize.fn('ST_MakePoint', lon, lat)),
      ],
      where: {
        status: 'PENDING',
        coords: {
          [Op.and]: [
            Sequelize.fn('ST_DWithin', Sequelize.col('coords'), Sequelize.fn('ST_MakePoint', lon, lat), distanceLimit * 1000),
          ],
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const changeReportState = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
              reportId: 1,
              status: "IN_PROGRESS",
              statusReason: "Report is being processed"
            },
            description: `Change state report by worker.
            Valid status: IN_PROGRESS, FINISHED, REJECTED_BY_WORKER`
    }
  */
  if (req.user.role !== 'WORKER') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  }
  const workerId = req.user.id;

  const { reportId, status, statusReason } = req.body;

  const validStatus = ['IN_PROGRESS', 'FINISHED', 'REJECTED_BY_WORKER'];

  if (!validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Valid status: IN_PROGRESS, FINISHED, REJECTED_BY_WORKER',
    });
  }

  try {
    const submission = await Submission.findOne({
      where: {
        id: reportId,
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const mutableStatus = ['PENDING', 'VERIFIED', 'IN_PROGRESS'];
    if (!mutableStatus.includes(submission.status)) {
      return res.status(400).json({
        success: false,
        message: `Current report state cannot be changed: '${submission.status}'`,
      });
    }

    await Submission.update({
      status,
      statusReason: statusReason || '',
      workedBy: workerId,
    }, {
      where: {
        id: reportId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Report state changed',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export default getReports;
