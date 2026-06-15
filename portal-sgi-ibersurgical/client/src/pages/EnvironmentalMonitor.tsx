import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Leaf } from "lucide-react";

export default function EnvironmentalMonitor() {
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
            <Leaf className="w-8 h-8 text-green-700" />
            Monitor de Cumplimiento Ambiental
          </h1>
          <p className="text-gray-600">Gestión de aspectos e impactos ambientales - ISO 14001:2015</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Aspectos Ambientales Identificados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Monitor de cumplimiento ambiental para ISO 14001</p>
            <p className="text-sm text-gray-500 mt-4">Esta página mostrará los aspectos ambientales significativos, requisitos legales aplicables y KPIs de desempeño ambiental.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
