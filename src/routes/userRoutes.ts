import { Router } from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.post('/', authenticate, authorize(['admin']), createUser);
router.get('/:id', authenticate, authorize(['admin', 'editor']), getUserById);
router.put('/:id', authenticate, authorize(['admin']), updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

export default router;
