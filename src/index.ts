import * as express from 'express'
import { engine } from 'express-handlebars'
import { db } from './infra/database'
import { router } from './infra/router'
import helpers from './helpers/handlebars'

const main = async () => {
  const app = express()
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      partialsDir: [`${__dirname}/views/partials`, `${__dirname}/views/partials/table`],
      defaultLayout: 'main',
      helpers
    })
  )

  app.set('view engine', 'hbs')
  app.set('views', `${__dirname}/views`)

  app.use('/', router)

  app.listen(3000, async () => {
    console.log('Started on port 3000')
    await db.connect()
  })

  process.on('SIGINT', async () => {
    await db.end()
  })
}

main()
