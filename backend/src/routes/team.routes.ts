import { Router } from 'express';
import teamController from "../controllers/team.controller";
import team from '../models/team';
const router = Router();
router.post('/add', teamController.addTeam);
router.post("/invite", teamController.inviteStudent);
router.get("/invitations/:id/:action", teamController.invitationAction);
router.get("/invitations/:id", teamController.getInvitations);
router.get('/:id',teamController.getTeams);
router.get('/student/:id',teamController.getTeamsStudent);
router.get('/studentsTeam/:id',teamController.getTeamsStudent);
router.post("/:id", teamController.joinTeam);
router.put('/update', teamController.updateTeam);



export default router;
