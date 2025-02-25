import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Package, Truck, Building2, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const sidebarItems = [
  { icon: Package, label: "Dashboard", href: "/" },
  { icon: Truck, label: "Shipments", href: "/shipments" },
  { icon: Building2, label: "Facilities", href: "/facilities" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <div className="h-screen border-r flex flex-col bg-sidebar">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground">LogiTrack</h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3",
                  location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={() => setLocation(item.href)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-6 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.username}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
