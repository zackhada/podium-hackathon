"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PayoutSummary } from "@/components/finances/payout-summary";
import { RevenueChart } from "@/components/finances/revenue-chart";
import { PropertyBreakdown } from "@/components/finances/property-breakdown";
import { DepositsTable } from "@/components/finances/deposits-table";
import { ChargesLog } from "@/components/finances/charges-log";
import { PricingRecommendations } from "@/components/finances/pricing-recommendation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinancesPage() {
  return (
    <div>
      <PageHeader
        title="Finances"
        subtitle="Revenue, expenses, and AI pricing recommendations"
      />

      {/* Payout Summary */}
      <div className="mb-6">
        <PayoutSummary />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <RevenueChart />
      </div>

      {/* Tabbed Details */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList>
          <TabsTrigger value="breakdown">Property Breakdown</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="pricing">AI Pricing</TabsTrigger>
        </TabsList>
        <TabsContent value="breakdown">
          <PropertyBreakdown />
        </TabsContent>
        <TabsContent value="deposits">
          <DepositsTable />
        </TabsContent>
        <TabsContent value="charges">
          <ChargesLog />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
