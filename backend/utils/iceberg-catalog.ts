export type IcebergCatalogInfo = {
  hasIcebergCatalog: boolean
  catalogUri?: string
  warehouseName?: string
  isCompressionEnabled?: boolean
  targetFileSizeMB?: number
}

/**
 * Get Iceberg catalog info from bucket config
 * @param endpointUrl The bucket's endpoint URL
 * @param bucketName The bucket name
 * @returns Iceberg catalog info
 */
export const getIcebergCatalogInfo = (
  endpointUrl: string,
  bucketName: string
): IcebergCatalogInfo => {
  try {
    const url = new URL(endpointUrl)
    const hostname = url.hostname

    // Check if this is a Cloudflare R2 endpoint
    // R2 endpoints look like: <account-id>.r2.cloudflarestorage.com
    const r2Match = hostname.match(/^([a-f0-9]+)\.r2\.cloudflarestorage\.com$/i)

    if (r2Match) {
      const accountId = r2Match[1]
      const catalogUri = `https://catalog.cloudflarestorage.com/${accountId}/${bucketName}`
      const warehouseName = `${accountId}_${bucketName}`

      return {
        hasIcebergCatalog: true,
        catalogUri,
        warehouseName,
        isCompressionEnabled: true, // Default from Cloudflare's info
        targetFileSizeMB: 128, // Default from Cloudflare's info
      }
    }

    // Not a Cloudflare R2 bucket
    return {
      hasIcebergCatalog: false,
    }
  } catch {
    // Invalid URL, return no catalog info
    return {
      hasIcebergCatalog: false,
    }
  }
}
