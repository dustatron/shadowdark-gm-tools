import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { AlertCircle, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/test-shadcn')({
  component: TestShadcn,
})

function TestShadcn() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">shadcn/ui Test Page</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Welcome to shadcn/ui!</AlertTitle>
        <AlertDescription>
          This page demonstrates the shadcn/ui components integrated with
          Tailwind v4 and React 19.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Component Testing</CardTitle>
          <CardDescription>
            Verify all shadcn/ui components render correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-2">
            <h3 className="font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-2">
            <h3 className="font-semibold">Button Sizes</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <AlertCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-2">
            <h3 className="font-semibold">Input</h3>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="test">Test Input</Label>
              <Input id="test" placeholder="Type something..." />
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <h3 className="font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Dialog */}
          <div className="space-y-2">
            <h3 className="font-semibold">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Example</DialogTitle>
                  <DialogDescription>
                    This is a shadcn/ui dialog component. It&apos;s built with
                    Radix UI and styled with Tailwind CSS.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Table Example */}
      <Card>
        <CardHeader>
          <CardTitle>Table Component</CardTitle>
          <CardDescription>
            Example table showing character data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">HP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Thorin</TableCell>
                <TableCell>Fighter</TableCell>
                <TableCell>5</TableCell>
                <TableCell className="text-right">45</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Elara</TableCell>
                <TableCell>Wizard</TableCell>
                <TableCell>4</TableCell>
                <TableCell className="text-right">28</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grim</TableCell>
                <TableCell>Rogue</TableCell>
                <TableCell>5</TableCell>
                <TableCell className="text-right">38</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Variants</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is a default alert with informational content.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            This is a destructive alert for errors or warnings.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
