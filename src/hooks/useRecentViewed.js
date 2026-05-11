import { useEffect, useMemo, useState } from 'react'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'

export function useRecentViewed() {
  const [ids, setIds] = useState(ls.get(DEMO_KEYS.recentlyViewed, []))

  useEffect(() => {
    ls.set(DEMO_KEYS.recentlyViewed, ids)
  }, [ids])

  const add = (id) => setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8))
  const clear = () => setIds([])

  return useMemo(() => ({ ids, add, clear }), [ids])
}
