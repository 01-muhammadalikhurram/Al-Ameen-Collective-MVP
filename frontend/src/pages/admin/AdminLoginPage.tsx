import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, User, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { useLogin } from '../../api/auth';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg('');
    try {
      await loginMutation.mutateAsync(data);
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md px-4 sm:px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="backdrop-blur-xl bg-card/60 border border-border shadow-2xl rounded-3xl p-8 sm:p-10"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-primary/20"
            >
              <Lock className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Admin Portal
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4 flex items-start gap-3"
              >
                <div className="mt-0.5">⚠️</div>
                <p>{errorMsg}</p>
              </motion.div>
            )}
            
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground ml-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <input
                  {...register('username')}
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm bg-background/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-destructive ml-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm bg-background/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Secure Login • Al Ameen Collective
        </p>
      </div>
    </div>
  );
}
