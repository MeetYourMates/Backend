import { Router } from 'express';
import teamController from "../controllers/team.controller";
const router = Router();
router.post('/add', teamController.addTeam);
router.get('/:id',teamController.getTeams);
export default router;