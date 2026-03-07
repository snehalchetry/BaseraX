import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as complaintController from '../controllers/complaintController';
import { createComplaintRules, assignComplaintRules, updateStatusRules } from '../validators/complaintValidator';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import roleGuard from '../middleware/roleGuard';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    },
});

const router = Router();

router.get('/', auth, roleGuard('student', 'warden', 'admin'), complaintController.list);
router.post('/', auth, roleGuard('student'), upload.array('images', 4), createComplaintRules, validate, complaintController.create);
router.patch('/:id/assign', auth, roleGuard('warden', 'admin'), assignComplaintRules, validate, complaintController.assign);
router.patch('/:id/status', auth, roleGuard('warden', 'admin'), updateStatusRules, validate, complaintController.updateStatus);

export default router;
