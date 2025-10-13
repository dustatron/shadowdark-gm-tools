import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monsters/')({
  component: MonstersPage,
})

function MonstersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Monsters</h1>
      <p className="text-gray-600">Monster database coming soon...</p>
    </div>
  )
}
