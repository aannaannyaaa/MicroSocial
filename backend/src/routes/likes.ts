import { Router } from "express";
import { auth } from "../middleware/auth";
import { toggleLike } from "../controllers/likeController";

const router = Router();

router.post("/:postId", auth, toggleLike);

export default router;
