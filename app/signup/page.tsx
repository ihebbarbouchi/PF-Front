'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '../components/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, Loader2, AlertCircle, CheckCircle, ChevronDown, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

export default function SignUp() {
  const router = useRouter();
  const { signup, completeProfile } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [position, setPosition] = useState('');
  const [institution, setInstitution] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (!firstName || !lastName || !email) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData();
    // Step 1 data
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    // Step 2 data
    formData.append('phone', phone);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('current_position', position);
    formData.append('institution', institution);

    if (cvFile) formData.append('cv', cvFile);
    if (motivationFile) formData.append('motivation', motivationFile);

    const result = await signup(formData);

    if (!result.success) {
      setError(result.error || "Une erreur est survenue lors de l'inscription.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setShowSuccessModal(true);
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
              {step === 1 ? 'Devenir membre' : 'Compléter votre profil'}
            </h1>
            <p className="text-lg text-gray-600">
              {step === 1
                ? 'Rejoignez notre plateforme éducative et commencez votre parcours d\'apprentissage'
                : 'Parlez-nous un peu plus de vous pour mieux personnaliser votre expérience'}
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-12 bg-white">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-gray-100">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <Badge variant={step === 1 ? "default" : "outline"} className={step === 1 ? "bg-blue-600" : "text-gray-400 border-gray-100"}>Étape 1</Badge>
                <div className="flex-1 h-0.5 bg-gray-100 mx-4"></div>
                <Badge variant={step === 2 ? "default" : "outline"} className={step === 2 ? "bg-blue-600" : "text-gray-400 border-gray-100"}>Étape 2</Badge>
              </div>
              <CardTitle>{step === 1 ? 'Créer votre compte' : 'Informations complémentaires'}</CardTitle>
              <CardDescription>
                {step === 1
                  ? 'Remplissez le formulaire ci-dessous pour commencer'
                  : 'Ces informations nous aident à valider votre profil'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Étape 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-5">
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-prenom">Prénom *</Label>
                      <Input
                        id="signup-prenom"
                        placeholder="Jean"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-nom">Nom *</Label>
                      <Input
                        id="signup-nom"
                        placeholder="Dupont"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className={`space-y-2 transition-all duration-300`}>
                    <Label className="text-sm font-medium text-gray-700">Je suis *</Label>
                    <div className={`relative border rounded-md shadow-sm transition-all duration-200 ${isRoleOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div
                        className="flex h-11 items-center justify-between px-3 bg-white cursor-pointer select-none rounded-md"
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                      >
                        <span className="text-sm">
                          {role === 'student' ? '🎓 Apprenant' : '👨‍🏫 Enseignant'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <div className={`transition-all duration-300 bg-white overflow-hidden ${isRoleOpen ? 'max-h-40 opacity-100 border-t border-gray-100 p-1' : 'max-h-0 opacity-0'}`}>
                        <div
                          className={`p-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${role === 'student' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                          onClick={() => { setRole('student'); setIsRoleOpen(false); }}
                        >
                          🎓 Apprenant
                        </div>
                        <div
                          className={`p-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${role === 'teacher' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                          onClick={() => { setRole('teacher'); setIsRoleOpen(false); }}
                        >
                          👨‍🏫 Enseignant
                        </div>
                      </div>
                    </div>
                    {/* Espaceur pour l'email */}
                    <div className="h-2"></div>
                  </div>

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
                  </div>

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

                  <Button
                    type="submit"
                    className="w-full text-base py-6 mt-2 bg-blue-600 hover:bg-blue-700"
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

                  <div className="text-center text-sm text-gray-600 pt-1">
                    Vous avez déjà un compte ?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Se connecter
                    </Link>
                  </div>
                </form>
              )}

              {/* Étape 2 */}
              {step === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-5">
                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Numéro de téléphone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-ville">Ville</Label>
                      <Input
                        id="signup-ville"
                        placeholder="Alger"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-pays">Pays</Label>
                      <Input
                        id="signup-pays"
                        placeholder="Algérie"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-poste">Poste actuel</Label>
                    <Input
                      id="signup-poste"
                      placeholder={role === 'teacher' ? 'Professeur Universitaire' : 'Étudiant'}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-institution">Institution / Université</Label>
                    <Input
                      id="signup-institution"
                      placeholder="Université de Science et Technologie"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-cv">CV {role === 'teacher' && '*'}</Label>
                      <Input
                        id="signup-cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                        required={role === 'teacher'}
                        disabled={isLoading}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-motivation">Lettre de motivation {role === 'teacher' && '*'}</Label>
                      <Input
                        id="signup-motivation"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setMotivationFile(e.target.files ? e.target.files[0] : null)}
                        required={role === 'teacher'}
                        disabled={isLoading}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-base py-6 mt-2 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finalisation...
                      </>
                    ) : (
                      'Finaliser l\'inscription'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            En créant un compte, vous acceptez nos{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Conditions d&apos;utilisation</span>
            {' '}et notre{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">Politique de confidentialité</span>
          </p>
        </div>
      </section >

      {/* Modal de Succès / Validation */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

            <DialogHeader className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/30 animate-in zoom-in duration-500">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white mb-2">Inscription Réussie !</DialogTitle>
              <DialogDescription className="text-blue-100 text-base opacity-95">
                Votre compte a été créé avec succès
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">En attente de validation</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    Votre profil est actuellement examiné par notre équipe administrative.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Prochaine étape</h4>
                  <p className="text-xs text-blue-800 leading-relaxed mt-1">
                    Vous recevrez une notification par e-mail dès que votre compte sera activé.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-100"
                onClick={() => router.push('/')}
              >
                Retour à l&apos;accueil
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout >
  );
}
