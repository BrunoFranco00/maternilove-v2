'use client';

/**
 * Error Boundary para capturar erros de UI
 * Fallback para falhas de renderização
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorState } from '@/components/feedback/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro (em produção, enviar para serviço de monitoramento)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title="Algo deu errado"
          description={this.state.error?.message || 'Ocorreu um erro inesperado'}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
