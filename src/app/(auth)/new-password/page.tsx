"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation"; // Pour récupérer les query params
import AppLogo from "@/components/AppLogo";
import FormHeading from "@/components/FormHeading";
import Input from "@/components/input";
import NotificationCard from "@/components/NotificationCard";
import { Loader2 } from "lucide-react";
import '@/styles/formStyle.css';

export default function NewPassword() {
    // Récupérer les query params (email et digits)
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const digits = searchParams.get('digits') || '';

    // États pour le formulaire
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [notification, setNotification] = useState<{
        title: string;
        message: string;
        type: string;
        isVisible: boolean;
    }>({
        title: '',
        message: '',
        type: 'info',
        isVisible: false,
    });

    // Basculer la visibilité du mot de passe
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Vérifier la force du mot de passe
    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    // Classes pour la barre de progression
    const getProgressBarClass = (index: number) => {
        return index <= passwordStrength ? 'bg-green-500' : 'bg-gray-200';
    };

    // Soumission du formulaire
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (password !== passwordConfirmation) {
            setErrorMessage('The passwords are incompatible');
            setHasError(true);
            setNotification({
                title: 'Erreur',
                message: 'The passwords are incompatible.',
                type: 'error',
                isVisible: true,
            });
            return;
        }

        if (passwordStrength < 3) {
            setErrorMessage(
                'The password is weak. It must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.'
            );
            setHasError(true);
            setNotification({
                title: 'Erreur',
                message: 'The password is weak. It must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.',
                type: 'error',
                isVisible: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/password/success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    digits,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la soumission');
            }

            setNotification({
                title: 'Succès !',
                message: 'Mot de passe réinitialisé avec succès.',
                type: 'success',
                isVisible: true,
            });

            // Réinitialiser les champs
            setPassword('');
            setPasswordConfirmation('');
            setPasswordStrength(0);

            // Rediriger après un délai (par exemple, vers la page de connexion)
            setTimeout(() => {
                window.location.href = '/successfull-reset';
            }, 2000);
        } catch (error) {
            setErrorMessage('Erreur lors de la réinitialisation du mot de passe.');
            setHasError(true);
            setNotification({
                title: 'Erreur',
                message: 'Échec de la réinitialisation. Veuillez réessayer.',
                type: 'error',
                isVisible: true,
            });
        } finally {
            setIsLoading(false);
            window.location.href = '/successfull-reset';
        }
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, isVisible: false }));
        setErrorMessage('');
        setHasError(false);
    };

    return (
        <div className="flex bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg h-screen">
            {/* Section de l'image latérale */}
            <div className="asideLogo w-[50%] h-screen py-2">
                <div className="asideImage w-full h-full">
                    <img
                        src="/assets/images/asideImage.png"
                        className="h-full w-full rounded-[25px]"
                        alt="Aside Image"
                    />
                </div>
            </div>

            {/* Section du formulaire */}
            <div className="asideForm h-screen bg-white dark:bg-gray-900">
                <div className="h-screen flex flex-col justify-evenly items-center m-auto w-full max-w-[500px] dark:text-white py-6">
                    <AppLogo logoSrc="/assets/logo.png" logoAlt="Logo" />
                    <div className="w-full mx-auto p-6 relative">
                        <FormHeading
                            title="Set new password"
                            subtitle="Must be at least 8 characters."
                            formIcon={
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.25" y="1.25" width="47.5" height="47.5" rx="13.75" stroke="#17B890" stroke-width="2.5" />
                                    <path d="M31.667 20H18.3337C17.4132 20 16.667 20.7462 16.667 21.6667V28.3333C16.667 29.2538 17.4132 30 18.3337 30H31.667C32.5875 30 33.3337 29.2538 33.3337 28.3333V21.6667C33.3337 20.7462 32.5875 20 31.667 20Z" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M25 25H25.0083" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M29.167 25H29.1753" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.833 25H20.8413" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            }
                        />

                        {/* Notification */}
                        <NotificationCard
                            title={notification.title}
                            message={notification.message}
                            type={notification.type}
                            isVisible={notification.isVisible}
                            onClose={closeNotification}
                            icon={
                                notification.type === 'success' ? (
                                    <svg
                                        className="h-5 w-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : notification.type === 'error' ? (
                                    <svg
                                        className="h-5 w-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )
                            }
                        />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid gap-6">
                                {/* Champ New Password */}
                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="text-sm font-medium">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                checkPasswordStrength(e.target.value);
                                            }}
                                            placeholder="••••••••••••"
                                            className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none"
                                            prefixIcon={
                                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M14.25 5.9375H12.0625V4.375C12.0625 3.29756 11.6345 2.26425 10.8726 1.50238C10.1108 0.740512 9.07744 0.3125 8 0.3125C6.92256 0.3125 5.88925 0.740512 5.12738 1.50238C4.36551 2.26425 3.9375 3.29756 3.9375 4.375V5.9375H1.75C1.3356 5.9375 0.938171 6.10212 0.645146 6.39515C0.35212 6.68817 0.1875 7.0856 0.1875 7.5V16.25C0.1875 16.6644 0.35212 17.0618 0.645146 17.3549C0.938171 17.6479 1.3356 17.8125 1.75 17.8125H14.25C14.6644 17.8125 15.0618 17.6479 15.3549 17.3549C15.6479 17.0618 15.8125 16.6644 15.8125 16.25V7.5C15.8125 7.0856 15.6479 6.68817 15.3549 6.39515C15.0618 6.10212 14.6644 5.9375 14.25 5.9375ZM5.8125 4.375C5.8125 3.79484 6.04297 3.23844 6.4532 2.8282C6.86344 2.41797 7.41984 2.1875 8 2.1875C8.58016 2.1875 9.13656 2.41797 9.5468 2.8282C9.95703 3.23844 10.1875 3.79484 10.1875 4.375V5.9375H5.8125V4.375ZM13.9375 15.9375H2.0625V7.8125H13.9375V15.9375Z"
                                                        fill="#575D5E"
                                                    />
                                                </svg>
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {/* Barre de progression */}
                                    <div className="flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 w-1/4 rounded-full ${getProgressBarClass(i + 1)}`}
                                            ></div>
                                        ))}
                                    </div>
                                    {hasError && errorMessage.includes('password is weak') && (
                                        <p className="text-sm text-red-500">{errorMessage}</p>
                                    )}
                                </div>

                                {/* Champ Confirm Password */}
                                <div className="space-y-2">
                                    <label htmlFor="confirm-password" className="text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none"
                                            prefixIcon={
                                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M14.25 5.9375H12.0625V4.375C12.0625 3.29756 11.6345 2.26425 10.8726 1.50238C10.1108 0.740512 9.07744 0.3125 8 0.3125C6.92256 0.3125 5.88925 0.740512 5.12738 1.50238C4.36551 2.26425 3.9375 3.29756 3.9375 4.375V5.9375H1.75C1.3356 5.9375 0.938171 6.10212 0.645146 6.39515C0.35212 6.68817 0.1875 7.0856 0.1875 7.5V16.25C0.1875 16.6644 0.35212 17.0618 0.645146 17.3549C0.938171 17.6479 1.3356 17.8125 1.75 17.8125H14.25C14.6644 17.8125 15.0618 17.6479 15.3549 17.3549C15.6479 17.0618 15.8125 16.6644 15.8125 16.25V7.5C15.8125 7.0856 15.6479 6.68817 15.3549 6.39515C15.0618 6.10212 14.6644 5.9375 14.25 5.9375ZM5.8125 4.375C5.8125 3.79484 6.04297 3.23844 6.4532 2.8282C6.86344 2.41797 7.41984 2.1875 8 2.1875C8.58016 2.1875 9.13656 2.41797 9.5468 2.8282C9.95703 3.23844 10.1875 3.79484 10.1875 4.375V5.9375H5.8125V4.375ZM13.9375 15.9375H2.0625V7.8125H13.9375V15.9375Z"
                                                        fill="#575D5E"
                                                    />
                                                </svg>
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {hasError && errorMessage.includes('passwords are incompatible') && (
                                        <p className="text-sm text-red-500">{errorMessage}</p>
                                    )}
                                </div>

                                <div className="my-6 flex items-center justify-start">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center gap-2 items-center bg-[#17B890] text-white py-2 rounded-full hover:bg-[#1e856b] transition duration-200"
                                    >
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Reset Password
                                        <svg
                                            width="21"
                                            height="20"
                                            viewBox="0 0 21 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.75 5.9375H14.5625V4.375C14.5625 3.29756 14.1345 2.26425 13.3726 1.50238C12.6108 0.740512 11.5774 0.3125 10.5 0.3125C9.42256 0.3125 8.38925 0.740512 7.62738 1.50238C6.86551 2.26425 6.4375 3.29756 6.4375 4.375V5.9375H4.25C3.8356 5.9375 3.43817 6.10212 3.14515 6.39515C2.85212 6.68817 2.6875 7.0856 2.6875 7.5V16.25C2.6875 16.6644 2.85212 17.0618 3.14515 17.3549C3.43817 17.6479 3.8356 17.8125 4.25 17.8125H16.75C17.1644 17.8125 17.5618 17.6479 17.8549 17.3549C18.1479 17.0618 18.3125 16.6644 18.3125 16.25V7.5C18.3125 7.0856 18.1479 6.68817 17.8549 6.39515C17.5618 6.10212 17.1644 5.9375 16.75 5.9375ZM8.3125 4.375C8.3125 3.79484 8.54297 3.23844 8.9532 2.8282C9.36344 2.41797 9.91984 2.1875 10.5 2.1875C11.0802 2.1875 11.6366 2.41797 12.0468 2.8282C12.457 3.23844 12.6875 3.79484 12.6875 4.375V5.9375H8.3125V4.375ZM16.4375 15.9375H4.5625V7.8125H16.4375V15.9375Z"
                                                fill="#F5F6FA"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="navigation-bars flex gap-2 p-2">
                        <div className="navigationItem"></div>
                        <div className="navigationItem"></div>
                        <div className="navigationItem active"></div>
                        <div className="navigationItem"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}