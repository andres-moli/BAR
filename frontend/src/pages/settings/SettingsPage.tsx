import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Building2, Phone, MapPin, FileText, Printer, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '@/services/settings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { AppSettings } from '@/types';
import { handleError } from '@/utils/errorHandler';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nombre_restaurante: '',
    direccion: '',
    telefono: '',
    nit: '',
    iva_porcentaje: 0,
    tipo_impresora: '58mm' as '58mm' | '80mm',
    moneda_simbolo: '$',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        nombre_restaurante: settings.nombre_restaurante,
        direccion: settings.direccion,
        telefono: settings.telefono,
        nit: settings.nit,
        iva_porcentaje: settings.iva_porcentaje,
        tipo_impresora: settings.tipo_impresora,
        moneda_simbolo: settings.moneda_simbolo,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: () => settingsService.update(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Configuración guardada exitosamente');
    },
    onError: (err) => handleError(err, 'Error al guardar la configuración'),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-dark-400 text-sm mt-1">Personaliza los ajustes del sistema</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-400" />
          Información del Restaurante
        </h3>
        <div className="space-y-4">
          <Input
            label="Nombre del Restaurante"
            placeholder="Mi Restaurante"
            value={formData.nombre_restaurante}
            onChange={(e) => setFormData({ ...formData, nombre_restaurante: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección"
              placeholder="Calle 123 #45-67"
              icon={<MapPin className="w-4 h-4" />}
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            />
            <Input
              label="Teléfono"
              placeholder="+57 300 123 4567"
              icon={<Phone className="w-4 h-4" />}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <Input
            label="NIT"
            placeholder="123456789-0"
            icon={<FileText className="w-4 h-4" />}
            value={formData.nit}
            onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-primary-400" />
          Configuración de Impuestos
        </h3>
        <div className="space-y-4">
          <Input
            label="Porcentaje de IVA (%)"
            type="number"
            placeholder="19"
            value={formData.iva_porcentaje}
            onChange={(e) => setFormData({ ...formData, iva_porcentaje: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Printer className="w-5 h-5 text-primary-400" />
          Configuración de Impresión
        </h3>
        <div className="space-y-4">
          <Select
            label="Tipo de Impresora"
            value={formData.tipo_impresora}
            onChange={(e) => setFormData({ ...formData, tipo_impresora: e.target.value as '58mm' | '80mm' })}
            options={[
              { value: '58mm', label: 'Impresora Térmica 58mm' },
              { value: '80mm', label: 'Impresora Térmica 80mm' },
            ]}
          />
          <Input
            label="Símbolo de Moneda"
            placeholder="$"
            value={formData.moneda_simbolo}
            onChange={(e) => setFormData({ ...formData, moneda_simbolo: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() => updateMutation.mutate()}
          loading={updateMutation.isPending}
          icon={<Save className="w-4 h-4" />}
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
