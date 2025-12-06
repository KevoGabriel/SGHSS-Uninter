import { ArrowLeft, Bell, BellOff, Trash2, Download, Upload } from 'lucide-react';
import { AppSettings } from '../App';
import { BottomNav } from './BottomNav';
import { useState } from 'react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'statistics' | 'waiting-list' | 'settings') => void;
  onLogout: () => void;
}

export function Settings({ settings, onUpdateSettings, onNavigate, onLogout }: SettingsProps) {
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const handleToggleNotifications = () => {
    onUpdateSettings({
      ...settings,
      notifications: !settings.notifications
    });
  };

  const handleToggleAutoConfirm = () => {
    onUpdateSettings({
      ...settings,
      autoConfirm: !settings.autoConfirm
    });
  };

  const handleClearData = () => {
    // Limpar dados do localStorage (exceto configurações)
    localStorage.removeItem('hospital_appointments');
    localStorage.removeItem('hospital_waiting_list');
    localStorage.removeItem('hospital_user_profile');
    setShowClearDataModal(false);
    // Recarregar página para aplicar mudanças
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      appointments: localStorage.getItem('hospital_appointments'),
      waitingList: localStorage.getItem('hospital_waiting_list'),
      userProfile: localStorage.getItem('hospital_user_profile'),
      settings: localStorage.getItem('hospital_settings'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-hospital-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.appointments) localStorage.setItem('hospital_appointments', data.appointments);
            if (data.waitingList) localStorage.setItem('hospital_waiting_list', data.waitingList);
            if (data.userProfile) localStorage.setItem('hospital_user_profile', data.userProfile);
            if (data.settings) localStorage.setItem('hospital_settings', data.settings);
            alert('Dados importados com sucesso! A página será recarregada.');
            window.location.reload();
          } catch (error) {
            alert('Erro ao importar dados. Verifique o arquivo.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-cyan-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white">Configurações</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Notificações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Notificações</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {settings.notifications ? (
                  <Bell className="w-5 h-5 text-cyan-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-gray-900">Notificações Push</p>
                  <p className="text-gray-500">Receber alertas de agendamentos</p>
                </div>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.notifications ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-gray-900">Confirmação Automática</p>
                  <p className="text-gray-500">Confirmar agendamentos automaticamente</p>
                </div>
              </div>
              <button
                onClick={handleToggleAutoConfirm}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.autoConfirm ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoConfirm ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Backup e Dados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Backup e Dados</h3>
          
          <div className="space-y-2">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <p className="text-gray-900">Exportar Dados</p>
                  <p className="text-gray-500">Fazer backup dos seus dados</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleImportData}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <p className="text-gray-900">Importar Dados</p>
                  <p className="text-gray-500">Restaurar backup anterior</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowClearDataModal(true)}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-red-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-red-600">Limpar Todos os Dados</p>
                  <p className="text-gray-500">Remover agendamentos e configurações</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Informações</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between py-2">
              <span>Versão do Sistema</span>
              <span className="text-gray-900">0.0.18</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span>Última Atualização</span>
              <span className="text-gray-900">08/12/2025</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span>Ambiente</span>
              <span className="text-gray-900">Desenvolvimento</span>
            </div>
          </div>
        </div>

        {/* Botão de Sair */}
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sair da Conta
        </button>
      </div>

      {/* Modal de Confirmação de Limpar Dados */}
      {showClearDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-900 text-center mb-2">
              Limpar Todos os Dados
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Esta ação irá remover todos os agendamentos, lista de espera e perfil.
              As configurações serão mantidas. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDataModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Limpar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentView="settings" onNavigate={onNavigate} />
    </div>
  );
}