"use client"; // Nécessaire car on utilise une fonction onClose (interactivité côté client)

import React, { useEffect } from 'react';

// Définition des types de notification
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Interface pour les propriétés du composant
interface NotificationCardProps {
  title?: string;
  message: string;
  icon?: React.ReactNode; // Optionnel car nous fournirons des icônes par défaut
  type: NotificationType;
  isVisible: boolean;
  isFixed?: boolean;
  autoClose?: boolean; // Option pour fermer automatiquement la notification
  duration?: number; // Durée avant fermeture automatique en ms
  onClose: () => void;
}

// Classe pour gérer les configurations des notifications
class NotificationConfig {
  static getTitle(type: NotificationType): string {
    const titles = {
      success: 'Success',
      error: 'Error',
      info: 'Information',
      warning: 'Warning'
    };
    return titles[type];
  }

  static getIcon(type: NotificationType): React.ReactNode {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#15803d" />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.4375 6.5625C8.4375 6.31527 8.51081 6.0736 8.64817 5.86804C8.78552 5.66248 8.98074 5.50226 9.20915 5.40765C9.43756 5.31304 9.68889 5.28829 9.93137 5.33652C10.1738 5.38475 10.3966 5.5038 10.5714 5.67862C10.7462 5.85343 10.8653 6.07616 10.9135 6.31864C10.9617 6.56111 10.937 6.81245 10.8424 7.04085C10.7477 7.26926 10.5875 7.46448 10.382 7.60184C10.1764 7.73919 9.93473 7.8125 9.6875 7.8125C9.35598 7.8125 9.03804 7.6808 8.80362 7.44638C8.5692 7.21196 8.4375 6.89402 8.4375 6.5625ZM18.4375 10C18.4375 11.6688 17.9427 13.3001 17.0155 14.6876C16.0884 16.0752 14.7706 17.1566 13.2289 17.7952C11.6871 18.4338 9.99064 18.6009 8.35393 18.2754C6.71721 17.9498 5.2138 17.1462 4.03379 15.9662C2.85378 14.7862 2.05019 13.2828 1.72463 11.6461C1.39907 10.0094 1.56616 8.31286 2.20477 6.77111C2.84338 5.22936 3.92484 3.9116 5.31238 2.98448C6.69992 2.05735 8.33122 1.5625 10 1.5625C12.237 1.56498 14.3817 2.45473 15.9635 4.03653C17.5453 5.61833 18.435 7.763 18.4375 10ZM16.5625 10C16.5625 8.70206 16.1776 7.43327 15.4565 6.35407C14.7354 5.27487 13.7105 4.43374 12.5114 3.93704C11.3122 3.44034 9.99272 3.31038 8.71972 3.5636C7.44672 3.81681 6.2774 4.44183 5.35962 5.35961C4.44183 6.27739 3.81682 7.44672 3.5636 8.71972C3.31038 9.99272 3.44034 11.3122 3.93704 12.5114C4.43374 13.7105 5.27488 14.7354 6.35407 15.4565C7.43327 16.1776 8.70206 16.5625 10 16.5625C11.7399 16.5606 13.408 15.8686 14.6383 14.6383C15.8686 13.408 16.5606 11.7399 16.5625 10ZM10.9375 12.8656V10.3125C10.9375 9.8981 10.7729 9.50067 10.4799 9.20764C10.1868 8.91462 9.7894 8.75 9.375 8.75C9.1536 8.74967 8.93923 8.82771 8.76986 8.97029C8.60048 9.11287 8.48703 9.31079 8.4496 9.52901C8.41217 9.74722 8.45318 9.97164 8.56536 10.1625C8.67754 10.3534 8.85365 10.4984 9.0625 10.5719V13.125C9.0625 13.5394 9.22712 13.9368 9.52015 14.2299C9.81317 14.5229 10.2106 14.6875 10.625 14.6875C10.8464 14.6878 11.0608 14.6098 11.2301 14.4672C11.3995 14.3246 11.513 14.1267 11.5504 13.9085C11.5878 13.6903 11.5468 13.4659 11.4346 13.275C11.3225 13.0841 11.1464 12.9391 10.9375 12.8656Z" fill="#F43F5E" />
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="#3b82f6" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#eab308" />
          </svg>
        );
      default:
        return null;
    }
  }

  static getStyles(type: NotificationType): string {
    const styles = {
      success: 'bg-green-100 border-green-500 text-green-700',
      error: 'bg-red-100 border-red-500 text-red-700',
      info: 'bg-blue-100 border-blue-500 text-blue-700',
      warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    };
    return styles[type];
  }
}

export default function NotificationCard({
  title,
  message,
  icon,
  type,
  isVisible,
  isFixed = false,
  autoClose = true,
  duration = 5000,
  onClose,
}: NotificationCardProps) {
  // Si la notification n'est pas visible, on ne rend rien
  if (!isVisible) return null;

  // Utiliser le titre par défaut si aucun n'est fourni
  const displayTitle = title || NotificationConfig.getTitle(type);

  // Utiliser l'icône par défaut si aucune n'est fournie
  const displayIcon = icon || NotificationConfig.getIcon(type);

  // Obtenir les styles en fonction du type
  const typeStyle = NotificationConfig.getStyles(type);

  // Fermer automatiquement la notification après la durée spécifiée
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoClose, duration, onClose]);

  return (
    <div
      className={`mb-4 top-4 right-4 w-full p-4 rounded-lg shadow-lg border-l-4 ${typeStyle} flex items-start space-x-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${isFixed ? 'fixed max-w-sm z-50' : ''}`}
    >
      {/* Icône */}
      <div className="flex-shrink-0">{displayIcon}</div>

      {/* Contenu */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{displayTitle}</h3>
        <p className="text-sm">{message}</p>
      </div>

      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close notification"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
