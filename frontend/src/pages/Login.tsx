import { type FormEvent, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import type { UserData, LoginResponse } from "../types/auth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data: LoginResponse = await response.json()

      if (!response.ok) {
        setError(data.message ?? "Unable to log in. Please check your details.")
        return
      }

      const user: UserData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }
      login(user)
      navigate("/")
    } catch (error) {
      console.error(error)
      setError("Unable to connect to the server. Please try again shortly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-[30px] flex min-h-[70vh] w-full max-w-md items-center px-6 py-12">
      <section className="w-full rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
        <p className="font-['Cinzel_Decorative'] text-xl font-bold tracking-wide text-amber-800">Libas</p>
        <h1 className="mt-4 font-['Frank_Ruhl_Libre'] text-3xl font-semibold text-stone-900">Welcome back</h1>
        <p className="mt-2 text-sm text-stone-600">Log in to continue your Libas shopping journey.</p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-stone-700" htmlFor="email">
            Email address
            <input
              className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700" htmlFor="password">
            Password
            <input
              className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}

          <button
            className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          New to Libas? <Link className="font-semibold text-amber-800 hover:underline" to="/register">Create an account</Link>
        </p>
      </section>
    </div>
  )
}

export default Login
