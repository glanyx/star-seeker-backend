import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"

import { GatesRoute } from './routes/gates'
import { TransportRoute } from './routes/transport'
import { HealthRoute } from './routes/health'

dotenv.config();

AppDataSource.initialize().then(async () => {

  console.log('Data source initialised')

}).catch(error => console.log(error))

const app: Express = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript API Server')
})

app.use('/gates', GatesRoute)
app.use('/transport', TransportRoute)
app.use('/health', HealthRoute)

app.listen(port, () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`)
})

export default app