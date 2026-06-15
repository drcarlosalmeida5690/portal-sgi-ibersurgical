import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, Save } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChecklistItem, ChecklistsState, checklistsData, ChecklistStatus } from "@/types/checklist";
import { toast } from "sonner";

export default function ProcessChecklist() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/proceso/:id");
  const [checklistsState, setChecklistsState] = useLocalStorage<ChecklistsState>('checklists', {});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [observations, setObservations] = useState<string>('');

  if (!match) return null;

  const processId = params?.id?.toLowerCase();
  const processData = checklistsData[processId as keyof typeof checklistsData];

  if (!processData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Proceso no encontrado</h1>
          </div>
        </header>
      </div>
    );
  }

  // Obtener o inicializar el checklist del proceso
  const getProcessChecklist = () => {
    if (checklistsState[processId]) {
      return checklistsState[processId];
    }
    
    const initialChecklist = {
      processId,
      processName: processData.processName,
      items: processData.items.map(item => ({
        ...item,
        status: 'pending' as ChecklistStatus,
        observations: '',
        lastUpdated: Date.now(),
      })),
    };
    
    setChecklistsState({
      ...checklistsState,
      [processId]: initialChecklist,
    });
    
    return initialChecklist;
  };

  const checklist = getProcessChecklist();
  const items = checklist.items;

  // Calcular progreso
  const completedCount = items.filter(item => item.status === 'ok').length;
  const ncCount = items.filter(item => item.status === 'nc').length;
  const pendingCount = items.filter(item => item.status === 'pending').length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  // Actualizar estado de un item
  const updateItemStatus = (itemId: string, newStatus: ChecklistStatus) => {
    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, status: newStatus, lastUpdated: Date.now() }
        : item
    );

    setChecklistsState({
      ...checklistsState,
      [processId]: {
        ...checklist,
        items: updatedItems,
      },
    });

    toast.success(`Criterio actualizado a ${newStatus === 'ok' ? 'OK' : newStatus === 'nc' ? 'NC' : 'Pendiente'}`);
  };

  // Actualizar observaciones de un item
  const updateItemObservations = (itemId: string, newObservations: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, observations: newObservations, lastUpdated: Date.now() }
        : item
    );

    setChecklistsState({
      ...checklistsState,
      [processId]: {
        ...checklist,
        items: updatedItems,
      },
    });
  };

  const getStatusIcon = (status: ChecklistStatus) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'nc':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: ChecklistStatus) => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 border-green-200';
      case 'nc':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-amber-50 border-amber-200';
    }
  };

  const getStatusLabel = (status: ChecklistStatus) => {
    switch (status) {
      case 'ok':
        return 'OK';
      case 'nc':
        return 'NC';
      case 'pending':
        return 'Pendiente';
    }
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
          <h1 className="text-3xl font-bold text-gray-800">{checklist.processName}</h1>
          <p className="text-gray-600">Checklist de criterios de cumplimiento ISO 9001 e ISO 14001</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Summary */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
            <CardTitle>Resumen de Progreso</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{progressPercent}%</div>
                <p className="text-sm text-gray-600 mt-1">Progreso General</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedCount}</div>
                <p className="text-sm text-gray-600 mt-1">Completado (OK)</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{ncCount}</div>
                <p className="text-sm text-gray-600 mt-1">No Conforme (NC)</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
                <p className="text-sm text-gray-600 mt-1">Pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className={`border-2 transition-all ${getStatusColor(item.status)}`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(item.status)}
                        <h3 className="font-semibold text-gray-800">{item.criterion}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">
                        <span className="font-medium">Evidencia:</span> {item.evidence}
                      </p>
                      <div className="flex gap-2 ml-8 mt-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                          {item.standard}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={item.status} onValueChange={(value) => updateItemStatus(item.id, value as ChecklistStatus)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ok">✓ OK</SelectItem>
                          <SelectItem value="nc">✗ NC</SelectItem>
                          <SelectItem value="pending">⏳ Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="ml-8 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <Textarea
                      placeholder="Añade observaciones, hallazgos o acciones correctivas..."
                      value={item.observations}
                      onChange={(e) => updateItemObservations(item.id, e.target.value)}
                      className="min-h-20 text-sm"
                    />
                    {item.lastUpdated && (
                      <p className="text-xs text-gray-500 mt-2">
                        Última actualización: {new Date(item.lastUpdated).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
            Volver al Dashboard
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Guardado Automático Activo
          </Button>
        </div>
      </main>
    </div>
  );
}
