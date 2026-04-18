import { Router } from "express";
import books from "../services/books/route/index.js";
import users from "../services/users/routes/index.js";
import authentications from "../services/authentications/routes/index.js";
import collaborations from "../services/collaborations/routes/index.js";

const router = Router();

router.use("/", books);
router.use("/", users);
router.use("/", authentications);
router.use("/", collaborations);

export default router;
