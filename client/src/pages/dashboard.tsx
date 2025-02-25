import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { TrackingMap } from "@/components/dashboard/tracking-map";
import { Button } from "@/components/ui/button";
import { Package, Clock, DollarSign, Receipt, Plus, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TrackingMap shipments={shipments || []} isLoading={isLoading} />
            <NotificationCard />
          </div>

          <ShipmentTable shipments={shipments || []} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}