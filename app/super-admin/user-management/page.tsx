'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Users, UserCheck, GraduationCap, Search, Plus, Trash2, ShieldCheck, Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'super-admin';
    status: 'active' | 'inactive';
    joinedAt: string;
}

export default function UserManagement() {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | User['role']>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<User['role']>('student');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                const list = (data.data ?? data).map((u: Record<string, unknown>) => ({
                    id: u.id as number,
                    name: u.name as string,
                    email: u.email as string,
                    role: (u.role as string) as User['role'],
                    status: (u.status as string) === 'active' ? 'active' : 'inactive',
                    joinedAt: (u.created_at as string)?.split('T')[0] ?? '',
                }));
                setUsers(list);
            } else {
                setError('Impossible de charger les utilisateurs.');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => setSearchQuery(query);

    const filtered = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Uniquement les apprenants (students) et pas de super-admin ni de teacher ici
        const isStudent = u.role === 'student';
        const matchesStatus = filterStatus === 'all' || u.status === filterStatus;

        return matchesSearch && isStudent && matchesStatus;
    });

    const handleAdd = () => {
        if (!newName.trim() || !newEmail.trim()) return;
        const newUser: User = {
            id: Date.now(),
            name: newName.trim(),
            email: newEmail.trim(),
            role: newRole,
            status: 'active',
            joinedAt: new Date().toISOString().split('T')[0],
        };
        setUsers((prev) => [...prev, newUser]);
        setNewName('');
        setNewEmail('');
        setNewRole('student');
        setIsAddOpen(false);
    };

    const handleEdit = () => {
        if (!editUser || !newName.trim() || !newEmail.trim()) return;
        setUsers((prev) =>
            prev.map((u) =>
                u.id === editUser.id ? { ...u, name: newName.trim(), email: newEmail.trim(), role: newRole } : u
            )
        );
        setEditUser(null);
        setNewName('');
        setNewEmail('');
        setNewRole('student');
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            setUsers((prev) => prev.filter((u) => u.id !== id));
        }
    };

    const toggleStatus = (id: number) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
        );
    };

    const openEdit = (user: User) => {
        setEditUser(user);
        setNewName(user.name);
        setNewEmail(user.email);
        setNewRole(user.role);
    };

    const getRoleBadge = (role: User['role']) => {
        switch (role) {
            case 'super-admin':
                return <Badge className="bg-violet-100 text-violet-800 border border-violet-200"><ShieldCheck className="w-3 h-3 mr-1" />Administrateur</Badge>;
            case 'teacher':
                return <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200"><UserCheck className="w-3 h-3 mr-1" />Enseignant</Badge>;
            case 'student':
                return <Badge className="bg-blue-100 text-blue-800 border border-blue-200"><GraduationCap className="w-3 h-3 mr-1" />Apprenant</Badge>;
        }
    };

    const studentsList = users.filter((u) => u.role === 'student');
    const totalApprenants = studentsList.length;
    const activeStudents = studentsList.filter((u) => u.status === 'active').length;
    const inactiveStudents = studentsList.filter((u) => u.status === 'inactive').length;
    const deletedOrRejected = 0; // Placeholder for future use or matching example layout count if needed

    return (
        <Layout role="super-admin" onSearch={handleSearch}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Gestion des apprenants</h2>
                        <p className="text-gray-600 mt-1">Gérez tous les élèves inscrits sur la plateforme</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Actualiser
                        </Button>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-violet-600 hover:bg-violet-700">
                                    <Plus className="w-4 h-4 mr-2" /> Ajouter un apprenant
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
                                <div className="bg-violet-600 p-6 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl text-white">Ajouter un apprenant</DialogTitle>
                                        <DialogDescription className="text-violet-100 opacity-90">
                                            Créer un nouveau compte élève
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="add-user-name" className="text-gray-700 font-medium">Nom complet</Label>
                                        <Input id="add-user-name" placeholder="EX: Jean Dupont" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-11 shadow-sm focus:ring-violet-500 focus:border-violet-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="add-user-email" className="text-gray-700 font-medium">Adresse e-mail</Label>
                                        <Input id="add-user-email" type="email" placeholder="jean@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="h-11 shadow-sm focus:ring-violet-500 focus:border-violet-500" />
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={handleAdd} className="w-full bg-violet-600 hover:bg-violet-700 h-11 text-base font-semibold transition-all hover:scale-[1.02] active:scale-95" disabled={!newName.trim() || !newEmail.trim()}>
                                            Créer le compte
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Erreur */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Total</p>
                                <p className="text-xl font-bold text-gray-900">{totalApprenants}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">En attente</p>
                                <p className="text-xl font-bold text-gray-900">{inactiveStudents}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Approuvés</p>
                                <p className="text-xl font-bold text-gray-900">{activeStudents}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Rejetés</p>
                                <p className="text-xl font-bold text-gray-900">{deletedOrRejected}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="active">Actifs</SelectItem>
                            <SelectItem value="inactive">Inactifs</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tableau */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des apprenants</CardTitle>
                        <CardDescription>{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
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
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-gray-600">{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.status === 'active' ? 'default' : 'secondary'}
                                                    className={user.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                                                >
                                                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{user.joinedAt}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* Activer / Désactiver */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => toggleStatus(user.id)}
                                                        className={`h-9 px-3 ${user.status === 'active'
                                                            ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
                                                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                                    >
                                                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                                                    </Button>

                                                    {/* Supprimer */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-9 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1.5" />
                                                        Supprimer
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {!isLoading && filtered.length === 0 && (
                            <div className="text-center py-16">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucun utilisateur trouvé</p>
                                <p className="text-gray-400 text-sm mt-1">Ajoutez des utilisateurs via le bouton ci-dessus</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
