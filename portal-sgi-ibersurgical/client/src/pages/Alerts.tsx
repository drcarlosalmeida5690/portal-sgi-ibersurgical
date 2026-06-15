import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, AlertCircle, Clock, User, Calendar, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChecklistsState, TaskAssignment, getTaskStatus } from "@/types/checklist";
import { TaskAssignmentDialog } from "@/components/TaskAssignmentDialog";
import { toast } from "sonner";

interface AlertItem {
  processId: string;
  processName: string;
  itemId: string;
  criterion: string;
  status: 'nc' | 'pending';
  evidence: string;
  observations: string;
  lastUpdated?: number;
  task?: TaskAssignment;
}

export default function Alerts() {
  const [, navigate] = useLocation();
  const [checklistsState, setChecklistsState] = useLocalStorage<ChecklistsState>('checklists', {});
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Recopilar todos los ítems NC y Pendiente
  const alertItems = useMemo(() => {
    const alerts: AlertItem[] = [];

    Object.values(checklistsState).forEach(checklist => {
      if (checklist?.items) {
        checklist.items.forEach(item => {
          if (item.status === 'nc' || item.status === 'pending') {
            alerts.push({
              processId: checklist.processId,
              processName: checklist.processName,
              itemId: item.id,
              criterion: item.criterion,
              status: item.status,
              evidence: item.evidence,
              observations: item.observations,
              lastUpdated: item.lastUpdated,
              task: item.task,
            });
          }
        });
      }
    });

    // Ordenar: NC primero, luego Pendiente, luego por fecha límite
    return alerts.sort((a, b) => {
      if (a.status === 'nc' && b.status === 'pending') return -1;
      if (a.status === 'pending' && b.status === 'nc') return 1;
      
      const aDue = a.task?.dueDate || Infinity;
      const bDue = b.task?.dueDate || Infinity;
      return aDue - bDue;
    });
  }, [checklistsState]);

  const handleAssignTask = (assignment: TaskAssignment) => {
    if (!selectedAlert) return;

    const updatedChecklistsState = { ...checklistsState };
    const checklist = updatedChecklistsState[selectedAlert.processId];
    
    if (checklist) {
      const itemIndex = checklist.items.findIndex(item => item.id === selectedAlert.itemId);
      if (itemIndex !== -1) {
        checklist.items[itemIndex].task = assignment;
        setChecklistsState(updatedChecklistsState);
        toast.success('Tarea asignada correctamente');
      }
    }

    setSelectedAlert(null);
    setDialogOpen(false);
  };

  const getTaskStatusColor = (task?: TaskAssignment) => {
    if (!task) return 'bg-gray-50';
    const status = getTaskStatus(task.dueDate);
    if (status === 'overdue') return 'bg-red-50 border-red-300';
    if (status === 'open') return 'bg-amber-50 border-amber-300';
    return 'bg-green-50 border-green-300';
  };

  const getDaysUntilDue = (dueDate?: number) => {
    if (!dueDate) return null;
    const days = Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const ncCount = alertItems.filter(item => item.status === 'nc').length;
  const pendingCount = alertItems.filter(item => item.status === 'pending').length;
  const assignedCount = alertItems.filter(item => item.task?.assignedTo).length;

  const getStatusIcon = (status: 'nc' | 'pending') => {
    if (status === 'nc') {
      return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
    return <Clock className="w-6 h-6 text-amber-600" />;
  };

  const getStatusColor = (status: 'nc' | 'pending') => {
    if (status === 'nc') {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-amber-50 border-amber-200';
  };

  const getStatusLabel = (status: 'nc' | 'pending') => {
    if (status === 'nc') {
      return 'No Conforme (NC)';
    }
    return 'Pendiente';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            Centro de Alertas y Tareas
          </h1>
          <p className="text-gray-600">Gestión centralizada de NC, Pendientes y asignaciones de tareas</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">{ncCount}</div>
                <p className="text-gray-600 mt-2">No Conformes (NC)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600">{pendingCount}</div>
                <p className="text-gray-600 mt-2">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{assignedCount}</div>
                <p className="text-gray-600 mt-2">Asignadas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{alertItems.length}</div>
                <p className="text-gray-600 mt-2">Total de Alertas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        {alertItems.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Excelente!</h3>
              <p className="text-gray-600">No hay ítems NC ni Pendientes. Todos los criterios están en estado OK.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alertItems.map((alert) => (
              <Card key={`${alert.processId}-${alert.itemId}`} className={`border-2 ${getStatusColor(alert.status)}`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(alert.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{alert.criterion}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Proceso:</span> {alert.processName}
                            </p>
                          </div>
                          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                            alert.status === 'nc' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-amber-200 text-amber-800'
                          }`}>
                            {getStatusLabel(alert.status)}
                          </span>
                        </div>

                        <div className="bg-white/50 p-3 rounded mt-3 space-y-2">
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">Evidencia esperada:</span>
                            <br />
                            <span className="text-gray-600">{alert.evidence}</span>
                          </p>

                          {alert.observations && (
                            <p className="text-sm">
                              <span className="font-medium text-gray-700">Observaciones:</span>
                              <br />
                              <span className="text-gray-600 italic">{alert.observations}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Task Assignment Section */}
                    <div className={`p-3 rounded-lg border-2 ${getTaskStatusColor(alert.task)}`}>
                      {alert.task?.assignedTo ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">
                              Asignado a: <span className="text-blue-700">{alert.task.assignedTo}</span>
                            </span>
                          </div>
                          {alert.task.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium">
                                Fecha límite: <span className="text-blue-700">{new Date(alert.task.dueDate).toLocaleDateString('es-ES')}</span>
                              </span>
                              {getDaysUntilDue(alert.task.dueDate) !== null && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                  getDaysUntilDue(alert.task.dueDate)! < 0 
                                    ? 'bg-red-200 text-red-800' 
                                    : getDaysUntilDue(alert.task.dueDate)! <= 7
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-green-200 text-green-800'
                                }`}>
                                  {getDaysUntilDue(alert.task.dueDate)! < 0 
                                    ? `Vencido hace ${Math.abs(getDaysUntilDue(alert.task.dueDate)!)} días`
                                    : `${getDaysUntilDue(alert.task.dueDate)} días`
                                  }
                                </span>
                              )}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setDialogOpen(true);
                            }}
                            className="mt-2"
                          >
                            Editar Asignación
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">Sin asignación de tarea</p>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setDialogOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Asignar Tarea
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Última actualización: {alert.lastUpdated ? new Date(alert.lastUpdated).toLocaleString('es-ES') : 'N/A'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/proceso/${alert.processId}`)}
                      >
                        Ver Checklist Completo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Task Assignment Dialog */}
      <TaskAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAssign={handleAssignTask}
        currentAssignment={selectedAlert?.task}
        criterion={selectedAlert?.criterion}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
        <p>© 2026 IBERSURGICAL. Centro de Alertas - Monitoreo de Cumplimiento SGI</p>
      </footer>
    </div>
  );
}
