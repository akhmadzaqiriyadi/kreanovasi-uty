import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Masuk ke Akun Anda",
  description: "Masuk ke dashboard panel NextBoi Anda.",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 relative z-10">
      <LoginForm />
    </div>
  );
}
