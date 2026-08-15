import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

// Importación de rutas
import cacheRoutes from './routes/cacheRoutes';
import serverRoutes from './routes/serverRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

// --- MIDDLEWARES CENTRALES ---
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ahora las imágenes se servirán a través de la ruta segura de la API
app.use('/api/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// --- MAPEO DE ENDPOINTS ---
app.use('/api/cache', cacheRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/upload', uploadRoutes); 

// Ruta Base / Health Check
app.get('/api/', (req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date()
  });
});

// Catch‑all global (Modificado a 404 - Not Found)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    errorDetail: "El endpoint solicitado no existe."
  });
});

// --- ENCENDIDO DEL ENTORNO ---
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`Servidor en TypeScript activo: http://localhost:${PORT}`);
  console.log(`Enrutador de Servidores RP: http://localhost:${PORT}/api/servers`);
  console.log(`Enrutador de Caché de Strings: http://localhost:${PORT}/api/cache`);
  console.log(`Enrutador de Subida Multimedia: http://localhost:${PORT}/api/upload`);
  console.log(`Carpeta Pública de Archivos: http://localhost:${PORT}/uploads`);
  console.log(`================================================================`);
});