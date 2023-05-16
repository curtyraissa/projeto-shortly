import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"

// Criação do servidor
const app = express()

// Configurações
app.use(express.json())
app.use(cors())
app.use(router)

// Deixa o app escutando, à espera de requisições
const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})
