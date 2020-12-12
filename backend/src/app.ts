//Importamos dependencias
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from'body-parser';
import passport from 'passport'
//Importamos fichero de rutas
import authRoutes, { use } from './routes/auth.routes'
import studentRoutes from './routes/student.routes'
import universityRoutes from './routes/university.routes'
import facultyRoutes from './routes/faculty.routes'
import degreeRoutes from './routes/degree.routes'
import trophiesRoutes from './routes/trophies.routes'
import insigniasRoutes from './routes/insignias.routes'
import courseRoutes from './routes/course.routes'
import passportMiddleware from './middlewares/passport';
//Inicializamos express
const app = express();

//Configuración
//Cuando haya variable de entorno sera PORT y sino 3000
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(cors());
//*******************************KRUNAL**************************************/
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//Against deprectaction warning of bodyparser
app.use(express.urlencoded({
    extended: true
  }));
app.use(express.json());
//Passport JWT
app.use(passport.initialize());
passport.use(passportMiddleware);
//*******************************KRUNAL**************************************/
//Changes

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
