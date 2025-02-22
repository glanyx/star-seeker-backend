import { Router } from "express"

const router = Router()

// define the home page route
router.get('/', (req, res) => {

  res.send('OK')

})

export default router