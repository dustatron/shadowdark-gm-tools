import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="container mx-auto p-8 flex flex-col gap-16 items-center text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold">Shadowdark GM Toolkit</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A one-stop resource for Game Masters running Shadowdark campaigns.
          Easily reference monsters and spells, create and save encounter
          tables, and manage your favorites.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link to="/monsters" className="no-underline">
          <Card className="h-full hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Monsters</CardTitle>
              <CardDescription>
                Browse and search the bestiary of creatures from the Shadowdark
                core rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>View stats, abilities, and lore for all monsters.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/spells" className="no-underline">
          <Card className="h-full hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>Spells</CardTitle>
              <CardDescription>
                A complete grimoire of spells available to player characters and
                casters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Quickly reference spell details, including range, duration, and
                effects.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  )
}
