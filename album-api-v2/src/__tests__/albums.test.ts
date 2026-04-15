import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../app'
import * as store from '../models/album'

beforeEach(() => {
    store.reset()
})

describe('GET /albums', () => {
    it('returns all 6 seed albums', async () => {
        const res = await request(app).get('/albums')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(6)
    })

    it('returns albums with expected shape', async () => {
        const res = await request(app).get('/albums')
        const album = res.body[0]
        expect(album).toHaveProperty('id')
        expect(album).toHaveProperty('title')
        expect(album).toHaveProperty('artist')
        expect(album).toHaveProperty('price')
        expect(album).toHaveProperty('image_url')
        expect(album).toHaveProperty('year')
        expect(album.artist).toHaveProperty('name')
        expect(album.artist).toHaveProperty('birthdate')
        expect(album.artist).toHaveProperty('birthPlace')
    })
})

describe('GET /albums/search', () => {
    it('returns albums matching the given year', async () => {
        const res = await request(app).get('/albums/search?year=2021')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0].title).toBe('Scale It Up')
    })

    it('returns empty array when no albums match year', async () => {
        const res = await request(app).get('/albums/search?year=1900')
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(0)
    })

    it('returns 400 when year is not a number', async () => {
        const res = await request(app).get('/albums/search?year=abc')
        expect(res.status).toBe(400)
    })
})

describe('GET /albums/:id', () => {
    it('returns the album for a valid id', async () => {
        const res = await request(app).get('/albums/1')
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(1)
        expect(res.body.title).toBe('You, Me and an App Id')
    })

    it('returns 404 for a non-existent id', async () => {
        const res = await request(app).get('/albums/9999')
        expect(res.status).toBe(404)
    })

    it('returns 400 for a non-numeric id', async () => {
        const res = await request(app).get('/albums/abc')
        expect(res.status).toBe(400)
    })
})

describe('POST /albums', () => {
    const newAlbum = {
        title: 'Test Album',
        artist: { name: 'Test Artist', birthdate: '2000-01-01', birthPlace: 'Testville' },
        price: 9.99,
        image_url: 'https://example.com/cover.png',
        year: 2025,
    }

    it('creates a new album and returns 201 with the album', async () => {
        const res = await request(app).post('/albums').send(newAlbum)
        expect(res.status).toBe(201)
        expect(res.body.id).toBe(7)
        expect(res.body.title).toBe('Test Album')
    })

    it('includes a Location header pointing to the new resource', async () => {
        const res = await request(app).post('/albums').send(newAlbum)
        expect(res.headers['location']).toBe('/albums/7')
    })

    it('persists the new album so it appears in GET /albums', async () => {
        await request(app).post('/albums').send(newAlbum)
        const res = await request(app).get('/albums')
        expect(res.body).toHaveLength(7)
    })

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app).post('/albums').send({ title: 'Incomplete' })
        expect(res.status).toBe(400)
    })
})

describe('PUT /albums/:id', () => {
    const updatePayload = {
        title: 'Updated Title',
        artist: { name: 'New Artist', birthdate: '1995-06-15', birthPlace: 'Updatetown' },
        price: 19.99,
        image_url: 'https://example.com/new.png',
        year: 2026,
    }

    it('updates an existing album and returns it', async () => {
        const res = await request(app).put('/albums/1').send(updatePayload)
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(1)
        expect(res.body.title).toBe('Updated Title')
        expect(res.body.price).toBe(19.99)
    })

    it('returns 404 for a non-existent id', async () => {
        const res = await request(app).put('/albums/9999').send(updatePayload)
        expect(res.status).toBe(404)
    })

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app).put('/albums/1').send({ title: 'Only title' })
        expect(res.status).toBe(400)
    })
})

describe('DELETE /albums/:id', () => {
    it('deletes an existing album and returns 204', async () => {
        const res = await request(app).delete('/albums/1')
        expect(res.status).toBe(204)
    })

    it('album is gone after deletion', async () => {
        await request(app).delete('/albums/1')
        const res = await request(app).get('/albums/1')
        expect(res.status).toBe(404)
    })

    it('returns 404 for a non-existent id', async () => {
        const res = await request(app).delete('/albums/9999')
        expect(res.status).toBe(404)
    })
})
