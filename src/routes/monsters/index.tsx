import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monsters/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/monsters/"!</div>
}
