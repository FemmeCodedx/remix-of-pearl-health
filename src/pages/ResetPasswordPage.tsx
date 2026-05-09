import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const copy = {
  en: {
    title: "Reset password",
    subtitle: "Choose a new password for your account.",
    newPassword: "New password",
    confirm: "Confirm password",
    submit: "Update password",
    submitting: "Updating...",
    success: "Password updated",
    successDesc: "Sign in with your new password.",
    mismatch: "Passwords do not match.",
    invalid: "Invalid or expired reset link.",
    backToSignIn: "Back to sign in",
    resendSubtitle: "Enter your email and we'll send you a new reset link.",
    emailLabel: "Email",
    resend: "Resend reset link",
    resending: "Sending...",
    resent: "Email sent",
    resentDesc: "We sent you a new reset link. Check your inbox.",
  },
  es: {
    title: "Restablecer contraseña",
    subtitle: "Elige una nueva contraseña para tu cuenta.",
    newPassword: "Nueva contraseña",
    confirm: "Confirmar contraseña",
    submit: "Actualizar contraseña",
    submitting: "Actualizando...",
    success: "Contraseña actualizada",
    successDesc: "Inicia sesión con tu nueva contraseña.",
    mismatch: "Las contraseñas no coinciden.",
    invalid: "Enlace de restablecimiento inválido o expirado.",
    backToSignIn: "Volver a iniciar sesión",
    resendSubtitle: "Ingresa tu correo y te enviaremos un nuevo enlace.",
    emailLabel: "Correo",
    resend: "Reenviar enlace",
    resending: "Enviando...",
    resent: "Correo enviado",
    resentDesc: "Te enviamos un nuevo enlace. Revisa tu bandeja de entrada.",
  },
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang } = useI18n();
  const c = copy[lang];

  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setChecked(true);
      }
    });

    // Fallback: if a session already exists from the recovery hash
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: c.mismatch, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: c.success, description: c.successDesc });
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
        <div className="bg-card rounded-2xl shadow-card p-6">
          <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2">
            {c.title}
          </h1>
          <p className="text-sm text-muted-foreground font-body text-center mb-6">
            {c.subtitle}
          </p>

          {checked && !ready ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground font-body">{c.invalid}</p>
              <Link to="/auth" className="text-sm text-primary font-body hover:underline">
                {c.backToSignIn}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body">{c.newPassword}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="font-body">{c.confirm}</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !ready}
                className="w-full rounded-xl gradient-femme text-primary-foreground font-body font-semibold h-11"
              >
                {loading ? c.submitting : c.submit}
              </Button>
              <div className="text-center">
                <Link to="/auth" className="text-sm text-primary font-body hover:underline">
                  {c.backToSignIn}
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
