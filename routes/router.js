import { Router } from "express";
import controller from "../authController.js";
import { check } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import notesController from "../notesController.js";

const router = new Router();
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
router.get("/users", roleMiddleware(["Admin"]), controller.getUsers);

router.post("/create", authMiddleware, [
  check("title", "Title cannot be empty").notEmpty(),
  check("content", "Content cannot be empty").notEmpty(),
], notesController.createNote);

router.get("/notes", authMiddleware, notesController.getNoteDyUser);
router.post("/update/:id", authMiddleware, notesController.updateNote);

router.delete("/delete/:id", authMiddleware, notesController.deleteNote);
router.put("/update/restore/:id", authMiddleware, notesController.restoreNote);

export default router;