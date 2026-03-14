import { CurrentGuests } from "@/components/dashboard/current-guests";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/finances/revenue-chart";
import { PageHeader } from "@/components/layout/page-header";

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Your Honolulu rental portfolio at a glance"
      />

      {/* Revenue chart */}
      <div className="mb-6">
        <RevenueChart />
      </div>

      {/* Current guests + Recent agent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CurrentGuests />
        <RecentActivity />
      </div>
    </div>
  );
}
