import { ArrowLeft, TrendingUp, Calendar, Users, Clock, Download } from 'lucide-react';
import { Appointment } from '../App';
import { BottomNav } from './BottomNav';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface StatisticsProps {
  appointments: Appointment[];
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'history' | 'statistics' | 'waiting-list' | 'settings') => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export function Statistics({ appointments, onNavigate, theme }: StatisticsProps) {
  // Estatísticas gerais
  const totalAppointments = appointments.length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const noShow = appointments.filter(a => a.status === 'no-show').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;
  const active = appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;

  // Taxa de comparecimento
  const attendanceRate = totalAppointments > 0
    ? ((completed / (completed + noShow + cancelled)) * 100).toFixed(1)
    : '0';

  // Agendamentos por especialidade
  const specialtyCount: Record<string, number> = {};
  appointments.forEach(apt => {
    specialtyCount[apt.specialty] = (specialtyCount[apt.specialty] || 0) + 1;
  });

  const specialtyData = Object.entries(specialtyCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Agendamentos por status (para gráfico de pizza)
  const statusData = [
    { name: 'Realizados', value: completed, color: '#3B82F6' },
    { name: 'Ativos', value: active, color: '#10B981' },
    { name: 'Cancelados', value: cancelled, color: '#EF4444' },
    { name: 'Faltas', value: noShow, color: '#6B7280' }
  ].filter(item => item.value > 0);

  // Agendamentos dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyData = last7Days.map(date => {
    const count = appointments.filter(apt => apt.date === date).length;
    const dayName = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' });
    return { name: dayName, agendamentos: count };
  });

  const handleExport = () => {
    const data = {
      totalAppointments,
      completed,
      noShow,
      cancelled,
      active,
      attendanceRate,
      specialtyData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white">Estatísticas</h1>
          </div>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            title="Exportar relatório"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-gray-900">{totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500">Taxa</p>
                <p className="text-gray-900">{attendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Realizados</p>
                <p className="text-gray-900">{completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500">Ativos</p>
                <p className="text-gray-900">{active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Agendamentos por Dia */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Últimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="agendamentos" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Status */}
        {statusData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Especialidades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Top Especialidades</h3>
          <div className="space-y-3">
            {specialtyData.map((item, index) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.value / totalAppointments) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Detalhado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Resumo Detalhado</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Total de Agendamentos</span>
              <span className="text-gray-900">{totalAppointments}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Consultas Realizadas</span>
              <span className="text-blue-600">{completed}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Agendamentos Ativos</span>
              <span className="text-green-600">{active}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Cancelados</span>
              <span className="text-red-600">{cancelled}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Faltas (No-show)</span>
              <span className="text-gray-600">{noShow}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Taxa de Comparecimento</span>
              <span className="text-green-600">{attendanceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentView="statistics" onNavigate={onNavigate} />
    </div>
  );
}
