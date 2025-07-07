import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useLogout } from '@/hooks/useLogout';
import { useResendVerification } from '@/hooks/useResendVerification';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

export function DashboardPage() {
  const { data: authStatus, isLoading } = useAuthStatus();
  const logout = useLogout();
  const resendVerification = useResendVerification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast("Success", {
        description: "Logged out successfully",
      });
      navigate('/login');
    } catch (error: unknown) {
      let message = "Failed to logout";
      if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast("Error", {
        description: message,
      });
    }
  };

  const handleResendVerification = async () => {
    if (!authStatus?.email) return;
    
    try {
      const response = await resendVerification.mutateAsync(authStatus.email);
      toast("Success", {
        description: response.message,
      });
    } catch (error: unknown) {
      let message = "Failed to resend verification";
      if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
        message = (error.response.data as { message?: string }).message || message;
      }
      toast("Error", {
        description: message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authStatus) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to your account</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            disabled={logout.isPending}
          >
            {logout.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{authStatus.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  Status: {authStatus.emailVerified ? 'Verified' : 'Unverified'}
                </span>
                {authStatus.emailVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Verification */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Verification
              </CardTitle>
              <CardDescription>
                Manage your email verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authStatus.emailVerified ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your email has been verified! You have full access to your account.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your email is not verified yet. Please check your inbox for the verification link.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={handleResendVerification}
                    disabled={resendVerification.isPending}
                    className="w-full"
                  >
                    {resendVerification.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Account Features</CardTitle>
            <CardDescription>
              Features available with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Secure Authentication</h3>
                <p className="text-sm text-blue-700">Your account is protected with secure session management</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Email Verification</h3>
                <p className="text-sm text-green-700">Verify your email to unlock all features</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Profile Management</h3>
                <p className="text-sm text-purple-700">Manage your account settings and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}