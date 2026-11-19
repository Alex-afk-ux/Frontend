import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import Splash from '../components/Splash.jsx'
import { SWATCH, euro, imageOf, stockInfo, styleOf } from '../lib/products.js'

// El "key" reinicia el estado al cambiar de producto (p. ej. al pulsar un producto relacionado)
export default function ProductDetail() {
  const { id } = useParams()
  return <ProductDetailView key={id} id={id} />
}

function ProductDetailView({ id }) {
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | notfound | error
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    window.scrollTo(0, 0)

    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`, { signal })
        // 404 = no existe; 400 = id con formato inválido
        if (res.status === 404 || res.status === 400) return setStatus('notfound')
        if (!res.ok) return setStatus('error')
        const { data } = await res.json()
        setProduct(data)
        setStatus('ok')

        // Productos relacionados: misma categoría, sin contar el actual
        const listRes = await fetch('/api/products', { signal })
        if (listRes.ok) {
          const list = (await listRes.json()).data
          setRelated(
            list.filter((p) => p._id !== data._id && p.category?._id && p.category._id === data.category?._id).slice(0, 3)
          )
        }
      } catch (err) {
        if (err.name !== 'AbortError') setStatus('error')
      }
    }
    load()
    return () => controller.abort()
  }, [id])

  if (status === 'loading') {
    return <div className="container"><p className="catalog-empty" aria-busy="true">Cargando producto…</p></div>
  }

  if (status !== 'ok') {
    return (
      <div className="container text-center">
        <h2>{status === 'notfound' ? 'Producto no encontrado 🐟' : 'No se ha podido cargar el producto'}</h2>
        <p className="catalog-empty">
          {status === 'notfound' ? 'Puede que ya no esté en el catálogo.' : 'Comprueba que el backend está en marcha.'}
        </p>
        <Link to="/" className="btn btn-primary px-4 mt-3">Volver al catálogo</Link>
      </div>
    )
  }

  const { emoji, hue } = styleOf(product)
  const stock = stockInfo(product.stock)
  const imageSrc = imageOf(product)

  return (
    <div className="container">
      <Link to="/" className="detail-back">← Volver al catálogo</Link>

      <div className="detail">
        <div className="detail-art" style={{ '--hue': hue }}>
          {imageSrc && !imgFailed ? (
            <img src={imageSrc} alt={product.name} onError={() => setImgFailed(true)} />
          ) : (
            <span className="detail-emoji" aria-hidden="true">{emoji}</span>
          )}
          <Splash />
        </div>

        <section className="detail-info">
          {product.category?.name && <span className="product-category" style={{ '--hue': hue }}>{product.category.name}</span>}
          <h1>{product.name}</h1>
          {product.description && <p className="detail-desc">{product.description}</p>}

          <dl className="specs">
            {product.targetSpecies && (<><dt>Especie</dt><dd>🐟 {product.targetSpecies}</dd></>)}
            {product.size && (<><dt>Talla</dt><dd>{product.size}</dd></>)}
            {product.color && (
              <>
                <dt>Color</dt>
                <dd>
                  <i className="swatch" style={{ background: SWATCH[product.color.toLowerCase()] || '#94a3b8' }} />
                  {product.color}
                </dd>
              </>
            )}
            <dt>Disponibilidad</dt>
            <dd><span className={`stock ${stock.className}`}>{stock.text}</span></dd>
          </dl>

          <div className="detail-buy">
            <span className="detail-price">{euro.format(product.price)}</span>
            <button type="button" className="btn btn-primary px-4" disabled>Añadir al carrito</button>
          </div>
          <p className="detail-note">El carrito estará disponible próximamente.</p>
        </section>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>Más de {product.category.name}</h2>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
