import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentActivity } from "@/lib/features/dashboard/queries";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { ProfitChart } from "@/components/admin/dashboard/profit-chart";

export const metadata = {
  title: "Analytics | Flow Admin",
};

export default async function AnalyticsPage() {
  const [stats, activities] = await Promise.all([getDashboardStats(), getRecentActivity()]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(cents);
  };

  // Calculate additional analytics
  const avgOrderValue = stats.totalOrders > 0 ? stats.estimatedRevenue / stats.totalOrders : 0;
  const completionRate =
    stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your business performance</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RevenueChart />
        <ProfitChart />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(avgOrderValue)}</p>
            <p className="text-muted-foreground mt-2 text-sm">Per order across all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate.toFixed(1)}%</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {stats.completedOrders} of {stats.totalOrders} orders completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Work</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.inProgressOrders}</p>
            <p className="text-muted-foreground mt-2 text-sm">Orders currently in progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-muted-foreground">{activity.relatedId?.slice(0, 8)}...</p>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
