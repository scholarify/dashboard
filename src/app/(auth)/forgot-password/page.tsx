"use client";
import { FormEvent, useState } from "react";
import AppLogo from "@/components/AppLogo";
import { Loader2 } from "lucide-react";
import Input from "@/components/input";
import FormHeading from "@/components/FormHeading";
import '@/styles/formStyle.css';
import NotificationCard, { NotificationType } from "@/components/NotificationCard";
import { createSuccessNotification, createErrorNotification, NotificationState } from '@/app/types/notification';
import { forget_password } from "@/app/services/UserServices";
export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [successNotification, setSuccessNotification] = useState<NotificationState>({
        title: '',
        message: '',
        type: 'success',
        isVisible: false
    });


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage('Email is required.');
            setHasError(true);
            return;
        }

        // Validation de l'email avec une expression régulière
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            setHasError(true);
            return;
        }

        setIsLoading(true);

        try {
            // Appel à l'API de récupération de mot de passe
            const response = await forget_password(email);
            console.log(response);
            // Vérifier si la réponse est réussie
            if (response && response.success) {
                // Afficher une notification de succès
                setSuccessNotification(createSuccessNotification(
                    "A code has been sent to your email. Please check your inbox.",
                    "Code Sent"
                ));

                // Ajouter un délai avant la redirection pour montrer la notification
                setTimeout(() => {
                    // Rediriger vers la page de saisie du code avec l'email en paramètre
                    window.location.href = `/password-digits?email=${encodeURIComponent(email)}`;
                }, 3000); // Délai plus long pour que l'utilisateur puisse voir la notification
            } else {
                // Si la réponse indique une erreur
                throw new Error(response?.message || 'Error sending reset instructions.');
            }
        } catch (error) {
            // Afficher un message d'erreur plus descriptif
            const errorMsg = error instanceof Error ? error.message : 'Failed to send reset instructions. Please try again.';
            setErrorMessage(errorMsg);
            setHasError(true);
            setIsLoading(false);
        }
    };

    return <>
        <div className="flex bg-white dark:bg-gray-900 dark:text-white  rounded-lg shadow-lg h-screen px-4">
            {/* Section de l'image latérale */}
            <div className="asideLogo w-[50%] h-screen py-2">
                <div className="asideImage w-full h-full">
                    <img src="/assets/images/asideImage.png" className="h-full w-full rounded-[25px]" alt="Aside Image" />
                </div>
            </div>

            {/* Section du formulaire */}
            <div className="asideForm  bg-white dark:bg-gray-900 ">
                <div className=" flex flex-col justify-evenly items-center m-auto w-full max-w-[500px]  dark:text-white py-6">
                    <AppLogo logoSrc="/assets/logo.png" logoAlt="Logo" />
                    <div className="w-full mx-auto p-6" >
                        <FormHeading
                            title="Forgot Password?"
                            subtitle="No worries, we’ll send you reset instructions."
                            formIcon={
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.25" y="1.25" width="47.5" height="47.5" rx="13.75" stroke="#17B890" stroke-width="2.5" />
                                    <g clip-path="url(#clip0_3534_3403)">
                                        <path d="M25.9995 23.332C25.5575 23.332 25.1336 23.5076 24.821 23.8202C24.5085 24.1327 24.3329 24.5567 24.3329 24.9987C24.3329 25.8487 24.2495 27.0904 24.1162 28.332" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M27.6663 25.9336C27.6663 27.9169 27.6663 31.2503 26.833 33.3336" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M30.4082 32.5167C30.5082 32.0167 30.7665 30.6 30.8249 30" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M17.667 25.0013C17.667 23.2523 18.2173 21.5476 19.24 20.1287C20.2626 18.7098 21.7058 17.6487 23.3651 17.0956C25.0244 16.5425 26.8156 16.5255 28.4851 17.047C30.1545 17.5685 31.6176 18.6021 32.667 20.0013" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M17.667 28.332H17.6753" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M34.167 28.332C34.3337 26.6654 34.2762 23.8704 34.167 23.332" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M20.167 31.2487C20.5837 29.9987 21.0003 27.4987 21.0003 24.9987C20.9995 24.4311 21.0953 23.8675 21.2837 23.332" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M23.208 33.3346C23.383 32.7846 23.583 32.2346 23.683 31.668" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M23.5 20.666C24.2603 20.227 25.1228 19.996 26.0008 19.9961C26.8788 19.9962 27.7412 20.2275 28.5014 20.6668C29.2616 21.106 29.8927 21.7376 30.3313 22.4982C30.7699 23.2587 31.0006 24.1213 31 24.9993V26.666" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3534_3403">
                                            <rect width="20" height="20" fill="white" transform="translate(16 15)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            }
                        />
                        {/* Notification d'erreur */}
                        <NotificationCard
                            title="Error"
                            message={errorMessage}
                            type="error"
                            isVisible={hasError}
                            onClose={() => {
                                setErrorMessage('');
                                setHasError(false);
                            }}
                        />

                        {/* Notification de succès */}
                        <NotificationCard
                            title={successNotification.title}
                            message={successNotification.message}
                            type={successNotification.type}
                            isVisible={successNotification.isVisible}
                            onClose={() => setSuccessNotification(prev => ({ ...prev, isVisible: false }))}
                            autoClose={true}
                            duration={2000}
                        />
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="mb-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    id="email"
                                    prefixIcon={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5 3.4375H2.5C2.25136 3.4375 2.0129 3.53627 1.83709 3.71209C1.66127 3.8879 1.5625 4.12636 1.5625 4.375V15C1.5625 15.4144 1.72712 15.8118 2.02015 16.1049C2.31317 16.3979 2.7106 16.5625 3.125 16.5625H16.875C17.2894 16.5625 17.6868 16.3979 17.9799 16.1049C18.2729 15.8118 18.4375 15.4144 18.4375 15V4.375C18.4375 4.12636 18.3387 3.8879 18.1629 3.71209C17.9871 3.53627 17.7486 3.4375 17.5 3.4375ZM15.0898 5.3125L10 9.97813L4.91016 5.3125H15.0898ZM3.4375 14.6875V6.50625L9.36641 11.9414C9.53932 12.1 9.7654 12.1879 10 12.1879C10.2346 12.1879 10.4607 12.1 10.6336 11.9414L16.5625 6.50625V14.6875H3.4375Z" fill="#575D5E" />
                                        </svg>
                                    }
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>


                            <button
                                type="submit"
                                className="w-full flex justify-center gap-2 items-center bg-[#17B890] text-white py-2 rounded-full hover:bg-[#17b890c4] transition duration-200"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Reset Password
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.75 5.9375H14.5625V4.375C14.5625 3.29756 14.1345 2.26425 13.3726 1.50238C12.6108 0.740512 11.5774 0.3125 10.5 0.3125C9.42256 0.3125 8.38925 0.740512 7.62738 1.50238C6.86551 2.26425 6.4375 3.29756 6.4375 4.375V5.9375H4.25C3.8356 5.9375 3.43817 6.10212 3.14515 6.39515C2.85212 6.68817 2.6875 7.0856 2.6875 7.5V16.25C2.6875 16.6644 2.85212 17.0618 3.14515 17.3549C3.43817 17.6479 3.8356 17.8125 4.25 17.8125H16.75C17.1644 17.8125 17.5618 17.6479 17.8549 17.3549C18.1479 17.0618 18.3125 16.6644 18.3125 16.25V7.5C18.3125 7.0856 18.1479 6.68817 17.8549 6.39515C17.5618 6.10212 17.1644 5.9375 16.75 5.9375ZM8.3125 4.375C8.3125 3.79484 8.54297 3.23844 8.9532 2.8282C9.36344 2.41797 9.91984 2.1875 10.5 2.1875C11.0802 2.1875 11.6366 2.41797 12.0468 2.8282C12.457 3.23844 12.6875 3.79484 12.6875 4.375V5.9375H8.3125V4.375ZM16.4375 15.9375H4.5625V7.8125H16.4375V15.9375Z" fill="#F5F6FA" />
                                </svg>


                            </button>
                        </form>
                        <div className="flex justify-center items-center gap-2 my-4">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="#17B890" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.1634 15.5876C13.3396 15.7637 13.4385 16.0026 13.4385 16.2516C13.4385 16.5007 13.3396 16.7396 13.1634 16.9157C12.9873 17.0918 12.7484 17.1908 12.4994 17.1908C12.2503 17.1908 12.0114 17.0918 11.8353 16.9157L5.58531 10.6657C5.49791 10.5786 5.42856 10.4751 5.38124 10.3611C5.33393 10.2472 5.30957 10.125 5.30957 10.0016C5.30957 9.87824 5.33393 9.75606 5.38124 9.64211C5.42856 9.52815 5.49791 9.42466 5.58531 9.33756L11.8353 3.08756C12.0114 2.91144 12.2503 2.8125 12.4994 2.8125C12.7484 2.8125 12.9873 2.91144 13.1634 3.08756C13.3396 3.26368 13.4385 3.50255 13.4385 3.75163C13.4385 4.0007 13.3396 4.23957 13.1634 4.41569L7.57828 10.0008L13.1634 15.5876Z"
                                    fill="#17B890" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Back to </span>
                            <a href="/login" className="text-[#17B890] hover:underline">Login</a>
                        </div>
                    </div>
                    <div className="navigation-bars flex gap-2 p-2">
                        <div className="navigationItem active"></div>
                        <div className="navigationItem "></div>
                        <div className="navigationItem"></div>
                        <div className="navigationItem"></div>
                    </div>
                </div>
            </div>
        </div>
    </>
}