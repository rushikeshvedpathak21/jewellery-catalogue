import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { loginAdmin } from '../../services/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('jewels123')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const res = loginAdmin(username, password)
    if (res.ok) navigate('/admin')
    else setError(res.message)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-110px)] max-w-md items-center px-4 py-8">
      <form onSubmit={submit} className="w-full rounded-3xl border p-6 shadow-soft" style={{ backgroundColor: 'var(--clr-page-bg)', borderColor: 'var(--clr-input-border)' }}>
        <h1 className="font-display text-4xl font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>Admin Login</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--clr-footer-text)' }}>Enter your credentials to access the dashboard.</p>
        <div className="mt-6 space-y-4">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <div className="relative">
            <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-3 flex items-center" style={{ color: 'var(--clr-footer-text)' }}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        </div>
        <Button type="submit" className="mt-6 w-full">Login</Button>
      </form>
    </div>
  )
}
