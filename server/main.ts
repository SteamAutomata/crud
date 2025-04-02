import express, { IRoute, NextFunction, Request } from 'express'
import cors from 'cors'
import { app, Handler, Payload, prisma } from './globals'
import { userHandler } from './handlers/user'
import { Response } from 'express-serve-static-core'
import { postHandler } from './handlers/post'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import expressListRoutes from 'express-list-routes'

dotenv.config()
app.use(cors())
app.use(express.json())

// Permet de savoir quand un serveur reçoit une requête
app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`)
  next()
})

export function api(route: string) {
  return `/api${route}`
}

function handle(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next))
      .catch(err => {
        res.status(500).json({ error: err.message })
      })
      .then(v => res.status(200).json(v))
  }
}

function authMiddleware(req: Request & { payload: Payload }, res, next) {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: 'Access denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as string
    req.payload = decoded as unknown as Payload
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function methodNotAllowed(req: any, res: any, next: any) {
  return res.status(405).send()
}

app
  .route(api('/user/:id'))
  .get(handle(async req => userHandler.read(parseInt(req.params.id)))) // GET User
  .put(handle(async req => userHandler.update(parseInt(req.params.id), req.body))) // EDIT User
  .delete(handle(async req => userHandler.delete(parseInt(req.params.id)))) // DELETE User

app
  .route(api('/user/'))
  .post(handle(async req => userHandler.create(req.body))) // CREATE User
  .get(handle(async req => userHandler.list())) // LIST User

app
  .route(api('/post/:id'))
  .get(handle(req => postHandler.getPostFromId(parseInt(req.params.id, 10))))
  .delete(handle(req => postHandler.delete(parseInt(req.params.id, 10))))
  .put(
    handle(req => {
      throw 'Not Implemented'
    })
  )

app
  .route(api('/post'))
  .get(handle(async req => postHandler.getPage(0)))
  .post(
    handle(async req => {
      const { userId, respondingToId, ...body } = req.body

      await postHandler.createPost(
        body,
        parseInt(userId, 10),
        parseInt(respondingToId, 10)
      )

      return 'Post created successfully'
    })
  )

// auth
app.post(api('/login'), async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({
    select: {
      email: true,
      password: true,
      id: true,
      name: true,
      role: true,
      avatar: true,
    },
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const { id, role, name, avatar } = user

  const token = jwt.sign({ id, role, name, avatar }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  })
  res.json({ token })
})

expressListRoutes(app)
app.listen(3000, () => console.log('Server is listening on port 3000...'))
