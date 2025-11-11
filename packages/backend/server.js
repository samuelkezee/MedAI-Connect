import app from './app.js'
import dotenv from 'dotenv'
import { connectDatabase } from './config/db.js'

dotenv.config({path: './config/config.env'})

connectDatabase()

app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})