import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCF0] text-[#2D2926] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#E8DFC8] shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-[#7D0A0A]/10 text-[#7D0A0A] rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#2D2926]">
                Something went wrong
              </h2>
              <p className="text-sm text-[#6C584C]">
                An unexpected display issue occurred, but your cart and data are safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="px-5 py-3 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-3 rounded-full bg-[#F4EBE1] hover:bg-[#E8DFC8] text-[#2D2926] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
