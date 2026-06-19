import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

/**
 * Claves de localStorage que la app utiliza para guardar datos del portal.
 * Si en el futuro se añaden más claves persistentes, deben incluirse aquí
 * para que queden cubiertas por el backup.
 */
const BACKUP_KEYS = ['checklists'];

interface BackupPayload {
  exportedAt: string;
  appVersion: string;
  data: Record<string, unknown>;
}

export function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data: Record<string, unknown> = {};
      BACKUP_KEYS.forEach((key) => {
        const item = window.localStorage.getItem(key);
        if (item) {
          data[key] = JSON.parse(item);
        }
      });

      const payload: BackupPayload = {
        exportedAt: new Date().toISOString(),
        appVersion: '1.0',
        data,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      a.href = url;
      a.download = `Backup_Portal_SGI_Ibersurgical_${fecha}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Backup descargado correctamente', {
        description: 'Guarda este archivo en el servidor o en tu equipo.',
      });
    } catch (error) {
      console.error('Error al exportar backup:', error);
      toast.error('No se pudo generar el backup');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const payload: BackupPayload = JSON.parse(text);

        if (!payload.data) {
          throw new Error('Formato de archivo no reconocido');
        }

        const confirmado = window.confirm(
          `Vas a restaurar un backup del ${new Date(payload.exportedAt).toLocaleString('es-ES')}.\n\n` +
          'Esto SOBRESCRIBIRÁ todos los datos actuales del portal (estados, observaciones y tareas). ' +
          '¿Quieres continuar?'
        );

        if (!confirmado) {
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        BACKUP_KEYS.forEach((key) => {
          if (payload.data[key] !== undefined) {
            window.localStorage.setItem(key, JSON.stringify(payload.data[key]));
          }
        });

        toast.success('Backup restaurado correctamente', {
          description: 'La página se recargará para aplicar los cambios.',
        });

        setTimeout(() => window.location.reload(), 1200);
      } catch (error) {
        console.error('Error al importar backup:', error);
        toast.error('No se pudo restaurar el backup', {
          description: 'Comprueba que el archivo sea un backup válido del Portal SGI.',
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-0 shadow-md border-l-4 border-l-amber-500">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-700" />
          Copia de Seguridad de los Datos
        </CardTitle>
        <CardDescription>
          Los datos de este portal se guardan únicamente en este navegador. Exporta una copia
          periódicamente para no perder el trabajo si cambias de ordenador o se borra el caché.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExport} className="flex-1 h-12 bg-blue-900 hover:bg-blue-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar Backup (.json)
          </Button>
          <Button onClick={handleImportClick} variant="outline" className="flex-1 h-12 border-amber-300 hover:bg-amber-50">
            <Upload className="w-4 h-4 mr-2" />
            Importar Backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Recomendación: exporta un backup al final de cada sesión de trabajo y guárdalo en{' '}
          <span className="font-mono">U:\CALIDAD\SGC Ibersurgical</span>.
        </p>
      </CardContent>
    </Card>
  );
}
