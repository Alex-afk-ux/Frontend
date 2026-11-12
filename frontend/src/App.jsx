import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <NavLink className="navbar-brand" to="/">Xubasquers</NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink className="nav-link" to="/">Inicio</NavLink>
          <NavLink className="nav-link" to="/login">Login</NavLink>
          <NavLink className="nav-link" to="/register">Registro</NavLink>
        </div>
      </nav>
      <main className="container py-5">
        <Outlet />
      </main>
    </>
  )
}