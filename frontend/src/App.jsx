import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoApp from './pages/TodoApp';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component (redirects to /todos if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to="/todos" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/todos" element={<ProtectedRoute><TodoApp /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/todos" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
