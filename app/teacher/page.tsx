'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { BookOpen, FileText, HelpCircle, Users, PlusCircle, Edit, Trash2, Eye, GraduationCap, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isPending = user?.status === 'pending';
  const isRejected = user?.status === 'rejected';

  // Si l'enseignant est rejeté, on le déconnecte ou on le bloque
  useEffect(() => {
    if (isRejected) {
      // Option: Déconnecter l'utilisateur s'il est rejeté
      const timer = setTimeout(() => {
        logout();
      }, 5000); // Laisser 5 secondes pour lire le message avant de déconnecter
      return () => clearTimeout(timer);
    }
  }, [isRejected, logout]);

  const stats = [
    { title: 'Mes ressources', value: '0', icon: BookOpen, color: 'emerald' },
    { title: 'Total apprenants', value: '0', icon: Users, color: 'teal' },
    { title: 'Cours', value: '0', icon: FileText, color: 'indigo' },
    { title: 'Quiz', value: '0', icon: HelpCircle, color: 'amber' },
  ];

  const myResources: { id: number; title: string; type: string; category: string; students: number; status: string }[] = [];
  const quizResults: { id: number; quiz: string; student: string; score: number; date: string; status: string }[] = [];
  const studentAccess: { id: number; name: string; email: string; courses: number; lastActive: string }[] = [];

  return (
    <Layout role="teacher">
      <div className="relative">
        {/* Overlay pour les comptes en attente ou rejetés */}
        {(isPending || isRejected) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center -m-6 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />
            <Card className={`relative z-10 max-w-lg mx-4 border-2 ${isRejected ? 'border-red-200' : 'border-emerald-200'} shadow-2xl`}>
              <div className={`${isRejected ? 'bg-red-500' : 'bg-emerald-500'} h-2 w-full absolute top-0 left-0`} />
              <CardHeader className="text-center pt-8">
                <div className={`w-16 h-16 ${isRejected ? 'bg-red-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {isRejected ? (
                    <XCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <Clock className="w-8 h-8 text-emerald-600 animate-pulse" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isRejected ? "Compte non validé" : "Compte en attente de validation"}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-base">
                  {isRejected
                    ? `Désolé ${user?.name}, votre demande d'inscription a été refusée.`
                    : `Bienvenue, ${user?.name} ! Votre inscription en tant qu'enseignant a bien été reçue.`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 text-center px-8">
                <div className={`${isRejected ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} border rounded-lg p-4 flex items-start gap-4 text-left`}>
                  <AlertCircle className={`w-5 h-5 ${isRejected ? 'text-red-600' : 'text-emerald-600'} mt-0.5 shrink-0`} />
                  <p className={`text-sm ${isRejected ? 'text-red-800' : 'text-emerald-800'} leading-relaxed`}>
                    {isRejected
                      ? "L'administration a décidé de ne pas valider votre profil pour le moment. Vous allez être déconnecté."
                      : "Un administrateur doit valider votre profil avant que vous puissiez commencer à publier des ressources et gérer vos apprenants."
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  {isPending && (
                    <p className="text-sm text-gray-500">
                      Vous recevrez un accès complet dès que votre compte sera approuvé. En attendant, vous pouvez explorer l&apos;interface mais les fonctionnalités sont limitées.
                    </p>
                  )}
                  <Button
                    variant={isRejected ? "destructive" : "outline"}
                    onClick={() => { logout(); router.push('/'); }}
                    className="w-full"
                  >
                    {isRejected ? "Fermer et se déconnecter" : "Retour à l&apos;accueil"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className={`space-y-6 ${(isPending || isRejected) ? 'opacity-40 pointer-events-none select-none filter blur-[1px]' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Tableau de bord — Enseignant</h2>
              <p className="text-gray-600 mt-1">Gérez vos ressources et suivez la progression de vos étudiants</p>
            </div>
            <Button
              onClick={() => router.push('/add-resource')}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Ajouter une ressource
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* My Resources */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes ressources</CardTitle>
                  <CardDescription>Gérez vos cours, documents et quiz</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push('/teacher/resources')} disabled={isPending}>
                    Voir tout
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/add-resource')} disabled={isPending}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {myResources.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucune ressource pour l&apos;instant</p>
                  <p className="text-sm text-gray-400 mb-4">Créez votre premier cours, document ou quiz</p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/add-resource')} disabled={isPending}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ajouter ma première ressource
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Étudiants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell><Badge variant="outline">{resource.type}</Badge></TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>{resource.students}</TableCell>
                        <TableCell>
                          <Badge variant={resource.status === 'Published' ? 'default' : 'secondary'}>
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" disabled={isPending}><Eye className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" disabled={isPending}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" disabled={isPending}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* My Students */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes apprenants</CardTitle>
                  <CardDescription>Apprenants inscrits dans vos cours</CardDescription>
                </div>
                <Button variant="outline" onClick={() => router.push('/teacher/students')} disabled={isPending}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Voir tous les apprenants
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {studentAccess.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucun apprenant pour l&apos;instant</p>
                  <p className="text-sm text-gray-400">Les apprenants apparaîtront ici dès leur inscription à vos cours</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cours inscrits</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentAccess.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.courses}</TableCell>
                        <TableCell>{student.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled={isPending}>Voir la progression</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quiz Results */}
          <Card>
            <CardHeader>
              <CardTitle>Résultats récents des quiz</CardTitle>
              <CardDescription>Suivez les performances de vos étudiants</CardDescription>
            </CardHeader>
            <CardContent>
              {quizResults.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucun résultat de quiz pour l&apos;instant</p>
                  <p className="text-sm text-gray-400">Les résultats apparaîtront ici une fois que vos étudiants auront complété les quiz</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz</TableHead>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.quiz}</TableCell>
                        <TableCell>{result.student}</TableCell>
                        <TableCell>
                          <span className={result.score >= 70 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {result.score}%
                          </span>
                        </TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell>
                          <Badge variant={result.status === 'Passed' ? 'default' : 'destructive'}>
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled={isPending}>Voir les détails</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
