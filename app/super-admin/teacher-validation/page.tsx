'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { CheckCircle, XCircle, Clock, Eye, Search, UserCheck, Users, Loader2, AlertCircle, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

interface TeacherApplication {
    id: number;
    name: string;
    email: string;
    date: string;
    status: 'pending' | 'active' | 'rejected';
}

export default function TeacherValidation() {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherApplication | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [applications, setApplications] = useState<TeacherApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState('');

    // Charger les demandes d'enseignants depuis le backend
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/admin/pending-teachers`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                // Adapter le format selon la réponse de l'API
                const list = (data.data ?? data).map((u: Record<string, unknown>) => ({
                    id: u.id as number,
                    name: u.name as string,
                    email: u.email as string,
                    date: (u.created_at as string)?.split('T')[0] ?? '',
                    status: (u.status as string) === 'active' ? 'active'
                        : (u.status as string) === 'rejected' ? 'rejected'
                            : 'pending',
                }));
                setApplications(list);
            } else {
                setError('Impossible de charger les demandes. Vérifiez la connexion au serveur.');
            }
        } catch {
            setError('Impossible de contacter le serveur.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => setSearchQuery(query);

    const filtered = applications.filter((a) => {
        const matchesSearch =
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            const res = await fetch(`${API_URL}/admin/approve-teacher/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                setApplications((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, status: 'active' as const } : a))
                );
                setIsDetailOpen(false);
            }
        } catch {
            // ignorer
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        setActionLoading(id);
        try {
            const res = await fetch(`${API_URL}/admin/reject-teacher/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.ok) {
                setApplications((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as const } : a))
                );
                setIsDetailOpen(false);
            }
        } catch {
            // ignorer
        } finally {
            setActionLoading(null);
        }
    };

    const openDetail = (teacher: TeacherApplication) => {
        setSelectedTeacher(teacher);
        setIsDetailOpen(true);
    };

    const pendingCount = applications.filter((a) => a.status === 'pending').length;
    const approvedCount = applications.filter((a) => a.status === 'active').length;
    const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

    const getStatusBadge = (status: TeacherApplication['status']) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
            case 'active':
                return <Badge className="bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
        }
    };

    const filterLabels: Record<string, string> = {
        all: 'Tous',
        pending: 'En attente',
        active: 'Approuvés',
        rejected: 'Rejetés',
    };

    return (
        <Layout role="super-admin" onSearch={handleSearch}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Validation des enseignants</h2>
                        <p className="text-gray-600 mt-1">Examinez et approuvez les demandes d&apos;inscription des enseignants</p>
                    </div>
                    <Button variant="outline" onClick={fetchApplications} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Actualiser
                    </Button>
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
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="text-xl font-bold text-gray-900">{applications.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">En attente</p>
                                <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Approuvés</p>
                                <p className="text-xl font-bold text-gray-900">{approvedCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Rejetés</p>
                                <p className="text-xl font-bold text-gray-900">{rejectedCount}</p>
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
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'pending', 'active', 'rejected'] as const).map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus(status)}
                                className={filterStatus === status ? 'bg-violet-600 hover:bg-violet-700' : ''}
                            >
                                {filterLabels[status]}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Tableau */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demandes d&apos;enseignants</CardTitle>
                        <CardDescription>
                            {filtered.length} demande{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
                        </CardDescription>
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
                                        <TableHead>Date de demande</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((teacher) => (
                                        <TableRow key={teacher.id}>
                                            <TableCell className="font-medium">{teacher.name}</TableCell>
                                            <TableCell>{teacher.email}</TableCell>
                                            <TableCell>{teacher.date}</TableCell>
                                            <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" className="h-9 px-3" onClick={() => openDetail(teacher)}>
                                                    <Eye className="w-4 h-4 mr-1" /> Voir
                                                </Button>
                                                {teacher.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white gap-1 h-9 px-3"
                                                            onClick={() => handleApprove(teacher.id)}
                                                            disabled={actionLoading === teacher.id}
                                                        >
                                                            {actionLoading === teacher.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                            Accepter
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700 text-white gap-1 h-9 px-3"
                                                            onClick={() => handleReject(teacher.id)}
                                                            disabled={actionLoading === teacher.id}
                                                        >
                                                            {actionLoading === teacher.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                            Refuser
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-violet-600 border-violet-200 hover:bg-violet-50 h-9 px-3 font-medium"
                                                        onClick={async () => {
                                                            if (confirm("Voulez-vous remettre ce compte en attente pour modifier son statut ?")) {
                                                                setActionLoading(teacher.id);
                                                                try {
                                                                    const res = await fetch(`${API_URL}/admin/reset-teacher/${teacher.id}`, {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Accept': 'application/json',
                                                                            'Authorization': `Bearer ${token}`,
                                                                        },
                                                                    });
                                                                    if (res.ok) {
                                                                        fetchApplications();
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                } finally {
                                                                    setActionLoading(null);
                                                                }
                                                            }
                                                        }}
                                                        disabled={actionLoading === teacher.id}
                                                    >
                                                        <Edit className="w-3 h-3 mr-1" /> Modifier
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!isLoading && filtered.length === 0 && (
                            <div className="text-center py-16">
                                <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Aucune demande d&apos;enseignant</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Les nouvelles demandes d&apos;inscription apparaîtront ici pour examen
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog Détail */}
            {selectedTeacher && (
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
                        <div className="bg-violet-600 p-6 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl text-white">Détails de la demande</DialogTitle>
                                <DialogDescription className="text-violet-100 opacity-90">
                                    Informations de l&apos;enseignant pour validation
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nom complet</p>
                                        <p className="text-base font-semibold text-gray-900">{selectedTeacher.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <Eye className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Adresse Email</p>
                                        <p className="text-base font-semibold text-gray-900">{selectedTeacher.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date de demande</p>
                                        <p className="text-base font-semibold text-gray-900">{selectedTeacher.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Statut actuel</p>
                                        <div className="mt-1">{getStatusBadge(selectedTeacher.status)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                {selectedTeacher.status === 'pending' ? (
                                    <>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700 h-11 text-white font-semibold"
                                            onClick={() => handleApprove(selectedTeacher.id)}
                                            disabled={actionLoading === selectedTeacher.id}
                                        >
                                            {actionLoading === selectedTeacher.id
                                                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                : <CheckCircle className="w-4 h-4 mr-2" />}
                                            Accepter
                                        </Button>
                                        <Button
                                            className="flex-1 bg-red-600 hover:bg-red-700 h-11 text-white font-semibold"
                                            onClick={() => handleReject(selectedTeacher.id)}
                                            disabled={actionLoading === selectedTeacher.id}
                                        >
                                            {actionLoading === selectedTeacher.id
                                                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                : <XCircle className="w-4 h-4 mr-2" />}
                                            Refuser
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex-1 flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-11"
                                            onClick={() => setIsDetailOpen(false)}
                                        >
                                            Fermer
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-violet-600 border-violet-200 hover:bg-violet-50 h-11 font-medium"
                                            onClick={async () => {
                                                if (confirm("Voulez-vous remettre ce compte en attente pour modifier son statut ?")) {
                                                    setActionLoading(selectedTeacher.id);
                                                    try {
                                                        const res = await fetch(`${API_URL}/admin/reset-teacher/${selectedTeacher.id}`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Accept': 'application/json',
                                                                'Authorization': `Bearer ${token}`,
                                                            },
                                                        });
                                                        if (res.ok) {
                                                            fetchApplications();
                                                            setIsDetailOpen(false);
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                        setActionLoading(null);
                                                    }
                                                }
                                            }}
                                            disabled={actionLoading === selectedTeacher.id}
                                        >
                                            <Edit className="w-4 h-4 mr-2" /> Modifier le statut
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Layout>
    );
}
