import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

app.get('/', (req: Request, res: Response) => {
    res.send(`Server is running on ${port}`)
})

app.listen(port, () => { 
    console.log(`Server is running on ${port}`)
})