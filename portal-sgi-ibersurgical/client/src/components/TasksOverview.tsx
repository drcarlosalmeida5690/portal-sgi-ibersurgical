import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistsState, TaskAssignment, getTaskStatus } from "@/types/checklist";
import { AlertTriangle, Clock, User, Calendar } from "lucide-react";
import { useLocation } from "wouter";

interface TasksOverviewProps {
  checklistsState: ChecklistsState;
}

export function TasksOverview({ checklistsState }: TasksOverviewProps) {
  const [, navigate] = useLocation();

  const tasks = useMemo(() => {
    const allTasks: Array<{
      processId: string;
      processName: string;
      criterion: string;
      status: 'nc' | 'pending';
      task: TaskAssignment;
      daysUntilDue: number;
    }> = [];

    Object.values(checklistsState).forEach(checklist => {
      if (checklist?.items) {
        checklist.items.forEach(item => {
          if ((item.status === 'nc' || item.status === 'pending') && item.task?.assignedTo) {
            const daysUntilDue = item.task.dueDate 
              ? Math.ceil((item.task.dueDate - Date.now()) / (1000 * 60 * 60 * 24))
              : Infinity;

            allTasks.push({
              processId: checklist.processId,
              processName: checklist.processName,
              criterion: item.criterion,
              status: item.status,
              task: item.task,
              daysUntilDue,
            });
          }
        });
      }
    });

    // Ordenar por días hasta vencimiento (primero los vencidos, luego los próximos)
    return allTasks.sort((a, b) => a.daysUntilDue - b.daysUntilDue).slice(0, 5);
  }, [checklistsState]);

  const overdueTasks = tasks.filter(t => t.daysUntilDue < 0).length;
  const urgentTasks = tasks.filter(t => t.daysUntilDue >= 0 && t.daysUntilDue <= 7).length;

  const getPriorityColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'border-l-4 border-l-red-600 bg-red-50';
    if (daysUntilDue <= 7) return 'border-l-4 border-l-amber-600 bg-amber-50';
    return 'border-l-4 border-l-green-600 bg-green-50';
  };

  const getPriorityBadge = (daysUntilDue: number) => {
    if (daysUntilDue < 0) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-800">
          Vencido
        </span>
      );
    }
    if (daysUntilDue <= 7) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-amber-200 text-amber-800">
          Urgente
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-200 text-green-800">
        En plazo
      </span>
    );
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-700" />
            Tareas Asignadas (Próximas 5)
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/alertas")}
          >
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay tareas asignadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Alert Summary */}
            {(overdueTasks > 0 || urgentTasks > 0) && (
              <div className="flex gap-4 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                {overdueTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      {overdueTasks} vencida{overdueTasks > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {urgentTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      {urgentTasks} urgente{urgentTasks > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Task List */}
            {tasks.map((task, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${getPriorityColor(task.daysUntilDue)}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{task.criterion}</p>
                    <p className="text-xs text-gray-600 mt-1">{task.processName}</p>
                  </div>
                  {getPriorityBadge(task.daysUntilDue)}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-700 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{task.task.assignedTo}</span>
                  </div>
                  {task.task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.task.dueDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
