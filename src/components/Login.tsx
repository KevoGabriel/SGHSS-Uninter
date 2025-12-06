import { useState } from 'react';
import { Hospital, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-full mb-4">
            <Hospital className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Sistema de Gestão Hospitalar e de Serviços de Saúde</h1>
          <p className="text-gray-600">VidaPlus</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-gray-900 mb-6">Login do Profissional</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Usuário */}
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Entrar
            </button>
          </form>

          {/* Link de Esqueci a Senha */}
          <div className="mt-4 text-center">
            <a href="#" className="text-cyan-600 hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600">
          <p>&copy; 2025 Kevin Sehnem - Uninter</p>
        </div>
      </div>
    </div>
  );
}