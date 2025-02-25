import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { TrackingMap } from "@/components/dashboard/tracking-map";
import { Analytics } from "@/components/dashboard/analytics";
import { Button } from "@/components/ui/button";
import { Package, Clock, DollarSign, Receipt, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@shared/schema";

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

export default function Dashboard() {
  const { data: shipments, isLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
  });

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
            <h1 className="text-3xl font-bold">Dashboard</h1>
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
            <Analytics shipments={shipments || []} isLoading={isLoading} />
          </div>

          <ShipmentTable shipments={shipments || []} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}