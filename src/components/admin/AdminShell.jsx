import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Tags, Settings, Palette, SlidersHorizontal, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { logoutAdmin, getAdminSession } from '../../services/auth'
import Button from '../common/Button'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/features', label: 'Features', icon: SlidersHorizontal },
  { to: '/admin/theme', label: 'Theme & Colors', icon: Palette }
]

export default function AdminShell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const session = getAdminSession()
  const linkClass = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 ease-in-out'
  const linkStyle = (isActive) => ({
    backgroundColor: isActive ? 'var(--clr-admin-sidebar-active-bg)' : 'transparent',
    color: isActive ? 'var(--clr-admin-sidebar-active-text)' : 'var(--clr-admin-sidebar-text)',
    fontFamily: 'var(--font-nav)'
  })

  const doLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
      <aside className="rounded-3xl border p-4 shadow-soft" style={{ backgroundColor: 'var(--clr-admin-sidebar-bg)', borderColor: 'var(--clr-admin-sidebar-border)' }}>
        <div className="flex items-center justify-between md:block">
          <div>
            <div className="font-display text-3xl font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>Admin</div>
            <div className="text-xs" style={{ color: 'var(--clr-admin-sidebar-text)' }}>{session?.username}</div>
          </div>
          <button className="rounded-2xl border p-2 md:hidden" style={{ borderColor: 'var(--clr-admin-sidebar-border)', color: 'var(--clr-admin-sidebar-text)' }} onClick={() => setOpen((v) => !v)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className={`mt-4 space-y-2 ${open ? 'block' : 'hidden'} md:block`}>
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} className={linkClass} style={({ isActive }) => linkStyle(isActive)}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
          <Button variant="secondary" onClick={doLogout} className="mt-4 w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
