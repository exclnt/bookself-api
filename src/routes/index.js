import { Router } from "express";
import books from "../services/books/route/index.js";
import users from "../services/users/routes/index.js";

const router = Router();

router.use("/", books);
router.use("/", users);

export default router;
