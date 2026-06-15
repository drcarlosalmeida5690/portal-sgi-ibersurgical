import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";

export default function AuditCalendar() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-700" />
            Calendario de Auditoría
          </h1>
          <p className="text-gray-600">Hitos y eventos de la auditoría de certificación</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Auditoría</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Timeline de auditorías internas, mock audits y auditoría externa</p>
            <p className="text-sm text-gray-500 mt-4">Esta página mostrará el calendario con hitos clave y tareas asociadas.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
