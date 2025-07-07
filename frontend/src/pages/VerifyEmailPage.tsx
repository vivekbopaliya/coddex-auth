import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from 'lucide-react';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {mutateAsync: verify, isPending, error} = useVerifyEmail();
  const token = searchParams.get('token');
  const hasTriggered = useRef(false); 


  useEffect(() => {
    if (token && !hasTriggered.current) {
      hasTriggered.current = true;

      verify(token, { 
        onSuccess: (data) => {
          toast("Success", {
            description: data.message,
          });
        },
        onError: (error: unknown) => {
          let message = "Failed to verify email";
          if (
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object" &&
            "message" in error.response.data
          ) {
            message =
              (error.response.data as { message?: string }).message || message;
          }
          toast("Error", {
            description: message,
          });
        },
      });
    }
  }, [token, verify]); // Fixed: was verifyEmail

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
            <CardDescription>
              The verification link is invalid or missing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoToLogin} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPending) { // Fixed: was verifyEmail.isPending
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) { // Fixed: was verifyEmail.error
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
            <CardDescription>
              There was an error verifying your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && ( // Fixed: was verifyEmail.error
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(() => {
                    const err = error as unknown; // Fixed: was verifyEmail.error
                    if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
                      return (err.response.data as { message?: string }).message || "Failed to verify email";
                    }
                    return "Failed to verify email";
                  })()}
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleGoToLogin} className="w-full mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoToDashboard} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}