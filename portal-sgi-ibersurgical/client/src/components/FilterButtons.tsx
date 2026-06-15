import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Filter } from "lucide-react";

export type FilterStatus = 'all' | 'ok' | 'nc' | 'pending';

interface FilterButtonsProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts?: {
    all: number;
    ok: number;
    nc: number;
    pending: number;
  };
}

export function FilterButtons({ activeFilter, onFilterChange, counts }: FilterButtonsProps) {
  const filters: Array<{ id: FilterStatus; label: string; icon: React.ReactNode; color: string }> = [
    {
      id: 'all',
      label: 'Todos',
      icon: <Filter className="w-4 h-4" />,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    },
    {
      id: 'ok',
      label: 'OK',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'bg-green-100 hover:bg-green-200 text-green-700',
    },
    {
      id: 'nc',
      label: 'NC',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-red-100 hover:bg-red-200 text-red-700',
    },
    {
      id: 'pending',
      label: 'Pendiente',
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count = counts?.[filter.id] ?? 0;
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            variant={isActive ? 'default' : 'outline'}
            className={`gap-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : filter.color}`}
          >
            {filter.icon}
            <span>{filter.label}</span>
            {count > 0 && <span className="ml-1 font-semibold">({count})</span>}
          </Button>
        );
      })}
    </div>
  );
}
