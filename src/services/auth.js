import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'

const SESSION_KEY = DEMO_KEYS.adminSession
const USERNAME = 'AdminSatyam'
const PASSWORD = 'AdminSatyam@176084'

export function getAdminSession() {
  return ls.get(SESSION_KEY, null)
}

export function loginAdmin(username, password) {
  if (username === USERNAME && password === PASSWORD) {
    const session = { username: USERNAME, loggedInAt: new Date().toISOString() }
    ls.set(SESSION_KEY, session)
    return { ok: true, session }
  }
  return { ok: false, message: 'Invalid admin credentials.' }
}

export function logoutAdmin() {
  ls.remove(SESSION_KEY)
}
