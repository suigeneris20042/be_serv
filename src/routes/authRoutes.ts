import { Router } from 'express';
import { login,register } from '../controllers/authControllers';

const router = Router();

router.post('/login', login);

// Ruta para el registro
router.post('/register', register); 

export default router;
