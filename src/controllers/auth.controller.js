import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const saltRounds = 10;

export const register = async (req, res) => {
  const {
    firstName, lastName, role, email, password,
  } = req.body;

  try {
    // Check if email already exists
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      firstName,
      lastName,
      role,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      data: 'user created',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

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

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
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
    const attributes = ['firstName', 'lastName', 'role', 'email'];
    const user = await User.findOne({ where: { id: req.user.id }, attributes });

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
