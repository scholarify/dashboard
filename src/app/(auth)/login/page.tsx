"use client";
import { FormEvent, useState } from "react";
import AppLogo from "@/components/AppLogo";
import Input from "@/components/input";
import FormHeading from "@/components/FormHeading";
import { Loader2 } from "lucide-react";
import NotificationCard from "@/components/NotificationCard";
import '@/styles/formStyle.css';
import useAuth from "@/app/hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import CircularLoader from "@/components/widgets/CircularLoader";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, loading, redirectAfterLogin } = useAuth();
    const router = useRouter();
    // State pour les champs de formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full absolute top-0 left-0 z-50">
                <CircularLoader size={40} color="teal-500" />
            </div>
        );
    }
    // redirection vers la page d'accueil si l'utilisateur est déjà connecté
    if (isAuthenticated) {
        const redirectTo = redirectAfterLogin || '/super-admin/dashboard';
        router.push(redirectTo);
        return null;
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            setErrorMessage('');
            setHasError(false);
            setEmail('');
            setPassword('');
            setRememberMe(false);
            router.push('/super-admin/dashboard');
        } catch (error) {
            setErrorMessage("The email or password you entered doesn't match our records. Please double-check and try again.");
            setHasError(true);
        } finally {
            setIsLoading(false);
            setPassword('');
        }
    };

    return <>
        <div className="flex bg-white dark:bg-gray-900 dark:text-white  rounded-lg shadow-lg h-screen">
            {/* Section de l'image latérale */}
            <div className="asideLogo w-[50%] h-screen py-2">
                <div className="asideImage w-full h-full">
                    <img src="/assets/images/asideImage.png" className="h-full w-full rounded-[25px]" alt="Aside Image" />
                </div>
            </div>
            <div className="asideForm  bg-white dark:bg-gray-900 flex flex-col justify-evenly items-center m-auto  ">
                <div className=" flex flex-col justify-evenly items-center m-auto w-full max-w-[500px]  dark:text-white py-6">
                    <AppLogo logoSrc="/assets/logo.png" logoAlt="Logo" />
                    <div className="w-full mx-auto p-6" >
                        <FormHeading
                            title="Nice to see you!"
                            subtitle="Sign in to access your Dashboard"
                            formIcon={
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.25" y="1.25" width="47.5" height="47.5" rx="13.75" stroke="#17B890" strokeWidth="2.5" />
                                    <path d="M27.167 17.832H30.5003C30.9424 17.832 31.3663 18.0076 31.6788 18.3202C31.9914 18.6327 32.167 19.0567 32.167 19.4987V31.1654C32.167 31.6074 31.9914 32.0313 31.6788 32.3439C31.3663 32.6564 30.9424 32.832 30.5003 32.832H27.167" stroke="#17B890" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 29.4974L27.1667 25.3307L23 21.1641" stroke="#17B890" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M27.167 25.332H17.167" stroke="#17B890" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                        <NotificationCard
                            title="Error"
                            icon={
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.4375 6.5625C8.4375 6.31527 8.51081 6.0736 8.64817 5.86804C8.78552 5.66248 8.98074 5.50226 9.20915 5.40765C9.43756 5.31304 9.68889 5.28829 9.93137 5.33652C10.1738 5.38475 10.3966 5.5038 10.5714 5.67862C10.7462 5.85343 10.8653 6.07616 10.9135 6.31864C10.9617 6.56111 10.937 6.81245 10.8424 7.04085C10.7477 7.26926 10.5875 7.46448 10.382 7.60184C10.1764 7.73919 9.93473 7.8125 9.6875 7.8125C9.35598 7.8125 9.03804 7.6808 8.80362 7.44638C8.5692 7.21196 8.4375 6.89402 8.4375 6.5625ZM18.4375 10C18.4375 11.6688 17.9427 13.3001 17.0155 14.6876C16.0884 16.0752 14.7706 17.1566 13.2289 17.7952C11.6871 18.4338 9.99064 18.6009 8.35393 18.2754C6.71721 17.9498 5.2138 17.1462 4.03379 15.9662C2.85378 14.7862 2.05019 13.2828 1.72463 11.6461C1.39907 10.0094 1.56616 8.31286 2.20477 6.77111C2.84338 5.22936 3.92484 3.9116 5.31238 2.98448C6.69992 2.05735 8.33122 1.5625 10 1.5625C12.237 1.56498 14.3817 2.45473 15.9635 4.03653C17.5453 5.61833 18.435 7.763 18.4375 10ZM16.5625 10C16.5625 8.70206 16.1776 7.43327 15.4565 6.35407C14.7354 5.27487 13.7105 4.43374 12.5114 3.93704C11.3122 3.44034 9.99272 3.31038 8.71972 3.5636C7.44672 3.81681 6.2774 4.44183 5.35962 5.35961C4.44183 6.27739 3.81682 7.44672 3.5636 8.71972C3.31038 9.99272 3.44034 11.3122 3.93704 12.5114C4.43374 13.7105 5.27488 14.7354 6.35407 15.4565C7.43327 16.1776 8.70206 16.5625 10 16.5625C11.7399 16.5606 13.408 15.8686 14.6383 14.6383C15.8686 13.408 16.5606 11.7399 16.5625 10ZM10.9375 12.8656V10.3125C10.9375 9.8981 10.7729 9.50067 10.4799 9.20764C10.1868 8.91462 9.7894 8.75 9.375 8.75C9.1536 8.74967 8.93923 8.82771 8.76986 8.97029C8.60048 9.11287 8.48703 9.31079 8.4496 9.52901C8.41217 9.74722 8.45318 9.97164 8.56536 10.1625C8.67754 10.3534 8.85365 10.4984 9.0625 10.5719V13.125C9.0625 13.5394 9.22712 13.9368 9.52015 14.2299C9.81317 14.5229 10.2106 14.6875 10.625 14.6875C10.8464 14.6878 11.0608 14.6098 11.2301 14.4672C11.3995 14.3246 11.513 14.1267 11.5504 13.9085C11.5878 13.6903 11.5468 13.4659 11.4346 13.275C11.3225 13.0841 11.1464 12.9391 10.9375 12.8656Z" fill="#F43F5E" />
                                </svg>
                            }
                            message={errorMessage}
                            type="error"
                            isVisible={hasError}
                            onClose={() => {
                                setErrorMessage('');
                                setHasError(false);
                            }}

                        />
                        <form onSubmit={handleSubmit} className="flex flex-col">
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

                            <div className="mb-4">
                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    prefixIcon={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.25 5.9375H14.0625V4.375C14.0625 3.29756 13.6345 2.26425 12.8726 1.50238C12.1108 0.740512 11.0774 0.3125 10 0.3125C8.92256 0.3125 7.88925 0.740512 7.12738 1.50238C6.36551 2.26425 5.9375 3.29756 5.9375 4.375V5.9375H3.75C3.3356 5.9375 2.93817 6.10212 2.64515 6.39515C2.35212 6.68817 2.1875 7.0856 2.1875 7.5V16.25C2.1875 16.6644 2.35212 17.0618 2.64515 17.3549C2.93817 17.6479 3.3356 17.8125 3.75 17.8125H16.25C16.6644 17.8125 17.0618 17.6479 17.3549 17.3549C17.6479 17.0618 17.8125 16.6644 17.8125 16.25V7.5C17.8125 7.0856 17.6479 6.68817 17.3549 6.39515C17.0618 6.10212 16.6644 5.9375 16.25 5.9375ZM7.8125 4.375C7.8125 3.79484 8.04297 3.23844 8.4532 2.8282C8.86344 2.41797 9.41984 2.1875 10 2.1875C10.5802 2.1875 11.1366 2.41797 11.5468 2.8282C11.957 3.23844 12.1875 3.79484 12.1875 4.375V5.9375H7.8125V4.375ZM15.9375 15.9375H4.0625V7.8125H15.9375V15.9375Z" fill="#575D5E" />
                                        </svg>
                                    }
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">Remember for 30 days</span>
                                </label>
                                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center gap-2 items-center bg-[#17B890] text-white py-2 rounded-full hover:bg-[#17b890c4] transition duration-200"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Sign In
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.1875 16.875C10.1875 17.1236 10.0887 17.3621 9.91291 17.5379C9.7371 17.7137 9.49864 17.8125 9.25 17.8125H4.25C4.00136 17.8125 3.7629 17.7137 3.58709 17.5379C3.41127 17.3621 3.3125 17.1236 3.3125 16.875V3.125C3.3125 2.87636 3.41127 2.6379 3.58709 2.46209C3.7629 2.28627 4.00136 2.1875 4.25 2.1875H9.25C9.49864 2.1875 9.7371 2.28627 9.91291 2.46209C10.0887 2.6379 10.1875 2.87636 10.1875 3.125C10.1875 3.37364 10.0887 3.6121 9.91291 3.78791C9.7371 3.96373 9.49864 4.0625 9.25 4.0625H5.1875V15.9375H9.25C9.49864 15.9375 9.7371 16.0363 9.91291 16.2121C10.0887 16.3879 10.1875 16.6264 10.1875 16.875ZM18.6633 9.33672L15.5383 6.21172C15.3622 6.0356 15.1233 5.93665 14.8742 5.93665C14.6251 5.93665 14.3863 6.0356 14.2102 6.21172C14.034 6.38784 13.9351 6.62671 13.9351 6.87578C13.9351 7.12485 14.034 7.36372 14.2102 7.53984L15.7344 9.0625H9.25C9.00136 9.0625 8.7629 9.16127 8.58709 9.33709C8.41127 9.5129 8.3125 9.75136 8.3125 10C8.3125 10.2486 8.41127 10.4871 8.58709 10.6629C8.7629 10.8387 9.00136 10.9375 9.25 10.9375H15.7344L14.2094 12.4617C14.0333 12.6378 13.9343 12.8767 13.9343 13.1258C13.9343 13.3749 14.0333 13.6137 14.2094 13.7898C14.3855 13.966 14.6244 14.0649 14.8734 14.0649C15.1225 14.0649 15.3614 13.966 15.5375 13.7898L18.6625 10.6648C18.7499 10.5778 18.8194 10.4743 18.8667 10.3604C18.9141 10.2465 18.9386 10.1243 18.9386 10.0009C18.9387 9.87755 18.9144 9.75537 18.8672 9.64138C18.8199 9.5274 18.7506 9.42387 18.6633 9.33672Z" fill="#F5F6FA" />
                                </svg>

                            </button>
                        </form>
                    </div>
                    <div>
                        <ul className="flex justify-center items-center gap-5 py-4 text-gray-800 dark:text-gray-200 text-sm">
                            <li className="hover:text-[#17B890]"><a href="#">Licence</a></li>
                            <li className="hover:text-[#17B890]"><a href="#">Terms of Use</a></li>
                            <li className="hover:text-[#17B890]"><a href="#">Blog</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>
}