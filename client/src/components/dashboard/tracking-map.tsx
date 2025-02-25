import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shipment } from "@shared/schema";

interface TrackingMapProps {
  shipments: Shipment[];
  isLoading: boolean;
}

export function TrackingMap({ shipments, isLoading }: TrackingMapProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Live Tracking</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span>In Transit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive"></span>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted"></span>
            <span>Delivered</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full bg-accent/10 rounded-lg flex items-center justify-center">
          {/* Map visualization placeholder */}
          <div className="text-center text-muted-foreground">
            <p>Interactive tracking map will be implemented here</p>
            <p className="text-sm mt-2">
              Currently tracking {shipments.length} shipments:
              <br />
              {shipments.filter(s => s.status === "In Transit").length} In Transit,
              {shipments.filter(s => s.status === "Delayed").length} Delayed,
              {shipments.filter(s => s.status === "Delivered").length} Delivered
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}