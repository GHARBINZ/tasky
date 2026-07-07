import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const inputClasses =
    'w-full rounded-2xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ' +
    'border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] ' +
    'focus:border-[var(--input-focus-border)] focus:ring-[var(--input-focus-ring)]';

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#F5F0E6] text-[#5D4E3A] dark:bg-[#1E1912] dark:text-[#EDE4D3]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-[#DCD0C0] bg-[#EAE2D6] p-8 shadow-sm dark:border-[#4A3F32] dark:bg-[#2B241C]"
      >
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-[#5D4E3A] dark:text-[#EDE4D3]">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-[#8A7D6A] dark:text-[#9A8B76]">
          Log in to your TaskFlow account.
        </p>

        {errors.root && (
          <p className="mb-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#5D4E3A] dark:text-[#EDE4D3]">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClasses}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email.message}</span>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#5D4E3A] dark:text-[#EDE4D3]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={inputClasses + ' pr-11'}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A38666] transition-colors hover:text-[#8A7057]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="mt-1 block text-xs text-red-700">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#A38666] px-4 py-2.5 text-sm font-semibold text-[#F5F0E6] transition-colors hover:bg-[#8A7057] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="mt-6 text-center text-sm text-[#8A7D6A]">
          No account?{' '}
          <Link to="/register" className="font-medium text-[#A38666] hover:text-[#8A7057]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
