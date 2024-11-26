import { Router } from 'express';
import { getAllBienes, createBien, getBienById, updateBien, deleteBien,getAniosBienes,getBienesPorAnio } from '../controllers/bienController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();



router.get('/anios/:anio', getBienesPorAnio);
router.get('/anios',  getAniosBienes);
router.get('/',  getAllBienes);


router.post('/', authenticate, authorize(['admin', 'editor']), createBien);
router.get('/:id', authenticate, authorize(['admin', 'editor', 'viewer']), getBienById);
router.put('/:id', authenticate, authorize(['admin', 'editor']), updateBien);
router.delete('/:id', authenticate, authorize(['admin']), deleteBien);

export default router;
