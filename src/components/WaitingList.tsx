import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Calendar, User, Phone, Stethoscope, AlertCircle } from 'lucide-react';
import { WaitingListItem } from '../App';
import { BottomNav } from './BottomNav';

interface WaitingListProps {
  waitingList: WaitingListItem[];
  onAddToWaitingList: (item: Omit<WaitingListItem, 'id' | 'addedAt'>) => void;
  onRemoveFromWaitingList: (id: string) => void;
  onCreateAppointment: (item: WaitingListItem) => void;
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'history' | 'statistics' | 'waiting-list' | 'settings') => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export function WaitingList({
  waitingList,
  onAddToWaitingList,
  onRemoveFromWaitingList,
  onCreateAppointment,
  onNavigate,
  theme
}: WaitingListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    specialty: '',
    preferredDate: ''
  });

  const specialties = [
    'Cardiologia',
    'Ortopedia',
    'Pediatria',
    'Ginecologia',
    'Dermatologia',
    'Oftalmologia',
    'Neurologia',
    'Psiquiatria'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToWaitingList(formData);
    setFormData({
      patientName: '',
      patientPhone: '',
      specialty: '',
      preferredDate: ''
    });
    setShowAddModal(false);
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData({ ...formData, patientPhone: formatted });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysWaiting = (addedAt: string) => {
    const added = new Date(addedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - added.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-white">Lista de Espera</h1>
              <p className="text-blue-100">{waitingList.length} paciente(s)</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {waitingList.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Lista de espera vazia</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar Paciente
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {waitingList.map(item => {
              const daysWaiting = getDaysWaiting(item.addedAt);
              const isUrgent = daysWaiting > 7;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm border p-4 ${
                    isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  {isUrgent && (
                    <div className="flex items-center gap-2 mb-3 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Aguardando há {daysWaiting} dias</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Paciente</p>
                        <p className="text-gray-900">{item.patientName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Telefone</p>
                        <p className="text-gray-900">{item.patientPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Especialidade</p>
                        <p className="text-gray-900">{item.specialty}</p>
                      </div>
                    </div>

                    {item.preferredDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500">Data Preferida</p>
                          <p className="text-gray-900">{formatDate(item.preferredDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onCreateAppointment(item)}
                      className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Criar Agendamento
                    </button>
                    <button
                      onClick={() => onRemoveFromWaitingList(item.id)}
                      className="py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Adicionar à Lista de Espera */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Adicionar à Lista de Espera</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="patientName" className="block text-gray-700 mb-2">
                  Nome do Paciente *
                </label>
                <input
                  id="patientName"
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="patientPhone" className="block text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  id="patientPhone"
                  type="tel"
                  value={formData.patientPhone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-gray-700 mb-2">
                  Especialidade *
                </label>
                <select
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione a especialidade</option>
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-gray-700 mb-2">
                  Data Preferida (Opcional)
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav currentView="waiting-list" onNavigate={onNavigate} />
    </div>
  );
}
