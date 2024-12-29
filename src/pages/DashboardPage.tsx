import MonthlyApplicationsChart from "../components/Dashboard/MonthlyApplicationsChart.tsx";
import StatusPieChart from "../components/Dashboard/StatusPieChart.tsx";
import RemindersCard from "../components/Dashboard/RemindersCard.tsx";
import ActivityFeed from "../components/Dashboard/ActivityFeed.tsx";
import DashboardActions from "../components/Dashboard/DashboardActions.tsx";

export default function DashboardPage() {
  return (
      <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <DashboardActions/>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                  <MonthlyApplicationsChart/>
                  <RemindersCard/>
              </div>
              <div className="space-y-4">
                  <StatusPieChart/>
                  <ActivityFeed/>
              </div>

              {/* other components, e.g. reminders, activity feed, etc. */}
          </div>
      </div>
  );
}
