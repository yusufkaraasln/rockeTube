import { config } from "./config/config"
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logging from "./library/Logging";
import videoRoutes from './routes/Video';
import actorRoutes from './routes/Actor';
import userRoutes from './routes/User';
import commentRoutes from './routes/Comment';
import companyRoutes from './routes/Company';


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/* Connect to MongoDB */

 


console.log(config.mongo.options);

const connectDB = async () => {
    try {
        mongoose.connect(config.mongo.url, {
            retryWrites: true,
            w: "majority"
        });
        startServer()

        Logging.info("Connected to MongoDB");


    } catch (error) {
        Logging.error("Unable to connect to MongoDB");
        Logging.error(error)
        process.exit(1);


    }
}
mongoose.set('strictQuery', false);



const startServer = () => {
    app.use((req, res, next) => {

        Logging.info(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on(
            "finish",
            () => {
                switch (res.statusCode) {

                    case 400 || 401 || 403 || 404:
                        Logging.error(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                        break;
                    case 500 || 501 || 502 || 503 || 504 || 505:
                        Logging.warn(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                        break;
                    default:
                        Logging.info(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                        break;
                }

            }
        )
        next();

    })

   


    /* API Rules */
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    })

    /* Routes */
    app.use("/api/video", videoRoutes);
    app.use("/api/actor", actorRoutes);
    app.use("/api/company", companyRoutes);
    app.use("/api/user",userRoutes );
    app.use("/api/comment",commentRoutes );

    
    /* Healtcheck */
    app.get("/ping", (req, res, next) => {
        res.status(200).send("pong");
    })

    /* Error Handling */
    app.use((req, res, next) => {
        const error = new Error("Not found");
        Logging.error(error);
        return res.status(404).json({
            message: error.message
        });
    });

    http.createServer(app).listen(config.server.port, () => {
        Logging.info(`Server started at ${config.server.port} Port`);
    })


}
connectDB();

export default app;