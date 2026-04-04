import dotenv from "dotenv";
import server from "./server/index.js";
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const port = process.env.PORT;
const host = process.env.HOST;

server.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
