import { useState } from 'react';
import { Plus, LogOut, Calendar, Clock, User, Phone, Stethoscope, Search, Filter, Menu, BarChart3, Users, Settings as SettingsIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Appointment } from '../App';
import { AppointmentCard } from './AppointmentCard';
import { BottomNav } from './BottomNav';

interface DashboardProps {
  appointments: Appointment[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onConfirmPresence: (id: string) => void;
  onMarkAsCompleted: (id: string) => void;
  onMarkAsNoShow: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'statistics' | 'waiting-list' | 'settings') => void;
}

export function Dashboard({ 
  appointments, 
  onCreateNew, 
  onDelete, 
  onCancel, 
  onConfirmPresence,
  onMarkAsCompleted,
  onMarkAsNoShow,
  onAddNote,
  onLogout, 
  onNavigate
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'confirmed' | 'cancelled'>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

  // Filtrar apenas agendamentos futuros ou de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + 'T00:00:00');
    return aptDate >= today && apt.status !== 'completed' && apt.status !== 'no-show';
  });

  const filteredAppointments = activeAppointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: activeAppointments.length,
    scheduled: activeAppointments.filter(a => a.status === 'scheduled').length,
    confirmed: activeAppointments.filter(a => a.status === 'confirmed').length,
    cancelled: activeAppointments.filter(a => a.status === 'cancelled').length
  };

  // Agendamentos de hoje que precisam de atenção
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = activeAppointments.filter(apt => apt.date === todayDate);
  const needsConfirmation = todayAppointments.filter(apt => !apt.presenceConfirmed && apt.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-cyan-600 text-white sticky top-0 z-10 shadow-lg transition-all duration-300">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white">Agendamentos</h1>
              <p className="text-cyan-100">Vida Plus</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className="p-2 hover:bg-cyan-700 rounded-lg transition-colors"
                aria-label={isHeaderExpanded ? "Recolher header" : "Expandir header"}
              >
                {isHeaderExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-cyan-700 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo Colapsável */}
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              isHeaderExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Barra de Busca */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente ou médico..."
                className="w-full pl-10 pr-4 py-2.5 bg-cyan-700 text-white placeholder-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cyan-700 rounded-lg p-3">
                <p className="text-cyan-200 mb-1">Total Ativo</p>
                <p className="text-white">{stats.total}</p>
              </div>
              <div className="bg-cyan-700 rounded-lg p-3">
                <p className="text-cyan-200 mb-1">Confirmados</p>
                <p className="text-white">{stats.confirmed}</p>
              </div>
              <div className="bg-cyan-700 rounded-lg p-3">
                <p className="text-cyan-200 mb-1">Agendados</p>
                <p className="text-white">{stats.scheduled}</p>
              </div>
              <div className="bg-cyan-700 rounded-lg p-3">
                <p className="text-cyan-200 mb-1">Hoje</p>
                <p className="text-white">{todayAppointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo quando colapsado */}
        {!isHeaderExpanded && (
          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-cyan-100">Total: {stats.total}</span>
              <span className="text-cyan-100">Hoje: {todayAppointments.length}</span>
            </div>
            <span className="text-cyan-100">Confirmados: {stats.confirmed}</span>
          </div>
        )}
      </div>

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-56" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { onNavigate('profile'); setShowMenu(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <User className="w-5 h-5" />
              Meu Perfil
            </button>
            <button
              onClick={() => { onNavigate('statistics'); setShowMenu(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <BarChart3 className="w-5 h-5" />
              Estatísticas
            </button>
            <button
              onClick={() => { onNavigate('waiting-list'); setShowMenu(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Users className="w-5 h-5" />
              Lista de Espera
            </button>
            <button
              onClick={() => { onNavigate('settings'); setShowMenu(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <SettingsIcon className="w-5 h-5" />
              Configurações
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={() => { onLogout(); setShowMenu(false); }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Alertas de Confirmação */}
      {needsConfirmation.length > 0 && (
        <div className="p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-yellow-900">
                  <strong>{needsConfirmation.length}</strong> agendamento(s) de hoje aguardando confirmação de presença
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'scheduled'
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Agendados
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'confirmed'
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Cancelados
          </button>
        </div>

        {/* Lista de Agendamentos */}
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={onDelete}
                onCancel={onCancel}
                onConfirmPresence={onConfirmPresence}
                onMarkAsCompleted={onMarkAsCompleted}
                onMarkAsNoShow={onMarkAsNoShow}
                onAddNote={onAddNote}
              />
            ))
          )}
        </div>
      </div>

      {/* Botão Flutuante de Criar */}
      <button
        onClick={onCreateNew}
        className="fixed bottom-20 right-6 bg-cyan-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-cyan-700 transition-all hover:scale-110 flex items-center justify-center z-20"
        aria-label="Novo agendamento"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav currentView="dashboard" onNavigate={onNavigate} />
    </div>
  );
}