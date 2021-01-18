import {Router} from 'express';
import meetingController from "../controllers/meeting.controller"


const router = Router();
//router.get('/getAll', meetingController.getMeetings);
router.get('/get/:id', meetingController.getMeetings);
router.post('/addMeeting', meetingController.newMeeting);
/*router.post('/EditMeeting', meetingController.updateMeetings);
router.delete('/DeleteMeeting', meetingController.deleteMeetings);*/

export default router;
