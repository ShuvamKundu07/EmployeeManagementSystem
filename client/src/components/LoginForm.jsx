import React, {useState} from 'react'
import LoginLeftSide from '../components/LoginLeftSide'
import { Link }from 'react-router-dom'
import { ArrowLeftIcon, EyeOffIcon, EyeIcon, Loader2Icon} from 'lucide-react'

const LoginForm = ({role, title, subtitle}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Perform login logic here (e.g., API call)
      // For demonstration, we'll just log the email and password
      console.log(`Logging in as ${role}:`, { email, password })
      // Reset form fields after successful login
      setEmail('')
      setPassword('')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">
          <div className="w-full max-w-md animate-fade-in">

            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm transition-colors mb-10">
              <ArrowLeftIcon size={16} /> Back to portals
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">{title}</h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2">{subtitle}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"/>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading && <Loader2Icon className="animate-spin mr-2 inline-block" size={16} />}
                Sign In
              </button>
            </form>

          </div>
      </div>
      
    </div>
  )
}

export default LoginForm
