import { Home, Users, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'create' | 'profile' | 'statistics' | 'waiting-list' | 'settings') => void;
}

export function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'waiting-list', label: 'Espera', icon: Users },
    { id: 'statistics', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Config', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-cyan-600 bg-cyan-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}