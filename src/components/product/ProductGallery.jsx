import { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import Button from '../common/Button'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'

export default function ProductGallery({ images = [] }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const { isEnabled: zoomOn } = useFeatureFlag('photo_zoom')
  const img = images[index] || images[0] || ''
  return (
    <div>
      <div className="overflow-hidden rounded-3xl" style={{ backgroundColor: 'var(--clr-product-card-img-bg)' }}>
        <img src={img} alt="" className={`h-[28rem] w-full object-cover transition duration-500 ${zoom && zoomOn ? 'scale-125' : 'scale-100'}`} onClick={() => zoomOn && setZoom((v) => !v)} style={{ cursor: zoomOn ? 'zoom-in' : 'default' }} />
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {images.map((image, i) => (
          <button
            key={image + i}
            onClick={() => setIndex(i)}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition duration-300 ease-in-out"
            style={{ borderColor: i === index ? 'var(--clr-footer-icon)' : 'var(--clr-product-card-border)' }}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {zoomOn ? (
        <div className="mt-3">
          <Button variant="secondary" onClick={() => setZoom((v) => !v)} className="gap-2">
            {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            {zoom ? 'Zoom out' : 'Zoom in'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
