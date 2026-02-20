import express from "express"
import cors from "cors"

import database from "./db/db.js"
import config from "./db/envConfig.js"
import { createServer } from "http";

import userRouter from "./routes/user.route.js"

const app = express();

const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/v1/users" , userRouter)

app.get("/" , (req,res) => {
    res.json({message : "hello from the server"})
})

try {
    await database.authenticate();
    console.log(`Database connected to url ${config.DB_HOST}`);
} catch (error) {
    console.error('Database connection failed: ' , error)
}

server.listen(config.PORT , config.HOST, () => {
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
})