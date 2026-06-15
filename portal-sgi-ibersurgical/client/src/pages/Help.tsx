import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function Help() {
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
            <HelpCircle className="w-8 h-8 text-orange-700" />
            Centro de Ayuda
          </h1>
          <p className="text-gray-600">Preguntas frecuentes y documentación</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Centro de ayuda y documentación</p>
            <p className="text-sm text-gray-500 mt-4">Esta página mostrará preguntas frecuentes, guías de uso y contactos de soporte.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
