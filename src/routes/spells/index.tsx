import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spells/')({
  component: SpellsPage,
})

function SpellsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Spells</h1>
      <p className="text-gray-600">Spell database coming soon...</p>
    </div>
  )
}
