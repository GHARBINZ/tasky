import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Save, X } from 'lucide-react';
import Spinner from './Spinner.jsx';
import { suggestCategory, CATEGORIES } from '../utils/categorize.js';

const emptyTask = { title: '', description: '', deadline: '', status: 'pending', category: 'Personal' };

const TaskForm = ({ onSubmit, initialValues = null, onCancel }) => {
  const isEditing = Boolean(initialValues);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: emptyTask });

  const userTouchedCategory = useRef(false);
  const title = watch('title');

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || '',
        description: initialValues.description || '',
        deadline: initialValues.deadline ? initialValues.deadline.slice(0, 10) : '',
        status: initialValues.status || 'pending',
        category: initialValues.category || 'Personal',
      });
      userTouchedCategory.current = false;
    } else {
      reset(emptyTask);
      userTouchedCategory.current = false;
    }
  }, [initialValues, reset]);

  useEffect(() => {
    if (!userTouchedCategory.current && !isEditing) {
      setValue('category', suggestCategory(title));
    }
  }, [title, setValue, isEditing]);

  const submit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      deadline: values.deadline || undefined,
      status: values.status,
      category: values.category,
    };
    await onSubmit(payload);
    if (!isEditing) reset(emptyTask);
  };

  const inputClasses =
    "w-full rounded-2xl border px-4 py-2.5 text-sm transition-all duration-200 " +
    "border-[#C4B7A6] bg-[#F5F0E6] text-[#3E362E] placeholder:text-[#8C7B6A] " +
    "focus:outline-none focus:ring-2 focus:ring-[#A38666] focus:border-transparent " +
    "focus:ring-offset-2 focus:ring-offset-[#EAE2D6] " +
    "dark:border-[#4A3F32] dark:bg-[#2B241C] dark:text-[#EAE2D6] dark:placeholder:text-[#6B5F52] " +
    "dark:focus:ring-offset-[#2B241C]";

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      <div>
        <input
          placeholder="Task title"
          className={inputClasses}
          {...register('title', {
            required: 'Title is required',
            maxLength: { value: 120, message: 'Max 120 characters' },
          })}
        />
        {errors.title && (
          <span className="mt-1 block text-xs text-red-600">{errors.title.message}</span>
        )}
      </div>

      <textarea
        placeholder="Description (optional)"
        rows={2}
        className={inputClasses + ' resize-none'}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <input type="date" className={inputClasses} {...register('deadline')} />
        <select className={inputClasses} {...register('status')}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#5D4E3A]">
          Category
          <span className="ml-1 text-xs font-normal text-[#8A7D6A]">(auto-suggested)</span>
        </label>
        <select
          className={inputClasses}
          {...register('category')}
          onChange={(e) => {
            userTouchedCategory.current = true;
            setValue('category', e.target.value);
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Spinner size={16} />
          ) : isEditing ? (
            <Save size={16} />
          ) : (
            <Plus size={16} />
          )}
          {isSubmitting ? (isEditing ? 'Saving...' : 'Adding...') : isEditing ? 'Save changes' : 'Add Task'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-line"
          >
            <X size={16} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
