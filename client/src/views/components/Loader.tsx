export function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2 rounded-lg bg-white px-6 py-4 shadow-lg">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        <span className="text-lg font-medium text-slate-600">Loading...</span>
      </div>
    </div>
  )
}
