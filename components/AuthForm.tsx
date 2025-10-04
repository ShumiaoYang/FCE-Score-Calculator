import React, { useState } from 'react';

interface AuthFormProps {
  onAuthSuccess: (username: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      if (isLoginView) {
        // Handle Login
        const users = JSON.parse(localStorage.getItem('fce_users') || '{}');
        const storedUser = users[username];

        // NOTE: In a real application, passwords would be hashed with a library like bcrypt on a server.
        // We use btoa/atob here for basic encoding to simulate the "encryption" requirement client-side.
        if (storedUser && atob(storedUser.password) === password) {
          onAuthSuccess(username);
        } else {
          setError('Invalid username or password.');
        }
      } else {
        // Handle Registration
        const users = JSON.parse(localStorage.getItem('fce_users') || '{}');
        if (users[username]) {
          setError('Username already exists. Please choose another.');
          return;
        }

        users[username] = { password: btoa(password) }; // Basic base64 encoding
        localStorage.setItem('fce_users', JSON.stringify(users));
        onAuthSuccess(username);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 p-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-sky-400">
          {isLoginView ? 'Welcome Back' : 'Create an Account'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              autoComplete={isLoginView ? "current-password" : "new-password"}
            />
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-300 transform hover:scale-105"
            >
              {isLoginView ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError(null);
            }}
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
