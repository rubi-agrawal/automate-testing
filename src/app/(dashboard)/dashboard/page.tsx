"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckSquare, Bug, Star, FlaskConical } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  totalUsers?: number;
  totalTasks?: number;
  totalBugs?: number;
  openBugs?: number;
  myTasks?: number;
  myBugs?: number;
  testCoverage?: { unit: number; integration: number; e2e: number; overall: number };
  taskByStatus?: { _id: string; count: number }[];
  tasksByStatus?: { _id: string; count: number }[];
  recentTasks?: Array<{ _id: string; title: string; status: string; createdAt: string }>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  const isAdmin = user?.role === "admin";
  const statusData = stats?.taskByStatus || stats?.tasksByStatus || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          {isAdmin ? "Admin Dashboard Overview" : "Your Task Dashboard"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
            <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon={CheckSquare} />
            <StatCard title="Bug Reports" value={stats?.totalBugs ?? 0} icon={Bug} />
            <StatCard title="Open Bugs" value={stats?.openBugs ?? 0} icon={Bug} />
          </>
        ) : (
          <>
            <StatCard title="My Tasks" value={stats?.myTasks ?? 0} icon={CheckSquare} />
            <StatCard title="My Bug Reports" value={stats?.myBugs ?? 0} icon={Bug} />
            <StatCard title="Tasks Done" value={statusData.find((s) => s._id === "done")?.count ?? 0} icon={Star} />
            <StatCard title="In Progress" value={statusData.find((s) => s._id === "in_progress")?.count ?? 0} icon={FlaskConical} />
          </>
        )}
      </div>

      {isAdmin && stats?.testCoverage && (
        <Card>
          <CardHeader>
            <CardTitle>Test Coverage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Unit Tests", value: stats.testCoverage.unit },
                { label: "Integration", value: stats.testCoverage.integration },
                { label: "E2E Tests", value: stats.testCoverage.e2e },
                { label: "Overall", value: stats.testCoverage.overall },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{item.value}%</div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {statusData.map((s) => (
                  <div key={s._id} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{s._id.replace("_", " ")}</span>
                    <span className="font-semibold">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentTasks?.length ? (
              <p className="text-muted-foreground text-sm">No recent tasks</p>
            ) : (
              <div className="space-y-3">
                {stats.recentTasks.map((task) => (
                  <div key={task._id} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{task.status}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
