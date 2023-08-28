import { Router } from "express";
const router = new Router();
import controller from "../authController.js";
import { check } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "The password must be more than 5 characters").isLength({
      min: 5,
    }),
    check("email", "Invalid email address").isEmail(),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users",roleMiddleware(['Admin']), controller.getUsers);

export default router;
