import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Layers3, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/login', {
        state: { message: 'Account created. Please sign in.' },
      })
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Registration failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-slate-900">
          <Layers3 className="text-indigo-600" />
          Triage<span className="text-indigo-600">Sync</span>
        </Link>

        <form onSubmit={handleSubmit} className="surface p-8 shadow-sm sm:p-9">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Get started with your TriageSync workspace.
          </p>

          {error && (
            <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label htmlFor="name" className="mt-7 block text-sm font-semibold text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={50}
            required
            value={form.name}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="Your name"
          />

          <label htmlFor="email" className="mt-5 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={form.email}
            onChange={handleChange}
            className="input-field mt-2"
            placeholder="you@example.com"
          />

          <label htmlFor="password" className="mt-5 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="password-control mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              maxLength={64}
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="At least 8 characters"
            />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Use at least 8 characters, including a letter and a number.
          </p>

          <button type="submit" disabled={loading} className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </form>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </div>
    </main>
  )
}
