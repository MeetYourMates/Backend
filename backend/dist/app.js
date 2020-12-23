"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importamos dependencias
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var passport_2 = __importDefault(require("./middlewares/passport"));
//Importamos fichero de rutas
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var course_routes_1 = __importDefault(require("./routes/course.routes"));
var degree_routes_1 = __importDefault(require("./routes/degree.routes"));
var faculty_routes_1 = __importDefault(require("./routes/faculty.routes"));
var insignias_routes_1 = __importDefault(require("./routes/insignias.routes"));
var project_routes_1 = __importDefault(require("./routes/project.routes"));
var student_routes_1 = __importDefault(require("./routes/student.routes"));
var trophies_routes_1 = __importDefault(require("./routes/trophies.routes"));
var university_routes_1 = __importDefault(require("./routes/university.routes"));
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon'); //Serve Favicon for webpage
//Starting Express
var app = express_1.default();
//Configuration
//Setting Port as Environment Provided else using 3000
app.set('port', process.env.PORT || 3000);
app.use(cors()); //Allow CORS!
app.use(express_1.default.static('views'));
//middlewares
app.use(morgan_1.default('dev'));
//*******************************KRUNAL**************************************/
app.use(cookieParser());
//For Public Folder such as WebPage and Etc...
app.use(express_1.default.static(path.join(__dirname, "../dist/public")));
//For Serving Images could be any big image...
app.use('/images', express_1.default.static(path.join(__dirname, "../dist/images")));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "../dist/public", "/favicon.ico")));
//Against deprectaction warning of bodyparser 
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use('/project', project_routes_1.default);
// Middleware to catch 404 errors
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname, "../dist/public", '/views', '/404.html'));
});
//Exportamos fichero como 'app'
exports.default = app;
//# sourceMappingURL=app.js.map