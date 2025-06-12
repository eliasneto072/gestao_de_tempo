import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'
import taskRoutes from './routes/task.routes'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`)
})
