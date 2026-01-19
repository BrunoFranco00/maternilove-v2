'use client';

/**
 * Hook para gerenciar prompt de instalação PWA
 * LOCK PWA 1: Preparação - NÃO dispara automaticamente
 */

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    if (typeof window === 'undefined') return;

    const checkInstalled = () => {
      // Verificar display mode standalone (PWA instalado)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setIsInstallable(false);
        return;
      }

      // Verificar se está rodando como app instalado (iOS)
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        setIsInstallable(false);
        return;
      }
    };

    checkInstalled();

    // Capturar evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar periodicamente se foi instalado
    const interval = setInterval(checkInstalled, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(interval);
    };
  }, []);

  /**
   * Disparar prompt de instalação manualmente
   * Deve ser chamado após onboarding ou quando usuário solicitar
   */
  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }

      setInstallPrompt(null);
      return false;
    } catch (error) {
      console.error('Erro ao disparar prompt de instalação:', error);
      return false;
    }
  };

  return {
    installPrompt,
    isInstalled,
    isInstallable,
    promptInstall,
  };
}
