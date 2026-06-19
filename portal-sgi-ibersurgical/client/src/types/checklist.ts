/**
 * Tipos para el sistema de checklists de auditoría
 */

export type ChecklistStatus = 'ok' | 'nc' | 'pending';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'overdue';

export interface TaskAssignment {
  assignedTo?: string;
  dueDate?: number;
  taskStatus?: TaskStatus;
  createdAt?: number;
  completedAt?: number;
}

export interface ChecklistItem {
  id: string;
  criterion: string;
  evidence: string;
  standard: 'ISO9001' | 'ISO14001' | 'SGI';
  status: ChecklistStatus;
  observations: string;
  lastUpdated?: number;
  task?: TaskAssignment;
}

export interface ProcessChecklist {
  processId: string;
  processName: string;
  items: ChecklistItem[];
  completedAt?: number;
}

export interface ChecklistsState {
  [processId: string]: ProcessChecklist;
}

export const TEAM_MEMBERS = [
  'Carlos Almeida',
  'Paola García',
  'Elvira Martínez',
  'Mari López',
  'Eusebio Rodríguez',
  'Sin asignar',
];

export const getTaskStatus = (dueDate?: number): TaskStatus => {
  if (!dueDate) return 'open';
  const now = Date.now();
  if (dueDate < now) return 'overdue';
  return 'open';
};

/**
 * Datos de checklists para cada proceso (P1-P9)
 */
export const checklistsData: Record<string, Omit<ProcessChecklist, 'items'> & { items: Omit<ChecklistItem, 'status' | 'observations' | 'lastUpdated' | 'task'>[] }> = {
  p1: {
    processId: 'p1',
    processName: 'Dirección Estratégica',
    items: [
      { id: 'p1-1', criterion: 'Política SGI Vigente y Comunicada', evidence: 'P1_Politica_SGI_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p1-2', criterion: 'Objetivos de Calidad Definidos', evidence: 'P1_Objetivos_Calidad_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p1-3', criterion: 'Objetivos Ambientales Definidos', evidence: 'P1_Objetivos_Ambientales_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p1-4', criterion: 'Revisión por la Dirección Documentada', evidence: 'P1_Acta_Revision_Direccion_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p1-5', criterion: 'Mapa de Procesos Documentado', evidence: 'AX-00-04_Mapa_de_Procesos_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p1-6', criterion: 'Riesgos y Oportunidades Identificados', evidence: 'Excel_Riesgos_y_Oportunidades_vX_AAAAMM.xlsx', standard: 'ISO9001' },
    ],
  },
  p2: {
    processId: 'p2',
    processName: 'Gestión Comercial',
    items: [
      { id: 'p2-1', criterion: 'SOP Vigente y Firmada', evidence: 'P2_SOP_Gestion_Comercial_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p2-2', criterion: 'Criterios Ambientales en Proveedores', evidence: 'P2_Criterios_Evaluacion_Proveedores_MA_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p2-3', criterion: 'Registros de Evaluación de Proveedores', evidence: 'P2_Registro_Evaluacion_Proveedores_vX_AAAAMM.xlsx', standard: 'ISO9001' },
      { id: 'p2-4', criterion: 'Acuerdos de Calidad y Ambiental', evidence: 'P2_Acuerdos_Calidad_Ambiental_vX_AAAAMM.pdf', standard: 'SGI' },
    ],
  },
  p3: {
    processId: 'p3',
    processName: 'Control de Recepción e Importaciones',
    items: [
      { id: 'p3-1', criterion: 'SOP Control de Recepción Vigente', evidence: 'P3_SOP_Control_Recepcion_SGI_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p3-2', criterion: 'Registros de Verificación de Calidad', evidence: 'P3_Registro_Verificacion_Albaranes_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p3-3', criterion: 'Gestión de Residuos en Recepción', evidence: 'P3_Registro_Gestion_Residuos_Recepcion_MA_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p3-4', criterion: 'DUAs y Certificados de Importación', evidence: 'P3_DUA_Certificados_vX_AAAAMM.pdf', standard: 'ISO9001' },
    ],
  },
  p4: {
    processId: 'p4',
    processName: 'Compras y Proveedores',
    items: [
      { id: 'p4-1', criterion: 'SOP Almacenamiento Vigente', evidence: 'P4_SOP_Almacenamiento_SGI_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p4-2', criterion: 'Registros de Temperatura y Humedad', evidence: 'P4_Registro_Temp_Humedad_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p4-3', criterion: 'Inventario Actualizado en ERP', evidence: 'Informe_ERP_Inventario_vX_AAAAMM.xlsx', standard: 'ISO9001' },
      { id: 'p4-4', criterion: 'Sistema FIFO/FEFO Aplicado', evidence: 'P4_SOP_FIFO_FEFO_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p4-5', criterion: 'Gestión de Residuos en Almacén', evidence: 'P4_Registro_Gestion_Residuos_Almacen_MA_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p4-6', criterion: 'Procedimiento de Emergencias Ambiental', evidence: 'P4_SOP_Emergencias_Almacen_MA_vX_AAAAMM.pdf', standard: 'ISO14001' },
    ],
  },
  p5: {
    processId: 'p5',
    processName: 'Producción y Operaciones',
    items: [
      { id: 'p5-1', criterion: 'SOP Operacional Vigente', evidence: 'P5_SOP_Operaciones_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p5-2', criterion: 'Registros de Actividades', evidence: 'P5_Registro_Actividades_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p5-3', criterion: 'Indicadores de Desempeño', evidence: 'P5_KPIs_Desempeño_vX_AAAAMM.pdf', standard: 'SGI' },
    ],
  },
  p6: {
    processId: 'p6',
    processName: 'Gestión de Calidad',
    items: [
      { id: 'p6-1', criterion: 'SOP Gestión de Calidad Vigente', evidence: 'P6_SOP_Gestion_Calidad_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p6-2', criterion: 'Registros de Inspección y Pruebas', evidence: 'P6_Registro_Inspeccion_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p6-3', criterion: 'Control de Productos No Conformes', evidence: 'P6_Registro_Productos_NC_vX_AAAAMM.pdf', standard: 'ISO9001' },
    ],
  },
  p7: {
    processId: 'p7',
    processName: 'Gestión del Talento Humano',
    items: [
      { id: 'p7-1', criterion: 'Fichas de Competencia por Puesto', evidence: 'P7_Ficha_Competencia_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p7-2', criterion: 'Plan de Formación 2026', evidence: 'P7_Plan_Formacion_SGI_2026_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p7-3', criterion: 'Actas de Formación Firmadas', evidence: 'P7_Acta_Formacion_SGI_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p7-4', criterion: 'Evaluaciones de Eficacia de Formación', evidence: 'P7_Evaluacion_Eficacia_Formacion_vX_AAAAMM.pdf', standard: 'ISO9001' },
    ],
  },
  p8: {
    processId: 'p8',
    processName: 'Gestión Ambiental',
    items: [
      { id: 'p8-1', criterion: 'Identificación de Aspectos Ambientales', evidence: 'P8_Aspectos_Impactos_Ambientales_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p8-2', criterion: 'Requisitos Legales Ambientales Identificados', evidence: 'P8_Requisitos_Legales_Ambientales_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p8-3', criterion: 'Programa de Gestión Ambiental', evidence: 'P8_Programa_Gestion_Ambiental_vX_AAAAMM.pdf', standard: 'ISO14001' },
      { id: 'p8-4', criterion: 'Registros de Auditorías Ambientales', evidence: 'P8_Registro_Auditorias_Ambientales_vX_AAAAMM.pdf', standard: 'ISO14001' },
    ],
  },
  p9: {
    processId: 'p9',
    processName: 'Mejora Continua',
    items: [
      { id: 'p9-1', criterion: 'SOP No Conformidades y CAPA Vigente', evidence: 'P9_SOP_NC_CAPA_vX_AAAAMM.pdf', standard: 'SGI' },
      { id: 'p9-2', criterion: 'Registros de No Conformidades', evidence: 'P9_Registro_NC_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p9-3', criterion: 'Acciones Correctivas Documentadas', evidence: 'P9_Acciones_Correctivas_vX_AAAAMM.pdf', standard: 'ISO9001' },
      { id: 'p9-4', criterion: 'Mejoras Ambientales Implementadas', evidence: 'P9_Mejoras_Ambientales_vX_AAAAMM.pdf', standard: 'ISO14001' },
    ],
  },
};
