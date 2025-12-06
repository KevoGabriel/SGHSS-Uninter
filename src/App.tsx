import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CreateAppointment } from './components/CreateAppointment';
import { Profile } from './components/Profile';
import { Statistics } from './components/Statistics';
import { WaitingList } from './components/WaitingList';
import { Settings } from './components/Settings';

export interface Appointment {
  id: string;
  patientName: string;
  patientCPF: string;
  patientPhone: string;
  patientEmail?: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  reason: string;
  notes?: string;
  presenceConfirmed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WaitingListItem {
  id: string;
  patientName: string;
  patientPhone: string;
  specialty: string;
  preferredDate?: string;
  addedAt: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  department: string;
}

export interface AppSettings {
  notifications: boolean;
  autoConfirm: boolean;
  language: 'pt-BR';
}

type ViewType = 'dashboard' | 'create' | 'profile' | 'statistics' | 'waiting-list' | 'settings';

// LocalStorage keys
const STORAGE_KEYS = {
  APPOINTMENTS: 'hospital_appointments',
  WAITING_LIST: 'hospital_waiting_list',
  USER_PROFILE: 'hospital_user_profile',
  SETTINGS: 'hospital_settings',
  IS_LOGGED_IN: 'hospital_is_logged_in'
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  });
  
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      return JSON.parse(saved);
    }
    // Dados iniciais
    return [
      {
        id: '1',
        patientName: 'Maria Silva',
        patientCPF: '123.456.789-00',
        patientPhone: '(11) 98765-4321',
        patientEmail: 'maria.silva@email.com',
        doctorName: 'Dr. João Santos',
        specialty: 'Cardiologia',
        date: '2025-11-26',
        time: '09:00',
        status: 'confirmed',
        reason: 'Consulta de rotina',
        notes: 'Paciente com histórico de hipertensão',
        presenceConfirmed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        patientName: 'José Oliveira',
        patientCPF: '987.654.321-00',
        patientPhone: '(11) 97654-3210',
        doctorName: 'Dra. Ana Costa',
        specialty: 'Ortopedia',
        date: '2025-11-26',
        time: '10:30',
        status: 'scheduled',
        reason: 'Consulta de rotina',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        patientName: 'Carlos Mendes',
        patientCPF: '456.789.123-00',
        patientPhone: '(11) 96543-2109',
        doctorName: 'Dr. Pedro Lima',
        specialty: 'Pediatria',
        date: '2025-11-27',
        time: '14:00',
        status: 'scheduled',
        reason: 'Consulta de rotina',
        presenceConfirmed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        patientName: 'Ana Paula Santos',
        patientCPF: '789.123.456-00',
        patientPhone: '(11) 95432-1098',
        doctorName: 'Dra. Maria Souza',
        specialty: 'Ginecologia',
        date: '2025-11-20',
        time: '15:00',
        status: 'completed',
        reason: 'Consulta de rotina',
        notes: 'Consulta de rotina realizada',
        createdAt: new Date(2025, 10, 15).toISOString()
      }
    ];
  });

  const [waitingList, setWaitingList] = useState<WaitingListItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WAITING_LIST);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'w1',
        patientName: 'Roberto Alves',
        patientPhone: '(11) 94321-0987',
        specialty: 'Cardiologia',
        preferredDate: '2025-11-28',
        addedAt: new Date().toISOString()
      }
    ];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Dr. Carlos Alberto',
      role: 'Coordenador de Agendamentos',
      email: 'carlos.alberto@hospital.com.br',
      phone: '(11) 3456-7890',
      department: 'Recepção Central'
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      notifications: true,
      autoConfirm: false,
      language: 'pt-BR'
    };
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WAITING_LIST, JSON.stringify(waitingList));
  }, [waitingList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const handleCreateAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAppointments([...appointments, newAppointment]);
    setCurrentView('dashboard');
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates, updatedAt: new Date().toISOString() } : apt
    ));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const handleCancelAppointment = (id: string) => {
    handleUpdateAppointment(id, { status: 'cancelled' });
  };

  const handleConfirmPresence = (id: string) => {
    handleUpdateAppointment(id, { presenceConfirmed: true, status: 'confirmed' });
  };

  const handleMarkAsCompleted = (id: string) => {
    handleUpdateAppointment(id, { status: 'completed' });
  };

  const handleMarkAsNoShow = (id: string) => {
    handleUpdateAppointment(id, { status: 'no-show' });
  };

  const handleAddNote = (id: string, note: string) => {
    handleUpdateAppointment(id, { notes: note });
  };

  const handleAddToWaitingList = (item: Omit<WaitingListItem, 'id' | 'addedAt'>) => {
    const newItem: WaitingListItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString()
    };
    setWaitingList([...waitingList, newItem]);
  };

  const handleRemoveFromWaitingList = (id: string) => {
    setWaitingList(waitingList.filter(item => item.id !== id));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const commonProps = {
    onNavigate: setCurrentView,
    onLogout: handleLogout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <Dashboard
          {...commonProps}
          appointments={appointments}
          onCreateNew={() => setCurrentView('create')}
          onDelete={handleDeleteAppointment}
          onCancel={handleCancelAppointment}
          onConfirmPresence={handleConfirmPresence}
          onMarkAsCompleted={handleMarkAsCompleted}
          onMarkAsNoShow={handleMarkAsNoShow}
          onAddNote={handleAddNote}
        />
      )}
      
      {currentView === 'create' && (
        <CreateAppointment
          onBack={() => setCurrentView('dashboard')}
          onCreate={handleCreateAppointment}
          existingAppointments={appointments}
        />
      )}

      {currentView === 'profile' && (
        <Profile
          {...commonProps}
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {currentView === 'statistics' && (
        <Statistics
          {...commonProps}
          appointments={appointments}
        />
      )}

      {currentView === 'waiting-list' && (
        <WaitingList
          {...commonProps}
          waitingList={waitingList}
          onAddToWaitingList={handleAddToWaitingList}
          onRemoveFromWaitingList={handleRemoveFromWaitingList}
          onCreateAppointment={(item) => {
            setCurrentView('create');
          }}
        />
      )}

      {currentView === 'settings' && (
        <Settings
          {...commonProps}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </div>
  );
}