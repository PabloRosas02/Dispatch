import { Router } from 'express';
import { ServerController } from '../controllers/ServerController';

const router = Router();
const serverController = new ServerController();

// --- OPERACIONES GLOBALES DEL SERVIDOR ---
router.get("/", serverController.getAll);
router.get("/basic-info", serverController.getAllBasic);
router.get("/addit-info", serverController.getAllAddit);
router.get("/rules-info", serverController.getAllRulePage);
router.post("/", serverController.saveComplete);
router.delete("/:id", serverController.delete);

// --- 🎯 ENDPOINTS DE RUTAS FILTRADAS POR MIEMBRO ---

// 1. Rutas del miembro 'basic'
router.get("/:id/basic", serverController.getBasicInfo);
router.put("/:id/basic", serverController.updateBasicInfo);

// 2. Rutas del miembro 'addit'
router.get("/:id/addit", serverController.getAdditionalInfo);
router.put("/:id/addit", serverController.updateAdditionalInfo);

// 3. Rutas del miembro 'banner'
router.get("/:id/banner", serverController.getBannerDetails);
router.put("/:id/banner", serverController.updateBannerDetails);

// 4. Rutas del miembro 'ver'
router.get("/:id/ver", serverController.getVersionAndStatus);
router.put("/:id/ver", serverController.updateVersionAndStatus);

// 5. Rutas del miembro 'sections'
router.get("/:id/sections", serverController.getSections);
router.put("/:id/sections", serverController.updateSections); // Reemplaza todo el bloque de reglas

export default router;
