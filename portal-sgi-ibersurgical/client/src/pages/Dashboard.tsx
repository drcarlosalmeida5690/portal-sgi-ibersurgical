import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { BarChart3, Leaf, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChecklistsState } from "@/types/checklist";
import { FilterButtons, FilterStatus } from "@/components/FilterButtons";
import { TasksOverview } from "@/components/TasksOverview";
import { BackupControls } from "@/components/BackupControls";

const processesMetadata = [
  { id: "p1", name: "Dirección Estratégica", icon: "🧭" },
  { id: "p2", name: "Gestión Comercial", icon: "🤝" },
  { id: "p3", name: "Diseño y Desarrollo", icon: "🔧" },
  { id: "p4", name: "Compras y Proveedores", icon: "🛒" },
  { id: "p5", name: "Producción y Operaciones", icon: "🏭" },
  { id: "p6", name: "Gestión de Calidad", icon: "✓" },
  { id: "p7", name: "Gestión del Talento Humano", icon: "👥" },
  { id: "p8", name: "Gestión Ambiental", icon: "🌿" },
  { id: "p9", name: "Mejora Continua", icon: "📈" },
];

const getStatusFromProgress = (progress: number): 'complete' | 'in-progress' | 'pending' => {
  if (progress === 100) return 'complete';
  if (progress > 0) return 'in-progress';
  return 'pending';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "complete":
      return "text-green-600";
    case "in-progress":
      return "text-amber-600";
    case "pending":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-amber-600" />;
    case "pending":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return null;
  }
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [checklistsState] = useLocalStorage<ChecklistsState>('checklists', {});
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Calcular progreso de cada proceso basado en localStorage
  const processes = useMemo(() => {
    return processesMetadata.map(meta => {
      const checklist = checklistsState[meta.id];
      let progress = 0;
      let status: 'complete' | 'in-progress' | 'pending' = 'pending';

      if (checklist && checklist.items.length > 0) {
        const completedCount = checklist.items.filter(item => item.status === 'ok').length;
        progress = Math.round((completedCount / checklist.items.length) * 100);
        status = getStatusFromProgress(progress);
      }

      return {
        ...meta,
        progress,
        status,
      };
    });
  }, [checklistsState]);

  const totalProgress = Math.round(processes.reduce((sum, p) => sum + p.progress, 0) / processes.length);

  // Calcular conteos de estados
  const filterCounts = useMemo(() => {
    const counts = { all: 0, ok: 0, nc: 0, pending: 0 };
    
    Object.values(checklistsState).forEach(checklist => {
      if (checklist?.items) {
        checklist.items.forEach(item => {
          counts.all++;
          if (item.status === 'ok') counts.ok++;
          else if (item.status === 'nc') counts.nc++;
          else if (item.status === 'pending') counts.pending++;
        });
      }
    });
    
    return counts;
  }, [checklistsState]);

  // Filtrar procesos basado en el filtro seleccionado
  const filteredProcesses = useMemo(() => {
    if (filterStatus === 'all') return processes;
    
    return processes.filter(process => {
      const checklist = checklistsState[process.id];
      if (!checklist?.items) return false;
      
      if (filterStatus === 'ok') {
        return checklist.items.some(item => item.status === 'ok');
      } else if (filterStatus === 'nc') {
        return checklist.items.some(item => item.status === 'nc');
      } else if (filterStatus === 'pending') {
        return checklist.items.some(item => item.status === 'pending');
      }
      
      return true;
    });
  }, [filterStatus, processes, checklistsState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663754150489/Xt2LnoFtkM9rgtk56NhFJ8/logo_ibersurgical-V9B4gWtizWzGJoBUbFUEi6.webp" alt="IBERSURGICAL" className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold">Portal de Cumplimiento SGI</h1>
                <p className="text-blue-100">Sistema de Gestión Integrado ISO 9001:2015 e ISO 14001:2015</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-semibold">ISO 9001 • ISO 14001</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Backup de Datos */}
        <div className="mb-8">
          <BackupControls />
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-900" />
              Resumen de Preparación para Auditoría
            </CardTitle>
            <CardDescription>Progreso general del Sistema de Gestión Integrado</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Progreso General</span>
                  <span className="text-2xl font-bold text-blue-900">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-700">Completado</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{processes.filter(p => p.status === "complete").length}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-gray-700">En Progreso</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{processes.filter(p => p.status === "in-progress").length}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-gray-700">Pendiente</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{processes.filter(p => p.status === "pending").length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tareas Pendientes */}
        <TasksOverview checklistsState={checklistsState} />

        {/* Filtros */}
        <Card className="mb-8 border-0 shadow-md mt-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
            <CardTitle>Filtrar por Estado</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <FilterButtons 
              activeFilter={filterStatus} 
              onFilterChange={setFilterStatus}
              counts={filterCounts}
            />
          </CardContent>
        </Card>

        {/* Processes Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Estado de Procesos</h2>
            {filterStatus !== 'all' && (
              <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                Mostrando {filteredProcesses.length} de {processes.length} procesos
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProcesses.map((process) => (
              <Card key={process.id} className="hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => navigate(`/proceso/${process.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{process.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{process.name}</CardTitle>
                        <CardDescription className="text-xs">{process.id.toUpperCase()}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(process.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progreso</span>
                        <span className="text-sm font-bold text-gray-800">{process.progress}%</span>
                      </div>
                      <Progress value={process.progress} className="h-2" />
                    </div>
                    <Button variant="outline" className="w-full mt-2" onClick={() => navigate(`/proceso/${process.id}`)}>
                      Ver Checklist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredProcesses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No hay procesos que coincidan con el filtro seleccionado</p>
              <p className="text-gray-500 text-sm mt-1">Todos los procesos están en estado OK</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-700" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Button variant="outline" className="h-12 border-red-300 hover:bg-red-50" onClick={() => navigate("/alertas")}>
                🚨 Alertas
              </Button>
              <Button variant="outline" className="h-12" onClick={() => navigate("/ambiental")}>
                Monitor Ambiental
              </Button>
              <Button variant="outline" className="h-12" onClick={() => navigate("/evidencias")}>
                Repositorio
              </Button>
              <Button variant="outline" className="h-12" onClick={() => navigate("/calendario")}>
                Calendario
              </Button>
              <Button variant="outline" className="h-12" onClick={() => navigate("/ayuda")}>
                Ayuda
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
        <p>© 2026 IBERSURGICAL. Todos los derechos reservados. | Comprometidos con la calidad, la seguridad y la mejora continua.</p>
      </footer>
    </div>
  );
}

