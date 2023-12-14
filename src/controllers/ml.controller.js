import Submission from '../models/submission.model.js';

export const changeStatus = async (req, res) => {
  /* #swagger.ignore = true
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
              submissionId: 0,
              status: "VERIFIED"
            }
    }
    */
  const { submissionId, status } = req.body;

  const validStatus = ['REJECTED_BY_ML', 'VERIFIED'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  try {
    const submission = await Submission.findOne({
      where: { id: submissionId },
      order: [['createdAt', 'DESC']],
    });

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image url or user id',
      });
    }

    await Submission.update({ status }, { where: { id: submissionId } });

    return res.status(200).json({
      success: true,
      message: 'Status updated',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default changeStatus;
