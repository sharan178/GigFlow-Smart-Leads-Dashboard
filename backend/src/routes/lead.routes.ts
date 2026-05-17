import { Router } from "express";
import { createLead, deleteLead, getLead, getLeads, updateLead } from "../controllers/lead.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validateLead } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate);
router.get("/", getLeads);
router.post("/", validateLead, createLead);
router.get("/:id", getLead);
router.put("/:id", validateLead, updateLead);
router.delete("/:id", authorize("admin"), deleteLead);

export default router;
