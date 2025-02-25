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
      <CardHeader>
        <CardTitle>Live Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full bg-accent/10 rounded-lg flex items-center justify-center">
          Map visualization would go here
        </div>
      </CardContent>
    </Card>
  );
}
