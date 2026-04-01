import { Router } from "express";
import books from "../services/books/route/index.js";

const router = Router();

router.use("/", books);

export default router;
