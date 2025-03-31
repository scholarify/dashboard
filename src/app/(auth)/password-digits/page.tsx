"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import AppLogo from "@/components/AppLogo";
import FormHeading from "@/components/FormHeading";
import { Loader2 } from "lucide-react";
import '@/styles/formStyle.css'; // Importer les styles globaux (comme dans ton autre page)

export default function PasswordDigits() {
  // État pour les 6 chiffres
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Références pour les champs d'entrée
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Compte à rebours
  const [countdown, setCountdown] = useState(25);

  // Focus automatique sur le premier champ au montage
  useEffect(() => {
    inputs.current[0]?.focus();
    startCountdown();
  }, []);

  // Gestion du compte à rebours
  const startCountdown = () => {
    setCountdown(25);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Gestion de l'entrée dans les champs
  const handleInput = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Accepter uniquement les chiffres
    if (!/^\d$/.test(value) && value !== '') {
      return;
    }

    // Mettre à jour les digits
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Passer au champ suivant si un chiffre est entré
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Réinitialiser l'erreur
    setHasError(false);
    setErrorMessage('');
  };

  // Gestion des touches (backspace, flèches)
  const handleKeydown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join('');

    // Validation
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setHasError(true);
      setErrorMessage('Veuillez entrer un code à 6 chiffres valide.');
      return;
    }

    setIsLoading(true);

    try {
      // Remplacer par une requête API réelle
      const response = await fetch('/api/password/digits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ digits: code }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      // Succès : rediriger ou afficher un message
      console.log('Code OTP soumis avec succès');
    } catch (error) {
      setHasError(true);
      setErrorMessage('Code invalide. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      setDigits(['', '', '', '', '', '']);
      window.location.href = '/new-password'; // Rediriger vers la page de réinitialisation du mot de passe
    }
  };

  // Ré-envoyer le code
  const resendCode = () => {
    if (countdown > 0) return;
    console.log('Ré-envoyer le code OTP');
    // Appeler une API pour renvoyer le code ici
    startCountdown();
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 dark:text-white  rounded-lg shadow-lg h-screen">
      {/* Section de l'image latérale */}
      <div className="asideLogo w-[50%] h-screen py-2">
        <div className="asideImage w-full h-full">
          <img src="/assets/images/asideImage.png" className="h-full w-full rounded-[25px]" alt="Aside Image" />
        </div>
      </div>

      {/* Section du formulaire */}
      <div className="asideForm  bg-white dark:bg-gray-900 flex flex-col justify-evenly items-center m-auto   ">
        <div className="  flex flex-col justify-evenly items-center m-auto w-full max-w-[500px]  dark:text-white py-6">
          <AppLogo logoSrc="/assets/logo.png" logoAlt="Logo" />
          <div className="formContent w-full">
            <FormHeading
              title="Password Reset"
              subtitle="Enter your 6 digit OTP code in order to reset"
              formIcon={
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.25" y="1.25" width="47.5" height="47.5" rx="13.75" stroke="#17B890" stroke-width="2.5" />
                  <path d="M25.6135 33.0711C25.6452 33.15 25.7002 33.2174 25.7712 33.2641C25.8423 33.3108 25.9259 33.3347 26.0109 33.3325C26.0959 33.3303 26.1781 33.3022 26.2467 33.2519C26.3152 33.2016 26.3668 33.1316 26.3943 33.0511L31.811 17.2178C31.8377 17.144 31.8428 17.0641 31.8257 16.9874C31.8086 16.9108 31.77 16.8406 31.7145 16.7851C31.659 16.7296 31.5888 16.6911 31.5122 16.674C31.4356 16.6569 31.3557 16.662 31.2818 16.6886L15.4485 22.1053C15.3681 22.1329 15.298 22.1844 15.2477 22.253C15.1974 22.3215 15.1693 22.4038 15.1671 22.4888C15.165 22.5738 15.1888 22.6574 15.2355 22.7284C15.2823 22.7994 15.3496 22.8545 15.4285 22.8861L22.0368 25.5361C22.2457 25.6198 22.4355 25.7449 22.5948 25.9038C22.7541 26.0628 22.8795 26.2524 22.9635 26.4611L25.6135 33.0711Z" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M31.7114 16.7891L22.5947 25.9049" stroke="#17B890" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              }
            />

            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                  {/* Champs pour les 6 chiffres */}
                  <div className="flex justify-center gap-2">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInput(index, e)}
                        onKeyDown={(e) => handleKeydown(index, e)}
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        className={`h-12 w-12 rounded-lg border text-center text-black text-2xl font-medium focus:border-[#17b890] focus:outline-none ${hasError ? 'border-red-500 animate-shake' : 'border-gray-300'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Affichage du message d'erreur */}
                  {errorMessage && (
                    <div className="text-center text-sm text-red-500">{errorMessage}</div>
                  )}

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

                {/* Lien Re-send OTP Code */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn&apos;t receive the code?{' '}
                    <button
                      onClick={resendCode}
                      disabled={countdown > 0}
                      className={`text-blue-500 hover:underline ${countdown > 0 ? 'pointer-events-none opacity-50' : ''
                        }`}
                    >
                      Re-send OTP Code {countdown > 0 && `in ${countdown}s`}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div className="navigation-bars flex gap-2 p-2">
            <div className="navigationItem"></div>
            <div className="navigationItem active"></div>
            <div className="navigationItem"></div>
            <div className="navigationItem"></div>
          </div>
        </div>
      </div>
    </div>
  );
}