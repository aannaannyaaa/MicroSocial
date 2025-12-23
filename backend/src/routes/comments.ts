import { Router } from "express";
import { auth } from "../middleware/auth";
import { addComment, getComments } from "../controllers/commentController";

const router = Router();

router.get("/:postId", auth, getComments);
router.post("/:postId", auth, addComment);

export default router;
