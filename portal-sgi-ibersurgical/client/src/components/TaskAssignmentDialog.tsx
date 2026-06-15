import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEAM_MEMBERS, TaskAssignment } from "@/types/checklist";
import { toast } from "sonner";

interface TaskAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (assignment: TaskAssignment) => void;
  currentAssignment?: TaskAssignment;
  criterion?: string;
}

export function TaskAssignmentDialog({
  open,
  onOpenChange,
  onAssign,
  currentAssignment,
  criterion,
}: TaskAssignmentDialogProps) {
  const [assignedTo, setAssignedTo] = useState(currentAssignment?.assignedTo || 'Sin asignar');
  const [dueDate, setDueDate] = useState(
    currentAssignment?.dueDate ? new Date(currentAssignment.dueDate).toISOString().split('T')[0] : ''
  );

  const handleAssign = () => {
    if (!dueDate) {
      toast.error('Por favor selecciona una fecha límite');
      return;
    }

    const dueDateTimestamp = new Date(dueDate).getTime();
    const now = Date.now();

    if (dueDateTimestamp < now) {
      toast.error('La fecha límite debe ser posterior a hoy');
      return;
    }

    onAssign({
      assignedTo: assignedTo === 'Sin asignar' ? undefined : assignedTo,
      dueDate: dueDateTimestamp,
      taskStatus: 'open',
      createdAt: currentAssignment?.createdAt || Date.now(),
    });

    onOpenChange(false);
    toast.success('Tarea asignada correctamente');
  };

  // Calcular fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  // Calcular fecha sugerida (15 días desde hoy)
  const suggestedDate = new Date();
  suggestedDate.setDate(suggestedDate.getDate() + 15);
  const suggestedDateStr = suggestedDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Responsable y Fecha Límite</DialogTitle>
          {criterion && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Criterio:</span> {criterion}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Responsable */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Responsable</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger id="assignee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Selecciona el miembro del equipo responsable de completar esta tarea
            </p>
          </div>

          {/* Fecha Límite */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha Límite</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mínimo: {new Date(today).toLocaleDateString('es-ES')}</span>
              <button
                onClick={() => setDueDate(suggestedDateStr)}
                className="text-blue-600 hover:underline"
              >
                Sugerir: {new Date(suggestedDateStr).toLocaleDateString('es-ES')} (15 días)
              </button>
            </div>
          </div>

          {/* Resumen */}
          {dueDate && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Resumen:</span> {assignedTo} deberá completar esta tarea antes del{' '}
                <span className="font-semibold text-blue-700">
                  {new Date(dueDate).toLocaleDateString('es-ES')}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700">
            Asignar Tarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
