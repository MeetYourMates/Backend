import { Router } from 'express';
import teamController from "../controllers/team.controller";
const router = Router();
router.post('/add', teamController.addTeam);
router.post("/invite", teamController.inviteStudent);
router.get("/invitations/:id/:action", teamController.invitationAction);
router.get("/invitations/:id", teamController.getInvitations);
router.get('/:id',teamController.getTeams);
router.post("/:id", teamController.joinTeam);



export default router;
