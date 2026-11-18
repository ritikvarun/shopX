let sequence = 0

export function createContentItem() {
    // randomUUID is unavailable on some browsers and plain HTTP/LAN origins.
    const id = typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `content-${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.random().toString(36).slice(2)}`

    return { id, title: '', image: '', productIds: [], layout: 'grid' }
}
