import { Router } from 'express';
import { getAllRoles, createRole, getRoleById, updateRole, deleteRole } from '../controllers/roleController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Definir rutas para roles
router.get('/', authenticate, authorize(['admin']), getAllRoles);
router.post('/', authenticate, authorize(['admin']), createRole);
router.get('/:id', authenticate, authorize(['admin']), getRoleById);
router.put('/:id', authenticate, authorize(['admin']), updateRole);
router.delete('/:id', authenticate, authorize(['admin']), deleteRole);

export { router as roleRoutes };  // Exportación nombrada

