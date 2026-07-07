import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      });
    }
  };

  const inputClasses =
    'w-full rounded-2xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ' +
    'border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] ' +
    'focus:border-[var(--input-focus-border)] focus:ring-[var(--input-focus-ring)]';

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8 text-ink">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm"
      >
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-ink">Create account</h1>
        <p className="mb-6 text-sm text-ink-soft">Start organizing with TaskFlow.</p>

        {errors.root && (
          <p className="mb-4 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClasses}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
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

        <div className="mb-4">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={inputClasses}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          {errors.password && <span className="mt-1 block text-xs text-red-700">{errors.password.message}</span>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={inputClasses}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <span className="mt-1 block text-xs text-red-700">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:text-accent-deep">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
