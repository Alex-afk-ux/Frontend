import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/products', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('bad response')
        return res.json()
      })
      .then((json) => {
        setProducts(json.data)
        setStatus('ok')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error')
      })
    return () => controller.abort()
  }, [])

  // Categorías que realmente tienen productos (para los botones de filtro)
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category?.name).filter(Boolean))],
    [products]
  )
  const visible = filter === 'all' ? products : products.filter((p) => p.category?.name === filter)

  return (
    <section id="catalogo" className="catalog">
      <div className="catalog-head">
        <h2>Nuestro catálogo</h2>
        <p>Todo lo que tu pez necesita para los días de lluvia (y de sol).</p>
      </div>

      {status === 'ok' && categories.length > 1 && (
        <div className="chips" role="group" aria-label="Filtrar por categoría">
          {['all', ...categories].map((name) => (
            <button
              key={name}
              type="button"
              className={`chip ${filter === name ? 'active' : ''}`}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name === 'all' ? 'Todo' : name}
            </button>
          ))}
        </div>
      )}

      {status === 'loading' && (
        <div className="product-grid" aria-busy="true">
          {[0, 1, 2].map((i) => <div key={i} className="product-card skeleton" />)}
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger" role="alert">
          No se han podido cargar los productos. Comprueba que el backend está en marcha
          (<code>npm run dev</code>) y que la base de datos tiene datos (<code>npm run seed</code>).
        </div>
      )}

      {status === 'ok' && visible.length === 0 && (
        <p className="catalog-empty">Todavía no hay productos. Ejecuta <code>npm run seed</code> en el backend.</p>
      )}

      {status === 'ok' && visible.length > 0 && (
        <div className="product-grid">
          {visible.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  )
}
