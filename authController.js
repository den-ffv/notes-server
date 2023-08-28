import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import Role from "./models/Role.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import secret from "./config.js";
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error when registering", errors });
      }
      const { username, email, password } = req.body;
      const existiongUserByUsername = await User.findOne({ username });
      if (existiongUserByUsername) {
        return res.status(400).json({ message: "The user already exists" });
      }

      const existiongUserByEmail = await User.findOne({email})
      if (existiongUserByEmail) {
        return res.status(400).json({message: "The email already exists"})
        
      }

      const hashPassword = bcryptjs.hashSync(password, 5);
      const userRole = await Role.findOne({ value: "User" });
      const user = new User({
        username,
        email,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ message: "The registry is successful", user, token });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "registration error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User was not found" });
      }
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ user, token });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "get user error" });
    }
  }
}

export default new authController();
