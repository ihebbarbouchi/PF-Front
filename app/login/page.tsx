'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '../components/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Si déjà connecté, rediriger vers le tableau de bord
    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            if (user.role === 'super-admin') {
                router.replace('/super-admin');
            } else if (user.role === 'teacher') {
                router.replace('/teacher');
            } else {
                router.replace('/student');
            }
        }
    }, [authLoading, isAuthenticated, user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error || 'Échec de la connexion');
            setIsSubmitting(false);
        }
    };

    // Afficher le chargement pendant la vérification de l'auth
    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    // Ne pas afficher la connexion si déjà authentifié (redirection en cours)
    if (isAuthenticated && user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Redirection vers votre tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <PublicLayout>
            {/* Section Héro */}
            <section className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Bon retour !
                        </h1>
                        <p className="text-lg text-gray-600">
                            Connectez-vous pour accéder à vos ressources éducatives
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Formulaire de Connexion */}
            <section className="py-16 bg-white">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connexion à votre compte</CardTitle>
                            <CardDescription>
                                Entrez vos identifiants pour accéder à votre tableau de bord
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* Message d'erreur */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Adresse e-mail *</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="exemple@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="login-password">Mot de passe *</Label>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Mot de passe oublié ?
                                        </button>
                                    </div>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </Button>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Vous n&apos;avez pas de compte ?{' '}
                                        <Link
                                            href="/signup"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Créer un compte
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
