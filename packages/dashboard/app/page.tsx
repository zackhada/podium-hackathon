import { KPICard } from "@/components/dashboard/kpi-card";
import { PropertyMap } from "@/components/dashboard/property-map";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PageHeader } from "@/components/layout/page-header";
import { DollarSign, Percent, CalendarCheck, AlertTriangle } from "lucide-react";

// ============================================================
// OPENCLAW_HOOK: Live KPI data
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/dashboard/kpis
// Current behavior: Displays hard-coded KPI values
// ============================================================

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Your Honolulu rental portfolio at a glance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Revenue (Mar)"
          value="$28,450"
          icon={DollarSign}
          iconColor="text-success"
          iconBg="bg-success/10"
          trend={{ value: "+12% vs Feb", positive: true }}
        />
        <KPICard
          title="Occupancy"
          value="87%"
          icon={Percent}
          iconColor="text-accent"
          iconBg="bg-accent/10"
          trend={{ value: "+5% vs Feb", positive: true }}
        />
        <KPICard
          title="Upcoming Check-ins"
          value="3"
          icon={CalendarCheck}
          iconColor="text-info"
          iconBg="bg-info/10"
        />
        <KPICard
          title="Active Issues"
          value="1"
          icon={AlertTriangle}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      {/* Map + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PropertyMap />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
