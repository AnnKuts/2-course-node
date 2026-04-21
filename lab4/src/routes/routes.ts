import express from 'express';
const router = express.Router();
import { getAllFanficsController, editorController, createController, updateController } from '../controllers/fanficController.ts';

router.get('/', getAllFanficsController);

router.get('/fanfic/editor', editorController);
router.get('/fanfic/editor/:id', editorController);
router.post('/fanfic', express.json(), createController);
router.put('/fanfic/:id', express.json(), updateController);

export default router;