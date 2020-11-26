import {Router} from 'express';
import insigniasController from "../controllers/insignia.controller"


const router = Router();

router.get('/getAll', insigniasController.getInsignias);
router.get('/get/:id', insigniasController.getInsignia);
router.put('/AddInsignia', insigniasController.newInsignia);
router.post('/EditInsignia', insigniasController.updateInsignia);
router.delete('/DeleteInsignia', insigniasController.deleteInsignia);

export default router;
