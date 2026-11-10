import { Router } from "express";
import { postQuestion, titles, getProblemBySlug} from "../controllers/probcon.js";
import { runSamples } from "../controllers/runController.js";
import protect from "../middlewares/validateToken.js";
// import authorizeadmin from "../middlewares/authorizeAdmin";

const router = Router();

router.post("/postquestion",postQuestion);
router.post("/submission",runSamples);
router.get("/titles",titles);
router.get("/:slug",getProblemBySlug);
router.post("/submit",runSamples);

export default router;