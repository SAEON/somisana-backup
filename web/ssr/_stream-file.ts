import { open, stat } from 'fs/promises'
import { createHash } from 'crypto'
import mime from 'mime'

const noCache = ['css', 'js']

export default async (ctx: any, contentType: string, filePath: string) => {
  let fd: any
  let fileStats: any
  try {
    fd = await open(filePath)
    fileStats = await stat(filePath)
  } catch (error) {
    ctx.status = 404
    return
  }

  const hash = createHash('sha256')
  hash.update(fileStats.mtime.toISOString())
  const etag = hash.digest('hex')

  if (ctx.headers['if-none-match'] === etag) {
    ctx.status = 304
    return
  }

  const fileExtension = mime.getExtension(contentType)

  if (noCache.includes(fileExtension)) {
    ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    ctx.set('Pragma', 'no-cache') // for HTTP/1.0 compatibility
    ctx.set('Expires', '0') // for Proxies
  } else {
    ctx.set('Cache-Control', 'public, max-age=86400') // cache for 1 day for other types
  }

  ctx.set('ETag', etag)
  ctx.set('Content-type', contentType)
  ctx.body = fd.createReadStream()
}
