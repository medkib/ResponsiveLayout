import { Sidebar } from "@/components/layout/sidebar";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { TrackingMap } from "@/components/dashboard/tracking-map";
import { Analytics } from "@/components/dashboard/analytics";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@shared/schema";

export default function Dashboard() {
  const { data: shipments, isLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
  });

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
