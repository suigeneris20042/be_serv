import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, authorize(["super_admin"]), getAllUsers);
router.post("/", authenticate, authorize(["super_admin"]), createUser);
router.get("/:id", authenticate, authorize(["super_admin"]), getUserById);
router.put("/:id", authenticate, authorize(["super_admin"]), updateUser);
router.delete("/:id", authenticate, authorize(["super_admin"]), deleteUser);

export default router;
