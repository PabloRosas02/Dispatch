import { Router } from 'express';
import { ServerController } from '../controllers/ServerController';

const router = Router();
const serverController = new ServerController();

router.get('/', serverController.getAll);
router.get('/:id', serverController.getById);
router.post('/', serverController.save);
router.delete('/:id', serverController.delete);

export default router;