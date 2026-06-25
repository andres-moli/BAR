import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsService } from '@/services/products';
import { categoriesService } from '@/services/categories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

const productSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  categoria_id: z.coerce.number({ required_error: 'Seleccione una categoría' }),
  precio: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  costo: z.coerce.number().min(0, 'El costo no puede ser negativo'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
  activo: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(parseInt(id!)),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { nombre: '', categoria_id: 0, precio: 0, costo: 0, stock: 0, descripcion: '', imagen: '', activo: true },
  });

  useEffect(() => {
    if (product) {
      reset({
        nombre: product.nombre,
        categoria_id: product.categoria_id,
        precio: product.precio,
        costo: product.costo,
        stock: product.stock,
        descripcion: product.descripcion,
        imagen: product.imagen || '',
        activo: product.activo,
      });
    }
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: (data: ProductForm) => productsService.create({
      nombre: data.nombre,
      name: data.nombre,
      categoria_id: data.categoria_id,
      categoryId: String(data.categoria_id),
      precio: data.precio,
      price: data.precio,
      costo: data.costo,
      stock: data.stock,
      descripcion: data.descripcion || '',
      description: data.descripcion || '',
      imagen: data.imagen || null,
      image: data.imagen || null,
      activo: data.activo,
      is_active: data.activo,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
      navigate('/products');
    },
    onError: () => toast.error('Error al crear producto'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductForm) => productsService.update(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado');
      navigate('/products');
    },
    onError: () => toast.error('Error al actualizar producto'),
  });

  const onSubmit = async (data: ProductForm) => {
    if (isEditing) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  if (isEditing && productLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
          <p className="text-dark-400 text-sm mt-1">{isEditing ? `Editando "${product?.nombre}"` : 'Complete los campos para crear un nuevo producto'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Producto"
              placeholder="Ej: Cerveza Club Colombia"
              error={errors.nombre?.message}
              {...register('nombre')}
            />
            <Select
              label="Categoría"
              placeholder="Seleccione una categoría"
              options={(categories || []).filter((c) => c.activo).map((c) => ({ value: c.id, label: c.nombre }))}
              error={errors.categoria_id?.message}
              {...register('categoria_id')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Precio de Venta"
              type="number"
              placeholder="0"
              error={errors.precio?.message}
              {...register('precio')}
            />
            <Input
              label="Costo"
              type="number"
              placeholder="0"
              error={errors.costo?.message}
              {...register('costo')}
            />
            <Input
              label="Stock"
              type="number"
              placeholder="0"
              error={errors.stock?.message}
              {...register('stock')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Descripción</label>
            <textarea
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 min-h-[80px] resize-y"
              placeholder="Descripción del producto..."
              {...register('descripcion')}
            />
          </div>

          <Input
            label="URL de Imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            icon={<Image className="w-4 h-4" />}
            error={errors.imagen?.message}
            {...register('imagen')}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
              {...register('activo')}
            />
            <label htmlFor="activo" className="text-sm text-dark-300">Producto activo</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-700">
            <Button variant="secondary" type="button" onClick={() => navigate('/products')}>
              Cancelar
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending} icon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
