
import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPasswordReset = () => {
  const { toast } = useToast();
  
  // Default values as requested
  const [email, setEmail] = useState('Anthony.aacdm@gmail.com');
  const [newPassword, setNewPassword] = useState('070117Ar!');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email || !newPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in both email and new password fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Invoking admin-reset-password function...");
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { email, newPassword }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast({
        title: "Success! 🔐",
        description: `Password has been reset for ${email}`,
        className: "bg-green-600 text-white border-none",
      });

    } catch (err) {
      console.error("Reset error:", err);
      toast({
        title: "Reset Failed",
        description: err.message || "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-t-4 border-t-red-600 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldAlert className="text-red-600" />
              Admin Password Reset
            </CardTitle>
            <p className="text-sm text-gray-500">
              Force reset a user's password using Admin privileges.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Target User Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="text" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 font-mono"
                  />
                  <KeyRound className="absolute left-3 top-2.5 text-gray-400 w-[18px] h-[18px]" />
                </div>
                <p className="text-xs text-amber-600">
                  Note: Input is visible to verify exact characters.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  'Force Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPasswordReset;
