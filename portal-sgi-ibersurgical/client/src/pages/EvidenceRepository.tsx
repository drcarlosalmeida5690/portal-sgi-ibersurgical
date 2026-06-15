import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, FileText } from "lucide-react";

export default function EvidenceRepository() {
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
            <FileText className="w-8 h-8 text-blue-700" />
            Repositorio de Evidencias
          </h1>
          <p className="text-gray-600">Acceso a documentos y evidencias de cumplimiento</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Estructura de Carpetas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Repositorio de evidencias digitales</p>
            <p className="text-sm text-gray-500 mt-4">Esta página mostrará la estructura de carpetas por proceso con acceso a documentos y registros críticos.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
