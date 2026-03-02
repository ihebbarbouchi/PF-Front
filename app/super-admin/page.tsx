'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Users, BookOpen, FolderOpen, CheckCircle, XCircle, UserCheck,
  GraduationCap, ShieldCheck, Loader2, AlertCircle, Clock, Plus, Edit,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

interface TeacherApplication {
  id: number;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'active' | 'rejected';
}

export default function SuperAdminDashboard() {
  const { token } = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Users
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  const categories: { id: number; name: string; resources: number; students: number }[] = [];

  // ── Charger tous les utilisateurs ──
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = (data.data ?? data).map((u: Record<string, unknown>) => ({
          id: u.id as number,
          name: u.name as string,
          email: u.email as string,
          role: u.role as string,
          status: u.status as string,
          joinedAt: (u.created_at as string)?.split('T')[0] ?? '',
        }));
        setUsers(list);
      } else {
        setUsersError('Impossible de charger les utilisateurs.');
      }
    } catch {
      setUsersError('Impossible de contacter le serveur.');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategory = () => {
    console.log('Adding category:', categoryName, categoryDescription);
    setCategoryName('');
    setCategoryDescription('');
  };

  // ── Badges ──
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-admin':
        return (
          <Badge className="bg-violet-100 text-violet-800 border border-violet-200">
            <ShieldCheck className="w-3 h-3 mr-1" />Administrateur
          </Badge>
        );
      case 'teacher':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3 h-3 mr-1" />Enseignant
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3 h-3 mr-1" />Apprenant
          </Badge>
        );
    }
  };

  // ── Stats ──
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const pendingTeachersCount = users.filter((u) => u.role === 'teacher' && u.status === 'pending').length;

  const stats = [
    { title: 'Total Apprenants', value: totalStudents, icon: GraduationCap, color: 'blue' },
    { title: 'Enseignants Actifs', value: users.filter((u) => u.role === 'teacher' && u.status === 'active').length, icon: UserCheck, color: 'green' },
    { title: 'Total Enseignants', value: totalTeachers, icon: Users, color: 'purple' },
    { title: 'En attente validation', value: pendingTeachersCount, icon: Clock, color: 'orange' },
  ];

  return (
    <Layout role="super-admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600 mt-1">Gérez les utilisateurs, les catégories et surveillez la plateforme</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    {usersLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400 mt-2" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Section Gestion Unifiée des Utilisateurs ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <CardTitle>Utilisateurs récents</CardTitle>
                <CardDescription>Aperçu des derniers apprenants et enseignants inscrits</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchUsers} disabled={usersLoading}>
                {usersLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Actualiser
              </Button>
              <Button size="sm" asChild className="bg-violet-600 hover:bg-violet-700">
                <a href="/super-admin/user-management">Voir tout</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {usersError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mx-6 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{usersError}</span>
              </div>
            )}
            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-7 h-7 animate-spin text-violet-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscrit le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter((u) => u.role !== 'super-admin')
                    .slice(0, 5) // Que les 5 derniers
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : user.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }
                          >
                            {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">{user.joinedAt}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
            {!usersLoading && users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Aucun utilisateur trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestion des catégories</CardTitle>
              <CardDescription>Gérer les catégories de ressources</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter une catégorie
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-blue-600 p-6 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-white">Ajouter une catégorie</DialogTitle>
                    <DialogDescription className="text-blue-100 opacity-90">
                      Créer une nouvelle catégorie pour organiser les ressources
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name" className="text-gray-700 font-medium">Nom de la catégorie</Label>
                    <Input
                      id="category-name"
                      placeholder="Ex : Programmation, Mathématiques"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="h-11 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description" className="text-gray-700 font-medium">Description</Label>
                    <Input
                      id="category-description"
                      placeholder="Brève description de la catégorie"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      className="h-11 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold transition-all hover:scale-[1.02] active:scale-95">
                      Créer la catégorie
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>{category.resources} ressources</p>
                      <p>{category.students} apprenants</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Gérer
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {categories.length === 0 && (
                <div className="col-span-4 text-center py-8">
                  <FolderOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Aucune catégorie créée.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unused but kept for reference */}
        <div style={{ display: 'none' }}>
          <BookOpen />
        </div>
      </div>
    </Layout>
  );
}
