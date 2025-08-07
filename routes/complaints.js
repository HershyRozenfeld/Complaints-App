import express from 'express';
import { submitComplaint, adminView } from '../controllers/complaintsController.js';

const router = express.Router();

// נתיב לטיפול בשליחת תלונה מהטופס
router.post('/submit', submitComplaint);

// נתיב לצפייה בתלונות לאחר אימות סיסמה
router.get('/admin', adminView);

export default router;