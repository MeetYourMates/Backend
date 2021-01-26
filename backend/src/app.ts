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
import professorRoutes from './routes/professor.routes';
import projectRoutes from './routes/project.routes';
import studentRoutes from './routes/student.routes';
import subjectRoutes from './routes/subject.routes';
import trophiesRoutes from './routes/trophies.routes';
import meetingRoutes from './routes/meetings.routes';
import universityRoutes from './routes/university.routes';
import teamRoutes from './routes/team.routes';
import taskRoutes from './routes/task.routes';

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
app.use(express.static(path.join(__dirname, "../dist/public")));
//For Serving Images could be any big image...
app.use('/images', express.static(path.join(__dirname, "../dist/images")));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "../dist/public", "/favicon.ico")));
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
app.use('/subject', subjectRoutes);
app.use('/student', studentRoutes );
app.use('/professor', professorRoutes);
app.use('/university',universityRoutes);
app.use('/faculty',facultyRoutes);
app.use('/degree',degreeRoutes);
app.use('/trophy', trophiesRoutes);
app.use('/insignia', insigniasRoutes);
app.use('/course',courseRoutes);
app.use('/project',projectRoutes);
app.use('/team', teamRoutes);
app.use('/meeting',meetingRoutes);
app.use('/task',taskRoutes);

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(__dirname,"../dist/public",'/views', '/404.html'));
});

//Exportamos fichero como 'app'
export default app;
