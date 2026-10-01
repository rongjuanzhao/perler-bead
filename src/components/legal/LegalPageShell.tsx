import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CookieSettingsButton } from "@/src/components/analytics/CookieConsent";
import { enMessages } from "@/src/features/bead-home/messages/en";

export const legalContactEmail = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "dongshan1025@gmail.com";

type LegalPageShellProps = {
  children: React.ReactNode;
  description: string;
  lastUpdated: string;
  title: string;
};

export function LegalPageShell({ children, description, lastUpdated, title }: LegalPageShellProps) {
  const [accentName, ...baseName] = enMessages.brandName.split(" ");

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#21213B]">
      <header className="border-b border-[#E8E0D5] bg-[#FFF9F1]">
        <div className="mx-auto flex min-h-17 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={enMessages.header.homeLabel} className="flex items-center gap-2.5 font-extrabold tracking-[-0.05em]">
            <img src="/perlerbeadmake-mark.svg" alt="" className="size-10" />
            <span className="text-lg"><span className="text-[#EE6A55]">{accentName}</span>{" "}<span className="text-[#21213B]">{baseName.join(" ")}</span></span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E3DDD3] bg-white px-4 py-2 text-xs font-bold text-[#56515F] transition-colors hover:border-[#EE6A55] hover:text-[#EE6A55]"
          >
            <ArrowLeft className="size-3.5" />
            Back to pattern maker
          </Link>
        </div>
      </header>

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-3xl">
          <div className="border-b border-[#E3DDD3] pb-8">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#EE6A55]">LEGAL / PERLER BEAD PATTERN MAKER</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-[#21213B] sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#56515F]">{description}</p>
            <p className="mt-5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[#7D7987]">LAST UPDATED / {lastUpdated}</p>
          </div>

          <div className="space-y-10 py-10 text-sm leading-7 text-[#56515F] [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.03em] [&_h2]:text-[#21213B] [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#21213B] [&_a]:font-semibold [&_a]:text-[#21213B] [&_a]:underline [&_a]:decoration-[#EE6A55] [&_a]:underline-offset-2 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </main>

      <footer className="border-t border-[#E8E0D5] px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 text-xs text-[#7D7987] sm:flex-row sm:items-center">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-[#EE6A55]" />
            Image-to-pattern processing stays in your browser.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-[#21213B]">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#21213B]">Terms of Service</Link>
            <CookieSettingsButton className="text-[#7D7987] hover:text-[#21213B]" />
          </nav>
        </div>
      </footer>
    </div>
  );
}
