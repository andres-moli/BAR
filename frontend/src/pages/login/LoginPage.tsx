import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<'email' | 'code'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (mode === 'code') {
        if (code.length !== 4 || !/^\d{4}$/.test(code)) {
          setError('El código debe ser de 4 dígitos');
          setLoading(false);
          return;
        }
        await login({ code });
      } else {
        if (!email || !password) {
          setError('Ingrese email y contraseña');
          setLoading(false);
          return;
        }
        await login({ email, password });
      }
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-2xl bg-white/10">
            <img src="/logo-bar.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white">Pal DM</h1>
          <p className="text-dark-400 mt-1">Boutique Licores</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex mb-6 bg-dark-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'email' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
            >
              <Mail className="w-4 h-4 inline mr-1.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'code' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'}`}
            >
              <Key className="w-4 h-4 inline mr-1.5" />
              Código
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'email' ? (
              <>
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@barpos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />

                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <Input
                  label="Código de 4 dígitos"
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  icon={<Key className="w-4 h-4" />}
                />
                <p className="text-xs text-dark-500 mt-1">Ingrese su código único de 4 dígitos</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-dark-500 text-xs">
          BarPOS v1.0 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
