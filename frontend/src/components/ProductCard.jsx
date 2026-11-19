import { useState } from 'react'
import { Link } from 'react-router-dom'
import Splash from './Splash.jsx'
import { SWATCH, euro, imageOf, stockInfo, styleOf } from '../lib/products.js'

// Tarjeta del catálogo: al pasar el ratón salpica agua, y al hacer clic abre la página del producto
export default function ProductCard({ product }) {
  const { emoji, hue } = styleOf(product)
  const stock = stockInfo(product.stock)
  const imageSrc = imageOf(product)
  const [imgFailed, setImgFailed] = useState(false) // si la imagen no carga, se muestra el emoji

  return (
    <Link to={`/producto/${product._id}`} className="product-link">
      <article className={`product-card ${product.stock <= 0 ? 'is-soldout' : ''}`} style={{ '--hue': hue }}>
        <div className="product-art">
          {imageSrc && !imgFailed ? (
            <img src={imageSrc} alt={product.name} loading="lazy" onError={() => setImgFailed(true)} />
          ) : (
            <span aria-hidden="true">{emoji}</span>
          )}
          <Splash />
        </div>
        <div className="product-body">
          {product.category?.name && <span className="product-category">{product.category.name}</span>}
          <h3>{product.name}</h3>
          {product.description && <p className="product-desc">{product.description}</p>}

          <div className="product-tags">
            {product.targetSpecies && <span className="tag">🐟 {product.targetSpecies}</span>}
            {product.size && <span className="tag">Talla {product.size}</span>}
            {product.color && (
              <span className="tag">
                <i className="swatch" style={{ background: SWATCH[product.color.toLowerCase()] || '#94a3b8' }} />
                {product.color}
              </span>
            )}
          </div>

          <div className="product-footer">
            <span className="product-price">{euro.format(product.price)}</span>
            <span className={`stock ${stock.className}`}>{stock.text}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
