import {Router} from 'express';
import trophiesController from "../controllers/trophy.controller"


const router = Router();
router.get('/getAll', trophiesController.getTrophies);
router.get('/get/:id', trophiesController.getTrophy);
router.put('/AddTrophy', trophiesController.newTrophy);
router.post('/EditTrophy', trophiesController.updateTrophy);
router.delete('/DeleteTrophy', trophiesController.deleteTrophy);

export default router;
