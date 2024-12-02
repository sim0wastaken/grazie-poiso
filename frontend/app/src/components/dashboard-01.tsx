import { Link } from "react-router-dom"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Linechart } from '@/components/line-chart-mock'
import { Radialchart } from '@/components/radial-chart-mock'
import { Radialchart2 } from '@/components/radial-chart-mock-2'

export default function Dashboard() {
  return (
    <div className="flex w-full min-h-max flex-col text-center">
      <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="A card showing the total revenue in USD and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Ritorno Investimento
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="A card showing the total subscriptions and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Studenti
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="A card showing the total sales and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Assessment Completati</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="A card showing the total active users and the percentage difference from last hour.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Attivi Ora</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2"
            x-chunk="A card showing a table of recent transactions with a link to view all transactions."
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Riepilogo</CardTitle>
                <CardDescription>
                  Come sta andando?
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="/">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Linechart />
            </CardContent>
          </Card>
          <Card x-chunk="A card showing a list of recent sales with customer names and email addresses.">
            <CardHeader>
              <CardTitle>Performance Studenti</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div>
                <Radialchart />
              </div>
              <div>
                <Radialchart2 />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
