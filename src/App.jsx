import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './i18n'
import Navbar from './components/layout/Navbar'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import { LanguageProvider } from './context/LanguageContext'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { FeatureFlagProvider, useFeatureFlags } from './context/FeatureFlagContext'
import { CatalogProvider, useCatalog } from './context/CatalogContext'
import { WishlistProvider } from './context/WishlistContext'
import { initDemoData } from './lib/demoSeed'
import { getAdminSession } from './services/auth'
import HomePage from './pages/public/HomePage'
import CataloguePage from './pages/public/CataloguePage'
import SearchPage from './pages/public/SearchPage'
import CategoryPage from './pages/public/CategoryPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import WishlistPage from './pages/public/WishlistPage'
import NewArrivalsPage from './pages/public/NewArrivalsPage'
import LoginPage from './pages/admin/LoginPage'
import AdminShell from './components/admin/AdminShell'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsPage from './pages/admin/ProductsPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import SettingsPage from './pages/admin/SettingsPage'
import FeaturesPage from './pages/admin/FeaturesPage'
import ThemePage from './pages/admin/ThemePage'

// ─── Loading Gate ─────────────────────────────────────────────────────────────
// Sits inside all providers. Shows a branded splash until every context
// has finished its first Supabase fetch — prevents any seed-data flash.
function LoadingGate({ children }) {
  const { loading: settingsLoading } = useSettings()
  const { loading: catalogLoading } = useCatalog()
  const { loading: flagsLoading } = useFeatureFlags()

  const isLoading = settingsLoading || catalogLoading || flagsLoading

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdf8f0',
          gap: '1.5rem',
        }}
      >
        {/* Animated diamond spinner */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #f0e6c8',
            borderTopColor: '#c9a84c',
            animation: 'spin 0.9s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: 10,
            borderRadius: '50%',
            border: '2px solid #f0e6c8',
            borderBottomColor: '#c9a84c',
            animation: 'spin 1.4s linear infinite reverse',
          }} />
          <div style={{
            position: 'absolute',
            inset: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#c9a84c',
          }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.5rem',
            color: '#7a5c1e',
            letterSpacing: '0.05em',
          }}>
            Loading…
          </div>
          <div style={{
            marginTop: '0.25rem',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#b8976a',
          }}>
            Luxury Catalogue
          </div>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  return children
}

// ─── Providers ────────────────────────────────────────────────────────────────
function AppProviders({ children }) {
  useEffect(() => { initDemoData() }, [])

  return (
    <LanguageProvider>
      <SettingsProvider>
        <FeatureFlagProvider>
          <CatalogProvider>
            <WishlistProvider>
              {/* LoadingGate is INSIDE all providers so it can read their loading state */}
              <LoadingGate>
                {children}
              </LoadingGate>
            </WishlistProvider>
          </CatalogProvider>
        </FeatureFlagProvider>
      </SettingsProvider>
    </LanguageProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

function ProtectedRoute({ children }) {
  return getAdminSession() ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/catalogue" element={<PublicLayout><CataloguePage /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
        <Route path="/category/:id" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />
        <Route path="/new-arrivals" element={<PublicLayout><NewArrivalsPage /></PublicLayout>} />
        <Route path="/admin/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/admin" element={<ProtectedRoute><AdminShell /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="theme" element={<ThemePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  )
}
