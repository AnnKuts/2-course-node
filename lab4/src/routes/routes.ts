import express from 'express';
const router = express.Router();
import { getAllFanficsController } from '../controllers/controller.ts';

router.get('/', getAllFanficsController);

export default router;