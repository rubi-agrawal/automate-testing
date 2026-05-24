"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface Bug {
  _id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
}

export default function BugsPage() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "medium",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
  });

  const fetchBugs = () => {
    fetch("/api/bugs")
      .then((r) => r.json())
      .then((json) => { if (json.success) setBugs(json.data.bugs); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBugs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success("Bug report submitted");
      setShowForm(false);
      setForm({ title: "", description: "", severity: "medium", stepsToReproduce: "", expectedBehavior: "", actualBehavior: "" });
      fetchBugs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  const severityVariant = (s: string) =>
    s === "critical" ? "destructive" : s === "high" ? "warning" : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Defect Monitoring</h2>
          <p className="text-muted-foreground">Track and manage bug reports</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Report Bug
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Bug Report</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="bug-form">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="bug-title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} data-testid="bug-description" />
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </div>
              <Button type="submit" data-testid="bug-submit">Submit Report</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Bug Reports ({bugs.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : bugs.length === 0 ? (
            <p className="text-muted-foreground">No bug reports yet</p>
          ) : (
            <div className="space-y-4" data-testid="bugs-list">
              {bugs.map((bug) => (
                <div key={bug._id} className="rounded-lg border p-4" data-testid={`bug-${bug._id}`}>
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{bug.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant={severityVariant(bug.severity)}>{bug.severity}</Badge>
                      <Badge variant="outline">{bug.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{bug.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(bug.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

