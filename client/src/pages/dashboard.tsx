import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { TrackingMap } from "@/components/dashboard/tracking-map";
import { Button } from "@/components/ui/button";
import { Package, Clock, DollarSign, Receipt, Plus, Bell, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timePeriods = [
  { label: "1D", value: "1d" },
  { label: "7D", value: "7d" },
  { label: "2W", value: "2w" },
  { label: "M1", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "MTD", value: "mtd" },
  { label: "YTD", value: "ytd" },
  { label: "Custom", value: "custom" },
];

const modes = [
  { label: "All Modes", value: "all" },
  { label: "FTL", value: "ftl" },
  { label: "LTL", value: "ltl" },
];

function DashboardCard({
  title,
  value,
  description,
  icon: Icon
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function NotificationCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Recent Notifications</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 pb-4 border-b">
            <span className="h-2 w-2 rounded-full bg-destructive"></span>
            <p className="text-sm">Shipment #SH-2023-002 is experiencing delays due to weather conditions.</p>
          </li>
          <li className="flex items-center gap-3 pb-4 border-b">
            <span className="h-2 w-2 rounded-full bg-warning"></span>
            <p className="text-sm">Invoice #INV-456 is due in 3 days. Please process payment.</p>
          </li>
          <li className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <p className="text-sm">Shipment #SH-2023-003 has been successfully delivered.</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: shipments, isLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
  });
  const { user } = useAuth();

  const activeShipments = shipments?.filter(s => s.status === "In Transit").length || 0;
  const deliveredShipments = shipments?.filter(s => s.status === "Delivered").length || 0;
  const onTimeDelivery = shipments?.length ?
    Math.round((deliveredShipments / shipments.length) * 100) : 0;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-border"></div>
                <div className="text-sm font-medium">
                  Welcome, {user?.username}
                </div>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          </div>

          {/* Live Tracking Map */}
          <TrackingMap shipments={shipments || []} isLoading={isLoading} />

          {/* Time Period Buttons */}
          <div className="inline-flex rounded-md shadow-sm">
            {timePeriods.map((period) => (
              <Button
                key={period.value}
                variant={period.value === "1d" ? "default" : "outline"}
                className="first:rounded-l-md last:rounded-r-md rounded-none border-r-0 last:border-r"
              >
                {period.label}
              </Button>
            ))}
          </div>

          {/* Filter Controls */}
          <div className="flex gap-4 items-center bg-card border rounded-lg p-4">
            <div className="flex-1">
              <Input placeholder="Shipment ID" className="w-full" />
            </div>
            <div className="flex-1">
              <Input placeholder="Origin" className="w-full" />
            </div>
            <div className="flex-1">
              <Input placeholder="Destination" className="w-full" />
            </div>
            <div className="flex-1">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  {modes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Active Shipments"
              value={activeShipments.toString()}
              description={`${activeShipments} deliveries pending today`}
              icon={Package}
            />
            <DashboardCard
              title="On-Time Delivery"
              value={`${onTimeDelivery}%`}
              description="2% increase from last week"
              icon={Clock}
            />
            <DashboardCard
              title="Total Spend"
              value="$24,500"
              description="This month"
              icon={DollarSign}
            />
            <DashboardCard
              title="Pending Payments"
              value="$8,320"
              description="2 invoices due this week"
              icon={Receipt}
            />
          </div>

          {/* Notification Card and Shipment Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NotificationCard />
            <ShipmentTable shipments={shipments || []} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}