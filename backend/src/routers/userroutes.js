import { Router } from "express";
import { registerUser, loginUser, logoutuser, currentUser} from "../controllers/usercon.js";
import protect from "../middlewares/validateToken.js";


const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutuser);
router.get("/current",protect,currentUser)

export default router;