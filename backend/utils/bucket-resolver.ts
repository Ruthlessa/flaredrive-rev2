import { eq } from 'drizzle-orm'
import { buckets as bucketsTable } from '../../db/schema.js'
import { getDb } from './db.js'
import { cacheGetJson, cachePutJson, cacheDelete } from './cache.js'

const BUCKET_CONFIG_CACHE_KEY = (id: string) => `v1:bucket:config:${id}`
const BUCKET_CONFIG_TTL_SECONDS = 300

export const getBucketConfigById = async (ctx: any, id: string) => {
  const cached = await cacheGetJson<any>(ctx, BUCKET_CONFIG_CACHE_KEY(id))
  if (cached) {
    return cached
  }

  const db = getDb(ctx)
  const row = await db
    .select({
      id: bucketsTable.id,
      ownerUserId: bucketsTable.ownerUserId,
      endpointUrl: bucketsTable.endpointUrl,
      region: bucketsTable.region,
      accessKeyId: bucketsTable.accessKeyId,
      secretAccessKey: bucketsTable.secretAccessKey,
      bucketName: bucketsTable.bucketName,
      forcePathStyle: bucketsTable.forcePathStyle,
      uploadMethod: bucketsTable.uploadMethod,
      cdnBaseUrl: bucketsTable.cdnBaseUrl,
    })
    .from(bucketsTable)
    .where(eq(bucketsTable.id, id))
    .get()

  const result = row || null
  if (result) {
    await cachePutJson(ctx, BUCKET_CONFIG_CACHE_KEY(id), result, {
      ttlSeconds: BUCKET_CONFIG_TTL_SECONDS,
    })
  }
  return result
}

export const invalidateBucketConfigCache = async (ctx: any, id: string) => {
  await cacheDelete(ctx, BUCKET_CONFIG_CACHE_KEY(id))
}

export const parseBucketPath = (reqPath: string, baseSegment: 'bucket' | 'raw') => {
  const fullPath = reqPath.split(`/${baseSegment}/`).slice(1).join(`/${baseSegment}/`)
  const normalizedPath = fullPath || ''
  if (!normalizedPath) {
    return { bucketId: '', path: '' }
  }
  const [bucketId, ...rest] = normalizedPath.split('/')
  return { bucketId: bucketId || '', path: rest.join('/') }
}
