import express from 'express';
import { list, getBySlug } from '../controllers/projectsController.js';

const router = express.Router();

router.get('/', list);
router.get('/:slug', getBySlug);

export default router;
