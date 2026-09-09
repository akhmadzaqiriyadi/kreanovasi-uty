import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
  title: "Daftar Akun Baru",
  description: "Buat akun NextBoi kustom Anda gratis.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 relative z-10">
      <RegisterForm />
    </div>
  );
}
