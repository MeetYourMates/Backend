//Importamos dependencias
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';
//Importamos fichero de rutas
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import degreeRoutes from './routes/degree.routes';
import facultyRoutes from './routes/faculty.routes';
import insigniasRoutes from './routes/insignias.routes';
import projectRoutes from './routes/project.routes';
import studentRoutes from './routes/student.routes';
import trophiesRoutes from './routes/trophies.routes';
import universityRoutes from './routes/university.routes';

var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser')
var favicon = require('serve-favicon');//Serve Favicon for webpage
//Starting Express
const app = express();
//Configuration
//Setting Port as Environment Provided else using 3000
app.set('port', process.env.PORT || 3000);
app.use(cors());//Allow CORS!
app.use(express.static('views'));
//middlewares
app.use(morgan('dev'));
//*******************************KRUNAL**************************************/
app.use(cookieParser());
//For Public Folder such as WebPage and Etc...
app.use(express.static(path.join(__dirname, 'public')));
//For Serving Images could be any big image...
app.use('/images', express.static(path.join(__dirname, 'images')));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "../dist/public", '/favicon.ico')));
//Against deprectaction warning of bodyparser 
app.use(express.urlencoded({extended: true}));
// parse application/json
app.use(express.json());
//Passport JWT
app.use(passport.initialize());
passport.use(passportMiddleware);
//*******************************KRUNAL**************************************/
//API Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/university',universityRoutes);
app.use('/faculty',facultyRoutes);
app.use('/degree',degreeRoutes);
app.use('/trophy', trophiesRoutes);
app.use('/insignia', insigniasRoutes);
app.use('/course',courseRoutes);
app.use('/project',projectRoutes);

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(__dirname,"../dist/public",'/views', '/404.html'));
});
//Exportamos fichero como 'app'
export default app;
