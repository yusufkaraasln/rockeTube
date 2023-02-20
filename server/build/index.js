'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const config_1 = require('./config/config');
const express_1 = __importDefault(require('express'));
const http_1 = __importDefault(require('http'));
const mongoose_1 = __importDefault(require('mongoose'));
const Logging_1 = __importDefault(require('./library/Logging'));
const Video_1 = __importDefault(require('./routes/Video'));
const Actor_1 = __importDefault(require('./routes/Actor'));
const User_1 = __importDefault(require('./routes/User'));
const Comment_1 = __importDefault(require('./routes/Comment'));
const Company_1 = __importDefault(require('./routes/Company'));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* Connect to MongoDB */
console.log(config_1.config.mongo.options);
const connectDB = () =>
    __awaiter(void 0, void 0, void 0, function* () {
        try {
            mongoose_1.default.connect(config_1.config.mongo.url, {
                retryWrites: true,
                w: 'majority'
            });
            startServer();
            Logging_1.default.info('Connected to MongoDB');
        } catch (error) {
            Logging_1.default.error('Unable to connect to MongoDB');
            Logging_1.default.error(error);
            process.exit(1);
        }
    });
mongoose_1.default.set('strictQuery', false);
const startServer = () => {
    app.use((req, res, next) => {
        Logging_1.default.info(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            switch (res.statusCode) {
                case 400 || 401 || 403 || 404:
                    Logging_1.default.error(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                    break;
                case 500 || 501 || 502 || 503 || 504 || 505:
                    Logging_1.default.warn(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                    break;
                default:
                    Logging_1.default.info(`Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
                    break;
            }
        });
        next();
    });
    /* API Rules */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });
    /* Routes */
    app.use('/api/video', Video_1.default);
    app.use('/api/actor', Actor_1.default);
    app.use('/api/company', Company_1.default);
    app.use('/api/user', User_1.default);
    app.use('/api/comment', Comment_1.default);
    /* Healtcheck */
    app.get('/ping', (req, res, next) => {
        res.status(200).send('pong');
    });
    /* Error Handling */
    app.use((req, res, next) => {
        const error = new Error('Not found');
        Logging_1.default.error(error);
        return res.status(404).json({
            message: error.message
        });
    });
    module.exports = http_1.default.createServer(app).listen(config_1.config.server.port, () => {
        Logging_1.default.info(`Server started at ${config_1.config.server.port} Port`);
    });
};
connectDB();
exports.default = app;
