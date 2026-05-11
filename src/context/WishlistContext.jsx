import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(ls.get(DEMO_KEYS.wishlist, []))

  useEffect(() => {
    ls.set(DEMO_KEYS.wishlist, items)
  }, [items])

  const add = (id) => setItems((prev) => prev.includes(id) ? prev : [id, ...prev])
  const remove = (id) => setItems((prev) => prev.filter((x) => x !== id))
  const toggle = (id) => setItems((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])
  const has = (id) => items.includes(id)
  const clear = () => setItems([])

  const value = useMemo(() => ({ items, add, remove, toggle, has, clear }), [items])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
