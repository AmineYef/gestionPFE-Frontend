import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("API response:", data); // debug

      if (!res.ok) {
        throw new Error(data.message ?? `Erreur ${res.status}`);
      }

      // Adapter selon le format du backend
      // Supporte: { accessToken, user } | { token, user } | { data: { token, user } } | tout à plat
      const token =
        data.accessToken ??
        data.token ??
        data.access_token ??
        data.data?.accessToken ??
        data.data?.token;

      const userObj =
        data.user ??
        data.data?.user ??
        (data.role ? { id: data.id, name: data.name, email: data.email, role: data.role } : null);

      if (!token || !userObj) {
        console.error("Format inattendu:", data);
        throw new Error("Format de réponse inattendu. Vérifiez la console DevTools.");
      }

      if (!userObj.role) {
        console.error("role manquant dans:", userObj);
        throw new Error(`Champ 'role' absent. Recu: ${JSON.stringify(userObj)}`);
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userObj));

      switch (userObj.role) {
        case "Student":
          window.location.href = "/student/dashboard";
          break;
        case "UniSupervisor":
          window.location.href = "/uni/dashboard";
          break;
        case "CompSupervisor":
          window.location.href = "/com/dashboard";
          break;
        default:
          throw new Error(`Role inconnu recu: "${userObj.role}"`);
      }
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Entrez vos identifiants pour acceder a PFE Tracker
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            required
            className="bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground">
              Mot de passe oublie ?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
            Creer un compte
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
