//Importamos dependencias
import cors from 'cors';
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
import studentRoutes from './routes/student.routes';
import trophiesRoutes from './routes/trophies.routes';
import universityRoutes from './routes/university.routes';
var path = require('path');

//Inicializamos express
const app = express();
//Path for Express Server
//const path = require('path');
//Serve Favicon for webpage
var favicon = require('serve-favicon');

//Configuración
//Cuando haya variable de entorno sera PORT y sino 3000
app.set('port', process.env.PORT || 3000);
app.use(express.static('views'));
//middlewares
app.use(morgan('dev'));
app.use(cors());
//*******************************KRUNAL**************************************/
//var dirPublic = path.join(__dirname, 'public');
app.use(express.urlencoded({extended:false}));
//For Public Folder such as WebPage and Etc...
app.use(express.static(path.join(__dirname, 'public')));
//For Serving Images could be any big image...
app.use('/images', express.static(path.join(__dirname, 'images')));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "/public", '/favicon.ico')));
//Against deprectaction warning of bodyparser 
app.use(express.urlencoded({
    extended: true
  }));
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

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/src/views/404.htm');
});
//Exportamos fichero como 'app'
export default app;
