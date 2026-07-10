import { Router } from 'express';
import { CacheController } from '../controllers/CacheController';

const router = Router();
const cacheController = new CacheController();

router.get('/', cacheController.getAllCache);
router.get('/:key', cacheController.getByKey);
router.post('/:key', cacheController.setCache);
router.delete('/:key', cacheController.deleteByKey);

export default router;