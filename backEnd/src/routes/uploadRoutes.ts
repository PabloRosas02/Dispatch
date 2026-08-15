import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Aseguramos que exista la carpeta donde se guardarán las imágenes físicas
// Se guardarán en: backEnd/public/uploads/
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuramos Multer para guardar el archivo en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Generamos un nombre único: timestamp + número aleatorio + extensión original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite estricto de 10 MB
});

// Creamos el Endpoint POST
router.post('/', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, errorDetail: 'No se recibió ningún archivo' });
    }

    // Construimos la URL pública que usará el frontend
    const fileUrl = `/api/uploads/${req.file.filename}`;
    
    // Devolvemos la URL al frontend
    res.status(201).json({ success: true, data: { url: fileUrl } });
  } catch (error: any) {
    res.status(500).json({ success: false, errorDetail: error.message || 'Error interno al subir archivo' });
  }
});

export default router;