const PAGE_PREFIX = 'agadir-page-'
const DRAFTS_KEY = 'agadir-drafts'

export function getPageOverride(pageId) {
  try {
    const raw = localStorage.getItem(`${PAGE_PREFIX}${pageId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setPageOverride(pageId, blocks) {
  localStorage.setItem(`${PAGE_PREFIX}${pageId}`, JSON.stringify(blocks))
}

export function clearPageOverride(pageId) {
  localStorage.removeItem(`${PAGE_PREFIX}${pageId}`)
}

export function hasPageOverride(pageId) {
  return localStorage.getItem(`${PAGE_PREFIX}${pageId}`) !== null
}

export function getDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveDrafts(drafts) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function createDraftId() {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
