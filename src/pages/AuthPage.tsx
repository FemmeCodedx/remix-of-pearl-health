import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const forgotCopy = {
  en: {
    link: "Forgot password?",
    title: "Reset your password",
    subtitle: "Enter your email and we'll send you a reset link.",
    submit: "Send reset link",
    submitting: "Sending...",
    sent: "Check your email",
    sentDesc: "We sent you a link to reset your password.",
    back: "Back to sign in",
  },
  es: {
    link: "¿Olvidaste tu contraseña?",
    title: "Restablece tu contraseña",
    subtitle: "Ingresa tu correo y te enviaremos un enlace.",
    submit: "Enviar enlace",
    submitting: "Enviando...",
    sent: "Revisa tu correo",
    sentDesc: "Te enviamos un enlace para restablecer tu contraseña.",
    back: "Volver a iniciar sesión",
  },
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const fc = forgotCopy[lang];

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: fc.sent, description: fc.sentDesc });
      setForgotMode(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a verification link to confirm your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
            {t.appName}
          </h1>
          <p className="text-muted-foreground font-body mt-2">{t.tagline}</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required={!isLogin}
                  className="rounded-xl"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="rounded-xl"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl gradient-femme text-primary-foreground font-body font-semibold h-11"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary font-body hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-body">
          <Link to="/legal/terms" className="hover:text-foreground hover:underline">{t.terms}</Link>
          <Link to="/legal/privacy" className="hover:text-foreground hover:underline">{t.privacyPolicy}</Link>
          <Link to="/legal/refund" className="hover:text-foreground hover:underline">{t.refundPolicy}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
