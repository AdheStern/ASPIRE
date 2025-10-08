import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-2xl hover:text-green-500"
            style={{ fontFamily: "'Audiowide', sans-serif" }}
          >
            ASPIRE
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block"></div>
    </div>
  );
}
