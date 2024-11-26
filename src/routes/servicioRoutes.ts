import { Router } from 'express';
import { getAllServicios, createServicio, getServicioById, updateServicio, deleteServicio, getAniosServicios,getServiciosPorAnio } from '../controllers/servicioControllers';
import { authenticate, authorize } from '../middleware/authMiddleware';
const router = Router();

router.get('/anios/:anio', getServiciosPorAnio);
router.get('/anios', getAniosServicios);
router.get('/',  getAllServicios);

router.post('/', authenticate, authorize(['admin', 'editor']), createServicio);
router.get('/:id', authenticate, authorize(['admin', 'editor', 'viewer']), getServicioById);
router.put('/:id', authenticate, authorize(['admin', 'editor']), updateServicio);
router.delete('/:id', authenticate, authorize(['admin']), deleteServicio);

export default router;
