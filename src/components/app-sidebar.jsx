import * as React from "react";
import {
  ArchiveRestore,
  CircleHelp,
  HandCoins,
  MapPinCheckInside,
  PackageCheck,
  ScrollText,
  User2Icon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Config } from "@/lib/Config";

export function AppSidebar({ ...props }) {
  const [userDetails, setUserDetails] = React.useState(() => {
    const data = localStorage.getItem("UserDetails");
    return data ? JSON.parse(data) : null;
  });

  // Optional: Automatically re-check for updates in localStorage every few seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem("UserDetails"));
      setUserDetails((prev) =>
        JSON.stringify(prev) !== JSON.stringify(data) ? data : prev
      );
    }, 1000); // Check every 1 second

    return () => clearInterval(interval);
  }, []);

  const initials = userDetails
    ? `${userDetails?.firstname[0] ?? ""}${userDetails?.lastname[0] ?? ""}`.toUpperCase()
    : "";

  const data = {
    user: {
      name: userDetails?.firstname,
      lastname: userDetails?.lastname,
      email: userDetails?.email,
      avatar: `${Config.API_URL}${userDetails?.image}`,
      initials: initials,
    },
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
      { title: "User", url: "/user", icon: User2Icon },
      { title: "Services", url: "/services", icon: ArchiveRestore },
      { title: "Zip Code", url: "/pincode", icon: MapPinCheckInside },
      { title: "Privacy Policy", url: "/privacy-policy", icon: ScrollText },
      { title: "Booking", url: "/booking", icon: PackageCheck },
      { title: "Payment", url: "/payment", icon: HandCoins },
      { title: "Support", url: "/support", icon: CircleHelp },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
