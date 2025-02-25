import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shipment } from "@shared/schema";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";

interface AnalyticsProps {
  shipments: Shipment[];
  isLoading: boolean;
}

export function Analytics({ shipments, isLoading }: AnalyticsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Delivered", value: shipments.filter(s => s.status === "Delivered").length },
    { name: "In Transit", value: shipments.filter(s => s.status === "In Transit").length },
    { name: "Delayed", value: shipments.filter(s => s.status === "Delayed").length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
