'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  BookOpen,
  FolderOpen,
  PlusCircle,
  Users,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Search,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  role: 'super-admin' | 'teacher' | 'student';
  onSearch?: (query: string) => void;
}

export function Layout({ children, role, onSearch }: LayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown en cliquant dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const getNavItems = () => {
    switch (role) {
      case 'super-admin':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/super-admin' },
          { icon: Users, label: 'Gestion des utilisateurs', path: '/super-admin/user-management' },
          { icon: FolderOpen, label: 'Catégories', path: '/super-admin/categories' },
          { icon: BarChart3, label: 'Statistiques', path: '/super-admin' },
        ];
      case 'teacher':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/teacher' },
          { icon: BookOpen, label: 'Mes ressources', path: '/teacher/resources' },
          { icon: PlusCircle, label: 'Ajouter une ressource', path: '/add-resource' },
          { icon: FolderOpen, label: 'Catégories', path: '/teacher/categories' },
          { icon: Users, label: 'Mes apprenants', path: '/teacher/students' },
        ];
      case 'student':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/student' },
          { icon: FolderOpen, label: 'Catégories', path: '/student/categories' },
          { icon: BookOpen, label: 'Ressources', path: '/student/resources' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // Infos utilisateur
  const userName = user?.name || (role === 'super-admin' ? 'Super Admin' : role === 'teacher' ? 'Enseignant' : 'Apprenant');
  const userEmail = user?.email || 'utilisateur@edushare.com';
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : role === 'super-admin' ? 'SA' : role === 'teacher' ? 'E' : 'A';

  const roleLabel =
    role === 'super-admin' ? 'Administrateur' :
      role === 'teacher' ? 'Enseignant' :
        'Apprenant';

  const accentColor =
    role === 'super-admin' ? 'violet' :
      role === 'teacher' ? 'emerald' :
        'blue';

  const activeClass =
    role === 'super-admin' ? 'bg-violet-600 text-white font-semibold shadow-sm' :
      role === 'teacher' ? 'bg-emerald-600 text-white font-semibold shadow-sm' :
        'bg-blue-600 text-white font-semibold shadow-sm';

  const hoverClass =
    role === 'super-admin' ? 'text-gray-700 hover:bg-violet-50 hover:text-violet-600' :
      role === 'teacher' ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' :
        'text-gray-700 hover:bg-blue-50 hover:text-blue-600';

  const avatarBg =
    role === 'super-admin' ? 'bg-violet-100' :
      role === 'teacher' ? 'bg-emerald-100' :
        'bg-blue-100';

  const avatarText =
    role === 'super-admin' ? 'text-violet-700' :
      role === 'teacher' ? 'text-emerald-700' :
        'text-blue-700';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 border-b border-gray-200" style={{ minHeight: '72px', paddingTop: '14px', paddingBottom: '14px' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${accentColor}-600 rounded-xl flex items-center justify-center shadow-lg shadow-${accentColor}-200`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold text-gray-900 tracking-tight`}>EduShare</h1>
                <p className={`text-[10px] font-bold uppercase tracking-wider text-${accentColor}-600 opacity-80`}>
                  {role === 'super-admin'
                    ? "Administration"
                    : role === 'teacher'
                      ? "Enseignant"
                      : "Apprenant"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${isActive ? activeClass : hoverClass
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-white opacity-80" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
          {/* Burger mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher des ressources, cours, catégories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 w-full h-9 text-sm"
              />
            </div>
          </div>

          {/* Profil utilisateur + Logout — droite */}
          <div className="ml-auto flex items-center gap-3 flex-shrink-0" ref={dropdownRef}>
            {/* Bouton avatar / profil */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-xs font-bold ${avatarText}`}>{userInitials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">{userName}</p>
                <p className={`text-xs font-medium text-${accentColor}-600 leading-tight`}>{roleLabel}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-14 right-4 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[100]">
                {/* Info utilisateur */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-sm font-bold ${avatarText}`}>{userInitials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>
                {/* Déconnexion */}
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
