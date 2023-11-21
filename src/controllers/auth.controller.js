import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../config/db.js';

const saltRounds = 10;

export const register = async (req, res) => {
  const {
    firstName, lastName, role, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      data: 'user created',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = await jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const credentialInfo = async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
      select: {
        firstName: true,
        lastName: true,
        role: true,
        email: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
