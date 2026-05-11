import { Router } from 'express';
import { getCertificates, issueCertificate, deleteCertificate } from '../controllers/certificates.controller';
import { verifyToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Barcha yo'nalishlar uchun Admin huquqi kerak
router.use(verifyToken, verifyAdmin);

router.get('/', getCertificates);
router.post('/', issueCertificate);
router.delete('/:id', deleteCertificate);

export default router;
