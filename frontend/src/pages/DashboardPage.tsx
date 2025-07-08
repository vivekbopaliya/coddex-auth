import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLogout } from '@/hooks/useLogout';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { useVerificationCheck } from '@/hooks/useVerificationCheck';

export function DashboardPage() {
  const { data: authStatus, isLoading } = useVerificationCheck();
  const { mutateAsync: logout, isPending: isLoggingOut, error: logoutError } = useLogout();
  const navigate = useNavigate();

  const getLogoutErrorMessage = () => {
    if (!logoutError) return '';
    
    const err = logoutError as unknown;
    if (err && typeof err === "object" && "response" in err && err.response && 
        typeof err.response === "object" && "data" in err.response && err.response.data && 
        typeof err.response.data === "object" && "message" in err.response.data) {
      return (err.response.data as { message?: string }).message || "Failed to logout";
    }
    return "Failed to logout";
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast("Logout Successful", {
        description: "You have been logged out successfully. Redirecting to login...",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const logoutErrorMessage = getLogoutErrorMessage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your account</p>
          </div>
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="h-10 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium w-full md:w-auto"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 text-gray-700" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
            
            {logoutErrorMessage && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 w-full md:w-64">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600 text-sm">{logoutErrorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl text-gray-900">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Account Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{authStatus?.email || 'Loading...'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  Status: {authStatus?.data === true ? 'Verified' : 'Unverified'}
                </span>
                {authStatus?.data === true ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl text-gray-900">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Email Verification
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your email verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authStatus?.data === true ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Your email has been verified! You have full access to your account.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    Your email is not verified yet. Please check your inbox for the verification link.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-gray-900">Account Features</CardTitle>
            <CardDescription className="text-gray-600">
              Features available with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 text-base">Secure Authentication</h3>
                <p className="text-sm text-blue-700">Your account is protected with secure session management</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 text-base">Email Verification</h3>
                <p className="text-sm text-green-700">Verify your email to unlock all features</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 text-base">Profile Management</h3>
                <p className="text-sm text-purple-700">Manage your account settings and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
