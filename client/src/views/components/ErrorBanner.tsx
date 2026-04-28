export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center space-x-3 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 shadow-lg">
        <span className="text-2xl">⚠️</span>
        <span className="text-lg font-medium text-red-700">{message}</span>
      </div>
    </div>
  )
}
