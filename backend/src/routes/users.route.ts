import { Router } from 'express';
import { getUsers, toggleUserStatus, deleteUser, createUser } from '../controllers/users.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Barcha yo'nalishlar uchun Admin huquqi kerak
router.use(verifyToken, verifyAdmin);

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:uid/status', toggleUserStatus);
router.delete('/:uid', deleteUser);

export default router;
