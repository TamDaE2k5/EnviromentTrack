import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser'
import { user } from './models/users.js'
import { session } from "./models/sessions.js";
import authRoute from "./routes/authRoute.js";
import { protectRoute } from "./middlewares/authorization.js";
import profileRoute from './routes/profileUser.js'

dotenv.config( {path :"../.env"}) // lưu ý là path này tính từ thư mục node => = node_module
const port = process.env.BACKEND_PORT;
const app = express();

app.use(morgan("dev")); // log
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

// public route
app.use('/api/auth', authRoute)
// private route
app.use(protectRoute)
app.use('/api', profileRoute)

app.listen(port, async () => {
  await user(),
  await session(),
  console.log(`App running at http://localhost:${port}`);
});
