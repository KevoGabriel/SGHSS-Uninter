import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Filter, Search } from 'lucide-react';
import { Appointment } from '../App';
import { BottomNav } from './BottomNav';

interface HistoryProps {
  appointments: Appointment[];
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'history' | 'statistics' | 'waiting-list' | 'settings') => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export function History({ appointments, onNavigate, theme }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'no-show' | 'cancelled'>('all');

  // Filtrar apenas agendamentos passados ou completos
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const historicalAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + 'T00:00:00');
    return aptDate < today || apt.status === 'completed' || apt.status === 'no-show';
  });

  const filteredAppointments = historicalAppointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Ordenar por data (mais recente primeiro)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB.getTime() - dateA.getTime();
  });

  const stats = {
    total: historicalAppointments.length,
    completed: historicalAppointments.filter(a => a.status === 'completed').length,
    noShow: historicalAppointments.filter(a => a.status === 'no-show').length,
    cancelled: historicalAppointments.filter(a => a.status === 'cancelled').length
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const statusColors = {
    completed: 'bg-blue-100 text-blue-800 border-blue-300',
    'no-show': 'bg-gray-100 text-gray-800 border-gray-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusLabels = {
    completed: 'Realizado',
    'no-show': 'Faltou',
    cancelled: 'Cancelado',
    scheduled: 'Agendado',
    confirmed: 'Confirmado'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white">Histórico</h1>
          </div>

          {/* Barra de Busca */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no histórico..."
              className="w-full pl-10 pr-4 py-2.5 bg-blue-700 text-white placeholder-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-blue-200 mb-1">Total</p>
              <p className="text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-blue-200 mb-1">Realizados</p>
              <p className="text-white">{stats.completed}</p>
            </div>
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-blue-200 mb-1">Faltas</p>
              <p className="text-white">{stats.noShow}</p>
            </div>
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-blue-200 mb-1">Cancelados</p>
              <p className="text-white">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Realizados
          </button>
          <button
            onClick={() => setFilterStatus('no-show')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'no-show'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Faltas
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Cancelados
          </button>
        </div>

        {/* Lista de Histórico */}
        <div className="space-y-3">
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </div>
          ) : (
            sortedAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full border ${statusColors[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appointment.date)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{appointment.time}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900">{appointment.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{appointment.doctorName} - {appointment.specialty}</span>
                  </div>
                  {appointment.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav currentView="history" onNavigate={onNavigate} />
    </div>
  );
}
