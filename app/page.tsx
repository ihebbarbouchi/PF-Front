'use client';

import { useRouter } from 'next/navigation';
import { PublicLayout } from './components/PublicLayout';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Users, BookOpen, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';

export default function Accueil() {
  const router = useRouter();

  const stats = [
    { title: 'Utilisateurs totaux', value: '10 234', icon: Users, color: 'blue' },
    { title: 'Ressources totales', value: '8 956', icon: BookOpen, color: 'green' },
    { title: 'Enseignants', value: '487', icon: GraduationCap, color: 'purple' },
  ];

  return (
    <PublicLayout>
      {/* Section Héro */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue sur EduShare
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Votre plateforme collaborative pour partager et accéder à des ressources éducatives de qualité.
              Rejoignez des milliers d&apos;enseignants et d&apos;étudiants pour une meilleure expérience d&apos;apprentissage.
            </p>

          </div>
        </div>
      </section>

      {/* À propos d’EduShare – Section en deux colonnes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Côté gauche – Contenu */}
            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">
                  Découvrez EduShare
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Explorez l’apprentissage numérique et partagez le savoir
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  EduShare est une plateforme moderne conçue pour connecter enseignants et étudiants
                  grâce au partage de ressources éducatives, de cours interactifs et de quiz engageants.
                  Créez un environnement d’apprentissage collaboratif où le savoir circule librement.
                </p>
              </div>

              {/* Liste des avantages */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Accès à des ressources de qualité
                    </h3>
                    <p className="text-gray-600">
                      Parcourez des milliers de supports pédagogiques soigneusement sélectionnés,
                      couvrant toutes les matières
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Quiz interactifs
                    </h3>
                    <p className="text-gray-600">
                      Créez et participez à des quiz engageants pour tester les connaissances
                      et suivre les progrès
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Collaboration enseignant-étudiant
                    </h3>
                    <p className="text-gray-600">
                      Favorisez des échanges enrichissants et le partage de connaissances
                      entre éducateurs et apprenants
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton d’appel à l’action */}
              <div className="pt-6">
                <Button
                  size="lg"
                  onClick={() => router.push('/about')}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                >
                  En savoir plus
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Côté droit – Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1620856900883-e12a5ea43735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHRlYWNoZXJzJTIwZGlnaXRhbCUyMGxlYXJuaW5nJTIwY29sbGFib3JhdGlvbiUyMGxhcHRvcHxlbnwxfHx8fDE3NzIxODg0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Étudiants et enseignants collaborant"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Élément décoratif */}
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-blue-100 rounded-2xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Statistiques de la plateforme</h2>
            <p className="text-lg text-gray-600">
              Rejoignez notre communauté grandissante d&apos;éducateurs et d&apos;apprenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-full bg-${stat.color}-100 flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Créez votre compte gratuit dès aujourd&apos;hui et commencez à explorer des ressources éducatives ou partagez vos propres contenus avec des étudiants du monde entier
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                S&apos;inscrire maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/public-resources')}
                className="text-lg px-8 py-6"
              >
                Parcourir les ressources
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}