import express from 'express';
const router = express.Router();
import { create} from '../controllers/contactController.js';

router.post('/', create);

export default router;
