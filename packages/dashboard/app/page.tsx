import { CurrentGuests } from "@/components/dashboard/current-guests";
import { PropertyRevenue } from "@/components/dashboard/property-revenue";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PageHeader } from "@/components/layout/page-header";

export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Your Honolulu rental portfolio at a glance"
      />

      {/* Per-property revenue & expenses */}
      <div className="mb-6">
        <PropertyRevenue />
      </div>

      {/* Current guests + Recent agent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CurrentGuests />
        <RecentActivity />
      </div>
    </div>
  );
}
