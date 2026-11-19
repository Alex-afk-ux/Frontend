import { Link } from 'react-router-dom'
import ProductList from '../components/ProductList.jsx'

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Todo para tus peces 🐠</h1>
        <p>Accesorios, ropa y complementos para que tu mascota acuática vaya a la última.</p>
        <div className="hero-actions">
          <a href="#catalogo" className="btn btn-primary px-4">Ver catálogo</a>
          <Link to="/login" className="btn btn-outline-light px-4">Iniciar sesión</Link>
        </div>
      </div>

      <ProductList />
    </div>
  )
}
