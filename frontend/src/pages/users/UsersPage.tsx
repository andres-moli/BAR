import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Eye, EyeOff, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersService } from '@/services/users';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User as UserType, UserRole } from '@/types';
import { formatDateTime } from '@/utils/format';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '@/utils/constants';
import { handleError } from '@/utils/errorHandler';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', rol: 'mesero' as UserRole,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => usersService.getAll({ page, limit: 15 }),
  });

  const createMutation = useMutation({
    // @ts-ignore
    mutationFn: () => usersService.create({ ...formData, full_name: formData.nombre, role: formData.rol as UserRole, activo: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al crear usuario'),
  });

  const updateMutation = useMutation({
    mutationFn: () => usersService.update(editingUser!.id, formData.password ? formData : { nombre: formData.nombre, email: formData.email, rol: formData.rol }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado');
      closeModal();
    },
    onError: (err) => handleError(err, 'Error al actualizar usuario'),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => usersService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Estado actualizado');
    },
    onError: (err) => handleError(err, 'Error al actualizar estado'),
  });

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'mesero' });
    setShowModal(true);
  };

  const openEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({ nombre: user.nombre, email: user.email, password: '', rol: user.rol });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'mesero' });
  };

  const columns: Column<UserType>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (u) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-400" />
        </div>
        <span className="font-medium text-white">{u.nombre}</span>
      </div>
    )},
    { key: 'email', header: 'Email', render: (u) => <span className="text-dark-300 text-xs">{u.email}</span> },
    { key: 'rol', header: 'Rol', render: (u) => (
      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${USER_ROLE_COLORS[u.rol] || ''}`}>
        {USER_ROLE_LABELS[u.rol] || u.rol}
      </span>
    )},
    { key: 'activo', header: 'Estado', render: (u) => <StatusBadge status={u.activo ? 'disponible' : 'cancelada'} label={u.activo ? 'Activo' : 'Inactivo'} /> },
    { key: 'ultimo_acceso', header: 'Último Acceso', render: (u: any) => (
      <span className="text-dark-400 text-xs">{u.ultimo_acceso ? formatDateTime(u.ultimo_acceso) : 'Nunca'}</span>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-dark-400 text-sm mt-1">{data?.total || 0} usuarios registrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(u) => u.id}
        loading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        total={data?.total}
        onPageChange={setPage}
        actions={(user) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate(user.id)}>
              {user.activo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button onClick={() => (editingUser ? updateMutation : createMutation).mutate()}
              loading={editingUser ? updateMutation.isPending : createMutation.isPending}>
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" placeholder="Nombre completo" value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          <Input label="Email" type="email" placeholder="usuario@barpos.com" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label={editingUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
            type="password" placeholder="••••••••" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <Select label="Rol" value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value as UserRole })}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'mesero', label: 'Mesero' },
              { value: 'cajero', label: 'Cajero' },
              { value: 'cocina', label: 'Cocina' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
