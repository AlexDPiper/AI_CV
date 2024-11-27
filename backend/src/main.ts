import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

app.get('/', (req: Request, res: Response) => {
    res.send(`Server is running on ${PORT}`)
})

app.listen(PORT, () => { 
    console.log(`Server is running on ${PORT}`)
})