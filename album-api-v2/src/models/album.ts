export interface Artist {
  name: string
  birthdate: string
  birthPlace: string
}

export interface Album {
  id: number
  title: string
  artist: Artist
  price: number
  image_url: string
  year: number
}

export type AlbumRequest = Omit<Album, 'id'>

const albums: Album[] = [
  {
    id: 1,
    title: 'You, Me and an App Id',
    artist: { name: 'Daprize', birthdate: '1991-05-17', birthPlace: 'Seattle, USA' },
    price: 10.99,
    image_url: 'https://aka.ms/albums-daprlogo',
    year: 2019,
  },
  {
    id: 2,
    title: 'Seven Revision Army',
    artist: { name: 'The Blue-Green Stripes', birthdate: '1988-10-02', birthPlace: 'London, UK' },
    price: 13.99,
    image_url: 'https://aka.ms/albums-containerappslogo',
    year: 2020,
  },
  {
    id: 3,
    title: 'Scale It Up',
    artist: { name: 'KEDA Club', birthdate: '1993-03-24', birthPlace: 'Austin, USA' },
    price: 13.99,
    image_url: 'https://aka.ms/albums-kedalogo',
    year: 2021,
  },
  {
    id: 4,
    title: 'Lost in Translation',
    artist: { name: 'MegaDNS', birthdate: '1989-07-09', birthPlace: 'Toronto, Canada' },
    price: 12.99,
    image_url: 'https://aka.ms/albums-envoylogo',
    year: 2022,
  },
  {
    id: 5,
    title: 'Lock Down Your Love',
    artist: { name: 'V is for VNET', birthdate: '1990-12-12', birthPlace: 'Dublin, Ireland' },
    price: 12.99,
    image_url: 'https://aka.ms/albums-vnetlogo',
    year: 2023,
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: { name: 'Guns N Probeses', birthdate: '1987-01-30', birthPlace: 'Berlin, Germany' },
    price: 14.99,
    image_url: 'https://aka.ms/albums-containerappslogo',
    year: 2024,
  },
]

const seedData: Album[] = JSON.parse(JSON.stringify(albums)) as Album[]

export function reset(): void {
  albums.length = 0
  albums.push(...(JSON.parse(JSON.stringify(seedData)) as Album[]))
}

export function getAll(): Album[] {
  return [...albums]
}

export function getById(id: number): Album | undefined {
  return albums.find((a) => a.id === id)
}

export function getByYear(year: number): Album[] {
  return albums.filter((a) => a.year === year)
}

export function create(data: AlbumRequest): Album {
  const nextId = albums.length === 0 ? 1 : Math.max(...albums.map((a) => a.id)) + 1
  const album: Album = { id: nextId, ...data }
  albums.push(album)
  return album
}

export function update(id: number, data: AlbumRequest): Album | undefined {
  const index = albums.findIndex((a) => a.id === id)
  if (index === -1) return undefined
  const updated: Album = { id, ...data }
  albums[index] = updated
  return updated
}

export function remove(id: number): boolean {
  const index = albums.findIndex((a) => a.id === id)
  if (index === -1) return false
  albums.splice(index, 1)
  return true
}
