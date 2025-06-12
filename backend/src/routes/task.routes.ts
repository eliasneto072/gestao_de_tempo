import { Router } from 'express'
import { createTask, getTasks, toggleComplete } from '../controllers/task.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.use(authMiddleware)

router.post('/', createTask)
router.get('/', getTasks)
router.put('/:id/toggle', toggleComplete)

export default router
