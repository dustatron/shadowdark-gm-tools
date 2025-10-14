import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favorites/')({
  component: FavoritesPage,
})

function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Favorites</h1>
      <p className="text-gray-600">
        Your favorite monsters and spells will appear here...
      </p>
    </div>
  )
}
