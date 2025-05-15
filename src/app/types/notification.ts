// Types pour les notifications
import { NotificationType } from "@/components/NotificationCard";

// Interface pour les notifications
export interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

// Fonction pour créer une notification de succès
export function createSuccessNotification(message: string, title: string = 'Success'): NotificationState {
  return {
    title,
    message,
    type: 'success',
    isVisible: true
  };
}

// Fonction pour créer une notification d'erreur
export function createErrorNotification(message: string, title: string = 'Error'): NotificationState {
  return {
    title,
    message,
    type: 'error',
    isVisible: true
  };
}

// Fonction pour créer une notification d'information
export function createInfoNotification(message: string, title: string = 'Information'): NotificationState {
  return {
    title,
    message,
    type: 'info',
    isVisible: true
  };
}

// Fonction pour créer une notification d'avertissement
export function createWarningNotification(message: string, title: string = 'Warning'): NotificationState {
  return {
    title,
    message,
    type: 'warning',
    isVisible: true
  };
}

// État initial d'une notification (invisible)
export const initialNotificationState: NotificationState = {
  title: '',
  message: '',
  type: 'info',
  isVisible: false
};
