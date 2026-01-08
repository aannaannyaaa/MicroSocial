import { Router } from "express";
import { auth } from "../middleware/auth";
import { addComment, getComments, deleteComment } from "../controllers/commentController";

const router = Router();

router.get("/:postId", auth, getComments);
router.post("/:postId", auth, addComment);
router.delete("/:commentId", auth, deleteComment);

export default router;
