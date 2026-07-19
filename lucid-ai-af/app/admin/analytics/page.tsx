import Topbar from "@/components/admin/Topbar";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import StatCard from "@/components/admin/StatCard";
import { mockAnalytics, mockStats } from "@/lib/mockData";

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />
      <main className="p-5 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Weekly Active Users" value={mockStats.totalUsers} delta={mockStats.userDelta} />
          <StatCard label="World Creation Rate" value={mockStats.activeWorlds} delta={mockStats.worldDelta} />
          <StatCard label="Avg. Session Length" value={27} delta={4.2} suffix=" min" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-glow p-5">
            <h2 className="font-display text-base text-ink mb-3">User Growth</h2>
            <AnalyticsChart data={mockAnalytics} metric="users" color="#A855F7" />
          </div>
          <div className="card-glow p-5">
            <h2 className="font-display text-base text-ink mb-3">World Creation</h2>
            <AnalyticsChart data={mockAnalytics} metric="worlds" color="#FBBF24" />
          </div>
        </div>

        <div className="card-glow p-5">
          <h2 className="font-display text-base text-ink mb-3">Session Volume</h2>
          <AnalyticsChart data={mockAnalytics} metric="sessions" color="#34D399" />
        </div>
      </main>
    </>
  );
}
