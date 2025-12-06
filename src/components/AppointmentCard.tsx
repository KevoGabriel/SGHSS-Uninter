import { useState } from 'react';
import { Calendar, Clock, User, Phone, Stethoscope, Trash2, X, AlertCircle, CheckCircle, Mail, StickyNote, XCircle, CheckCheck, CreditCard, FileText } from 'lucide-react';
import { Appointment } from '../App';

interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onConfirmPresence: (id: string) => void;
  onMarkAsCompleted: (id: string) => void;
  onMarkAsNoShow: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
}

export function AppointmentCard({ 
  appointment, 
  onDelete, 
  onCancel, 
  onConfirmPresence,
  onMarkAsCompleted,
  onMarkAsNoShow,
  onAddNote 
}: AppointmentCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState(appointment.notes || '');
  const [showActions, setShowActions] = useState(false);

  const statusColors = {
    scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'no-show': 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const statusLabels = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Realizado',
    'no-show': 'Faltou'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.date === today;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(appointment.id);
    setShowDeleteModal(false);
  };

  const handleSaveNote = () => {
    onAddNote(appointment.id, noteText);
    setShowNoteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        {/* Header com Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full border ${statusColors[appointment.status]}`}>
              {statusLabels[appointment.status]}
            </span>
            {isToday() && appointment.status !== 'cancelled' && (
              <span className="px-3 py-1 rounded-full border bg-purple-100 text-purple-800 border-purple-300">
                Hoje
              </span>
            )}
            {appointment.presenceConfirmed && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Excluir agendamento"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Informações do Paciente */}
        <div className="space-y-2.5 mb-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Paciente</p>
              <p className="text-gray-900">{appointment.patientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-gray-500">CPF</p>
              <p className="text-gray-900">{appointment.patientCPF}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Telefone</p>
              <p className="text-gray-900">{appointment.patientPhone}</p>
            </div>
          </div>

          {appointment.patientEmail && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500">E-mail</p>
                <p className="text-gray-900">{appointment.patientEmail}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Stethoscope className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Médico</p>
              <p className="text-gray-900">{appointment.doctorName} - {appointment.specialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-gray-500">Motivo</p>
              <p className="text-gray-900">{appointment.reason}</p>
            </div>
          </div>
        </div>

        {/* Notas */}
        {appointment.notes && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-900">{appointment.notes}</p>
            </div>
          </div>
        )}

        {/* Data e Hora */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{appointment.time}</span>
          </div>
        </div>

        {/* Ações Rápidas */}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'no-show' && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-full py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200"
            >
              {showActions ? 'Ocultar Ações' : 'Mais Ações'}
            </button>
            
            {showActions && (
              <div className="grid grid-cols-2 gap-2">
                {!appointment.presenceConfirmed && (
                  <button
                    onClick={() => onConfirmPresence(appointment.id)}
                    className="py-2 px-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 flex items-center justify-center gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Confirmar
                  </button>
                )}
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="py-2 px-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors border border-yellow-200 flex items-center justify-center gap-2"
                >
                  <StickyNote className="w-4 h-4" />
                  Nota
                </button>
                {isToday() && (
                  <>
                    <button
                      onClick={() => onMarkAsCompleted(appointment.id)}
                      className="py-2 px-3 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Realizado
                    </button>
                    <button
                      onClick={() => onMarkAsNoShow(appointment.id)}
                      className="py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Faltou
                    </button>
                  </>
                )}
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="py-2 px-3 col-span-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  Cancelar Agendamento
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Nota */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-gray-900 mb-4">Adicionar Nota</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Digite observações sobre o agendamento..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-32 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowNoteModal(false); setNoteText(appointment.notes || ''); }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-900 text-center mb-2">
              Excluir Agendamento
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Tem certeza que deseja excluir o agendamento de <strong>{appointment.patientName}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}