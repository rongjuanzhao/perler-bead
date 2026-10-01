import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CookieSettingsButton } from "@/src/components/analytics/CookieConsent";

export { siteUrl } from "@/src/config/site";
export const legalContactEmail = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "dongshan1025@gmail.com";

type LegalPageShellProps = {
  children: React.ReactNode;
  description: string;
  lastUpdated: string;
  title: string;
};

export function LegalPageShell({ children, description, lastUpdated, title }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#F3EBE2] text-[#1A1A1A]">
      <header className="border-b border-[#C5BEB6] bg-[#F3EBE2]">
        <div className="mx-auto flex min-h-17 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-[-0.03em] text-[#1A1A1A]">
            <img src="/logo.jpg" alt="" className="size-8" />
            <span className="text-[15px]">Video to Frames</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[#C5BEB6] px-3 py-2 text-xs font-bold text-[#3D3D3D] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="size-3.5" />
            Back to tool
          </Link>
        </div>
      </header>

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-3xl">
          <div className="border-b border-[#1A1A1A] pb-8">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#A85C40]">LEGAL / VIDEO TO FRAMES</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-[#1A1A1A] sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#3D3D3D]">{description}</p>
            <p className="mt-5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[#6B6B6B]">LAST UPDATED / {lastUpdated}</p>
          </div>

          <div className="space-y-10 py-10 text-sm leading-7 text-[#3D3D3D] [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.03em] [&_h2]:text-[#1A1A1A] [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#1A1A1A] [&_a]:font-semibold [&_a]:text-[#1A1A1A] [&_a]:underline [&_a]:decoration-[#A85C40] [&_a]:underline-offset-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </main>

      <footer className="border-t border-[#C5BEB6] px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 text-xs text-[#6B6B6B] sm:flex-row sm:items-center">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-[#375F50]" />
            Video processing stays in your browser.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-[#1A1A1A]">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#1A1A1A]">Terms of Service</Link>
            <CookieSettingsButton className="text-[#6B6B6B] hover:text-[#1A1A1A]" />
          </nav>
        </div>
      </footer>
    </div>
  );
}
