import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Building, Camera, Edit2, Save } from 'lucide-react';
import { UserProfile } from '../App';
import { BottomNav } from './BottomNav';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'history' | 'statistics' | 'waiting-list' | 'settings') => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
}

export function Profile({ profile, onUpdateProfile, onNavigate, theme }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white">Meu Perfil</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isEditing ? <Save className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-3xl">{getInitials(profile.name)}</span>
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            {!isEditing && (
              <>
                <h2 className="text-gray-900 text-center">{profile.name}</h2>
                <p className="text-gray-600 text-center">{profile.role}</p>
              </>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
          <h3 className="text-gray-900">Informações</h3>

          {/* Nome */}
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>Nome Completo</span>
              </div>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 px-4 py-2.5">{profile.name}</p>
            )}
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span>Cargo</span>
              </div>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 px-4 py-2.5">{profile.role}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>E-mail</span>
              </div>
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 px-4 py-2.5">{profile.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>Telefone</span>
              </div>
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 px-4 py-2.5">{profile.phone}</p>
            )}
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-gray-700 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span>Departamento</span>
              </div>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 px-4 py-2.5">{profile.department}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentView="profile" onNavigate={onNavigate} />
    </div>
  );
}
