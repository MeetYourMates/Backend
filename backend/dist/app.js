"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importamos dependencias
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
//Importamos fichero de rutas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const degree_routes_1 = __importDefault(require("./routes/degree.routes"));
const faculty_routes_1 = __importDefault(require("./routes/faculty.routes"));
const insignias_routes_1 = __importDefault(require("./routes/insignias.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const trophies_routes_1 = __importDefault(require("./routes/trophies.routes"));
const university_routes_1 = __importDefault(require("./routes/university.routes"));
var path = require('path');
//Inicializamos express
const app = express_1.default();
//Path for Express Server
//const path = require('path');
//Serve Favicon for webpage
var favicon = require('serve-favicon');
//Configuración
//Cuando haya variable de entorno sera PORT y sino 3000
app.set('port', process.env.PORT || 3000);
app.use(express_1.default.static('views'));
//middlewares
app.use(morgan_1.default('dev'));
app.use(cors_1.default());
//*******************************KRUNAL**************************************/
//var dirPublic = path.join(__dirname, 'public');
app.use(express_1.default.urlencoded({ extended: false }));
//For Public Folder such as WebPage and Etc...
app.use(express_1.default.static(path.join(__dirname, 'public')));
//For Serving Images could be any big image...
app.use('/images', express_1.default.static(path.join(__dirname, 'images')));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "/public", '/favicon.ico')));
//Against deprectaction warning of bodyparser 
app.use(express_1.default.urlencoded({
    extended: true
}));
// parse application/json
app.use(express_1.default.json());
//Passport JWT
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
//*******************************KRUNAL**************************************/
//API Routes
app.use('/auth', auth_routes_1.default);
app.use('/student', student_routes_1.default);
app.use('/university', university_routes_1.default);
app.use('/faculty', faculty_routes_1.default);
app.use('/degree', degree_routes_1.default);
app.use('/trophy', trophies_routes_1.default);
app.use('/insignia', insignias_routes_1.default);
app.use('/course', course_routes_1.default);
// Middleware to catch 404 errors
app.use(function (req, res, next) {
    res.status(404).sendFile(process.cwd() + '/src/views/404.htm');
});
//Exportamos fichero como 'app'
exports.default = app;
//# sourceMappingURL=app.js.map