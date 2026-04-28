import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="text-center space-y-6">
        <div className="text-8xl">😵</div>
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600">Oops! The page you're looking for doesn't exist.</p>
        <Link
          className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
          to="/vacancies"
        >
          🏠 Go to Vacancies
        </Link>
      </div>
    </div>
  )
}
