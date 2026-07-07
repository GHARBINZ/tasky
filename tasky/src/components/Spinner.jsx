import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 16, className = '' }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

export default Spinner;
