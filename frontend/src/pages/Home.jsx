import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Todo para tus peces 🐠</h1>
        <p>Accesorios, ropa y complementos para que tu mascota acuática vaya a la última.</p>
        <Link to="/login" className="btn btn-primary mt-4 px-4">Iniciar sesión</Link>
      </div>
    </div>
  )
}