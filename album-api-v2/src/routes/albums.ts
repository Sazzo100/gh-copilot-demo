import { Router, Request, Response } from 'express'
import * as albumStore from '../models/album'
import type { AlbumRequest } from '../models/album'

const router = Router()

// GET /albums
router.get('/', (_req: Request, res: Response) => {
  res.json(albumStore.getAll())
})

// GET /albums/search?year=N
// Must be registered before /:id to avoid route shadowing
router.get('/search', (req: Request, res: Response) => {
  const year = parseInt(req.query['year'] as string, 10)
  if (isNaN(year)) {
    res.status(400).json({ error: 'Query parameter "year" must be a valid integer.' })
    return
  }
  res.json(albumStore.getByYear(year))
})

// GET /albums/:id
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'], 10)
  if (isNaN(id)) {
    res.status(400).json({ error: 'Parameter "id" must be a valid integer.' })
    return
  }
  const album = albumStore.getById(id)
  if (!album) {
    res.status(404).json({ error: `Album with id ${id} was not found.` })
    return
  }
  res.json(album)
})

// POST /albums
router.post('/', (req: Request, res: Response) => {
  const { title, artist, price, image_url, year } = req.body as AlbumRequest
  if (!title || !artist || price === undefined || !image_url || year === undefined) {
    res.status(400).json({ error: 'title, artist, price, image_url and year are required.' })
    return
  }
  const album = albumStore.create({ title, artist, price, image_url, year })
  res.status(201).location(`/albums/${album.id}`).json(album)
})

// PUT /albums/:id
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'], 10)
  if (isNaN(id)) {
    res.status(400).json({ error: 'Parameter "id" must be a valid integer.' })
    return
  }
  const { title, artist, price, image_url, year } = req.body as AlbumRequest
  if (!title || !artist || price === undefined || !image_url || year === undefined) {
    res.status(400).json({ error: 'title, artist, price, image_url and year are required.' })
    return
  }
  const updated = albumStore.update(id, { title, artist, price, image_url, year })
  if (!updated) {
    res.status(404).json({ error: `Album with id ${id} was not found.` })
    return
  }
  res.json(updated)
})

// DELETE /albums/:id
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'], 10)
  if (isNaN(id)) {
    res.status(400).json({ error: 'Parameter "id" must be a valid integer.' })
    return
  }
  const deleted = albumStore.remove(id)
  if (!deleted) {
    res.status(404).json({ error: `Album with id ${id} was not found.` })
    return
  }
  res.status(204).send()
})

export default router
