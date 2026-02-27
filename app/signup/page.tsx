'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '../components/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookOpen, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoading(true);

    const result = await signup({ name, email, password, role });

    if (!result.success) {
      setError(result.error || "Une erreur est survenue lors de l'inscription.");
      setIsLoading(false);
      return;
    }

    if (role === 'teacher') {
      setSuccess('Compte créé ! En attente de validation par un administrateur.');
      setIsLoading(false);
    } else {
      setSuccess('Compte créé avec succès ! Redirection...');
      setTimeout(() => router.push('/student'), 1500);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Devenir membre
            </h1>
            <p className="text-lg text-gray-600">
              Rejoignez notre plateforme éducative et commencez votre parcours d&apos;apprentissage
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-12 bg-white">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Créer votre compte</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous pour commencer
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Erreur */}
                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Succès */}
                {success && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* ── Sélecteur de rôle (boutons radio visuels) ── */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Je suis *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Apprenant */}
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      disabled={isLoading}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${role === 'student'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-2xl">🎓</span>
                      <span className="text-sm font-semibold">Apprenant</span>
                    </button>

                    {/* Enseignant */}
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      disabled={isLoading}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${role === 'teacher'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-2xl">👨‍🏫</span>
                      <span className="text-sm font-semibold">Enseignant</span>
                    </button>
                  </div>
                </div>

                {/* Message info enseignant */}
                {role === 'teacher' && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Les comptes enseignants nécessitent une approbation par l&apos;administrateur avant activation.
                    </span>
                  </div>
                )}

                {/* Nom complet */}
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet *</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Adresse e-mail *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="jean.dupont@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400">Au moins 8 caractères</p>
                </div>

                {/* Confirmer mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmer le mot de passe *</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Bouton soumettre */}
                <Button
                  type="submit"
                  className={`w-full text-base py-6 mt-2 ${role === 'teacher'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>

                {/* Lien login */}
                <div className="text-center text-sm text-gray-600 pt-1">
                  Vous avez déjà un compte ?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Se connecter
                  </Link>
                </div>

              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            En créant un compte, vous acceptez nos{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Conditions d&apos;utilisation</span>
            {' '}et notre{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Politique de confidentialité</span>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
