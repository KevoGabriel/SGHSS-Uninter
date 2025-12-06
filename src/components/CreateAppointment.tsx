import { useState } from 'react';
import { ArrowLeft, User, Phone, Stethoscope, Calendar, Clock, Check, Mail, AlertTriangle, FileText, CreditCard } from 'lucide-react';
import { Appointment } from '../App';

interface CreateAppointmentProps {
  onBack: () => void;
  onCreate: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  existingAppointments: Appointment[];
}

export function CreateAppointment({ onBack, onCreate, existingAppointments }: CreateAppointmentProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientCPF: '',
    patientPhone: '',
    patientEmail: '',
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    status: 'scheduled' as const,
    reason: '',
    notes: '',
    presenceConfirmed: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(false);

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

  const doctors = [
    { name: 'Dr. João Santos', specialty: 'Cardiologia' },
    { name: 'Dra. Ana Costa', specialty: 'Ortopedia' },
    { name: 'Dr. Pedro Lima', specialty: 'Pediatria' },
    { name: 'Dra. Maria Souza', specialty: 'Ginecologia' },
    { name: 'Dr. Carlos Ferreira', specialty: 'Dermatologia' },
    { name: 'Dra. Julia Alves', specialty: 'Oftalmologia' }
  ];

  const availableDoctors = doctors.filter(
    doc => !formData.specialty || doc.specialty === formData.specialty
  );

  // Verificar conflitos de horário
  const checkConflict = (date: string, time: string, doctor: string) => {
    return existingAppointments.some(apt => 
      apt.date === date && 
      apt.time === time && 
      apt.doctorName === doctor &&
      apt.status !== 'cancelled'
    );
  };

  const handleDateTimeChange = (field: 'date' | 'time', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (newFormData.date && newFormData.time && newFormData.doctorName) {
      const hasConflict = checkConflict(newFormData.date, newFormData.time, newFormData.doctorName);
      setConflictWarning(hasConflict);
    }
  };

  const handleDoctorChange = (doctor: string) => {
    setFormData({ ...formData, doctorName: doctor });
    
    if (formData.date && formData.time && doctor) {
      const hasConflict = checkConflict(formData.date, formData.time, doctor);
      setConflictWarning(hasConflict);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (conflictWarning) {
      const confirm = window.confirm('Já existe um agendamento neste horário. Deseja continuar?');
      if (!confirm) return;
    }
    
    onCreate(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 1500);
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

  const formatCPFInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPFInput(e.target.value);
    setFormData({ ...formData, patientCPF: formatted });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-cyan-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 hover:bg-cyan-700 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white">Novo Agendamento</h1>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados do Paciente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-gray-900 mb-4">Dados do Paciente</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="patientName" className="block text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="patientName"
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Digite o nome do paciente"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="patientCPF" className="block text-gray-700 mb-2">
                  CPF *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <input
                    id="patientCPF"
                    type="text"
                    value={formData.patientCPF}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="patientPhone" className="block text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="patientPhone"
                    type="tel"
                    value={formData.patientPhone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="patientEmail" className="block text-gray-700 mb-2">
                  E-mail (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="patientEmail"
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados da Consulta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-gray-900 mb-4">Dados da Consulta</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="specialty" className="block text-gray-700 mb-2">
                  Especialidade *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <select
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value, doctorName: '' })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Selecione a especialidade</option>
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="doctorName" className="block text-gray-700 mb-2">
                  Médico *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <select
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white"
                    required
                    disabled={!formData.specialty}
                  >
                    <option value="">Selecione o médico</option>
                    {availableDoctors.map(doc => (
                      <option key={doc.name} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleDateTimeChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-2">
                    Hora *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleDateTimeChange('time', e.target.value)}
                      className="w-full pl-10 pr-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Alerta de Conflito */}
              {conflictWarning && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-orange-900">
                    Já existe um agendamento para este médico neste horário.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="reason" className="block text-gray-700 mb-2">
                  Motivo da Consulta *
                </label>
                <textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Digite o motivo da consulta..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-gray-700 mb-2">
                  Observações (Opcional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Digite observações relevantes sobre o agendamento..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Sucesso */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">
              Agendamento Criado!
            </h3>
            <p className="text-gray-600">
              O agendamento foi registrado com sucesso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}