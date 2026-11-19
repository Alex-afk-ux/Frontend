import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const json = await res.json()
      if (!res.ok) {
        // El backend devuelve qué campos fallan: los mostramos (p. ej. "Contraseña: ...")
        const labels = { name: 'Nombre', email: 'Email', password: 'Contraseña' }
        const details = json.error?.details?.map(d => `${labels[d.field] || d.field}: ${d.message}`)
        throw new Error(details?.length ? details.join(' · ') : json.error?.message || json.message || 'No se pudo registrar')
      }
      localStorage.setItem('accessToken', json.data.accessToken)
      localStorage.setItem('refreshToken', json.data.refreshToken)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5 col-xl-4">
          <div className="auth-card">
            <h2>Crea tu cuenta</h2>
            <p className="subtitle">Solo te llevará un minuto</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input id="name" type="text" className="form-control"
                  placeholder="Tu nombre" value={name} minLength={2}
                  onChange={e => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" type="email" className="form-control"
                  placeholder="tu@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input id="password" type="password" className="form-control"
                  placeholder="Mínimo 12 caracteres" value={password} minLength={12}
                  onChange={e => setPassword(e.target.value)} required />
                <div className="form-text" style={{ color: 'var(--muted)' }}>Mínimo 12 caracteres.</div>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
              </button>
            </form>

            <p className="text-center mt-4 mb-0" style={{ color: 'var(--muted)' }}>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}