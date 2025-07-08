import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { CheckCircle, AlertCircle } from 'lucide-react';

type VerificationState = 'idle' | 'loading' | 'success' | 'error';


export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutateAsync: verify } = useVerifyEmail();
  const token = searchParams.get('token');
  const hasTriggered = useRef(false);
  
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [backendMessage, setBackendMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      setVerificationState('loading');
      try {
        const result = await verify(token);
        setVerificationState('success');
        setErrorMessage('');
        setBackendMessage(result?.message || '');
      } catch (err) {
        setVerificationState('error');
        const errorMsg = (() => {
          const error = err as unknown;
          if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
            return (error.response.data as { message?: string }).message || "Failed to verify email";
          }
          return "An error occurred during email verification";
        })();
        setErrorMessage(errorMsg);
        setBackendMessage(errorMsg);
      }
    };

    if (token && !hasTriggered.current) {
      hasTriggered.current = true;
      verifyEmail();
    }
  }, [token, verify]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <CardTitle className="text-2xl font-bold text-gray-900">Invalid Link</CardTitle>
            <CardDescription className="text-gray-600">
              The verification link is invalid or missing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoToSignup} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3">
            <LoadingSpinner size="lg" className="mx-auto text-blue-600" />
            <CardTitle className="text-2xl font-bold text-gray-900">Verifying Email</CardTitle>
            <CardDescription className="text-gray-600">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <CardTitle className="text-2xl font-bold text-gray-900">Verification Failed</CardTitle>
            <CardDescription className="text-gray-600">
              {backendMessage || 'There was an error verifying your email address.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {errorMessage || "Failed to verify email"}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleGoToSignup} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verified!</CardTitle>
            <CardDescription className="text-gray-600">
              {backendMessage || 'Your email has been successfully verified. You can now access your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoToDashboard} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3">
          <LoadingSpinner size="lg" className="mx-auto text-blue-600" />
          <CardTitle className="text-2xl font-bold text-gray-900">Initializing...</CardTitle>
          <CardDescription className="text-gray-600">
            Preparing email verification...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}