import { Router } from "express";
import {cadastro, login, inserirURL, listarURLporId, buscarShortURL, deletarURL, listarUsuarioToken, ranking} from "../controllers/controllers.js";


const urlRouter = Router()

urlRouter.post("/signup", cadastro)
urlRouter.post("/signin", login)
urlRouter.post("/urls/shorten", inserirURL)
urlRouter.get("/urls/:id", listarURLporId)
urlRouter.get("/urls/open/:shortUrl", buscarShortURL)
urlRouter.delete("/urls/:id", deletarURL)
urlRouter.get("/users/me", listarUsuarioToken)
urlRouter.get("/ranking", ranking)


export default urlRouter