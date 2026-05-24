"use client";

import { useEffect, useState } from "react";
import { useTasks, type Task } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  todo: "secondary",
  in_progress: "default",
  review: "warning",
  done: "success",
  cancelled: "destructive",
};

const priorityColors: Record<string, "default" | "secondary" | "warning" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  critical: "destructive",
};

export default function TasksPage() {
  const { tasks, pagination, loading, fetchTasks, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks({ page, search, status, priority });
  }, [fetchTasks, page, search, status, priority]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      fetchTasks({ page, search, status, priority });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">Manage your tasks with full CRUD operations</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }} data-testid="create-task-btn">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                data-testid="task-search"
              />
            </div>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No tasks found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="tasks-table">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Due Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-b last:border-0" data-testid={`task-row-${task._id}`}>
                      <td className="py-3">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{task.description}</p>
                      </td>
                      <td className="py-3">
                        <Badge variant={priorityColors[task.priority] || "default"}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusColors[task.status] || "default"}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {task.dueDate ? formatDate(task.dueDate) : "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingTask(task); setDialogOpen(true); }}
                            data-testid={`edit-task-${task._id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task._id)}
                            data-testid={`delete-task-${task._id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSuccess={() => {
          setDialogOpen(false);
          fetchTasks({ page, search, status, priority });
        }}
      />
    </div>
  );
}
