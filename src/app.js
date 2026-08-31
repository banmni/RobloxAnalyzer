import express from "express"
import {errorHandler} from "./middleware/error-handler.js"

const app = express()

app.disable('x-powered-by')
app.use(express.json({limit:"100kb"}))

app.get("/api/health", (request,response)=>{
    response.status(200).json({
        status:"ok",
    })
})

app.use((request, response)=>{
    response.status(404).json({
        error:"Route not found",
    })
})

app.use(errorHandler)

export default app