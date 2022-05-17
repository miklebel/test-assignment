import { Router } from 'express'
import { indexRoute } from './routes'

export const router = Router()

router.get('/', indexRoute)
