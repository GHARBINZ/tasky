import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#EAE2D6',
            color: '#5D4E3A',
            border: '1px solid #DCD0C0',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '10px 14px',
            boxShadow: '0 4px 16px rgba(93, 78, 58, 0.12)',
          },
          success: {
            iconTheme: { primary: '#A38666', secondary: '#F5F0E6' },
          },
          error: {
            iconTheme: { primary: '#b45f4d', secondary: '#F5F0E6' },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
