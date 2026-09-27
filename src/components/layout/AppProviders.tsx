import Ad from "@/src/components/ad/Ad";
import { AuthProvider } from "@/src/hooks/useAuth";
import { ThemeProvider } from "@/src/components/theme-provider";
import { AdConfigProvider } from "@/src/hooks/useAdConfig";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <AdConfigProvider>
        <AuthProvider>
          {children}
          <Ad />
        </AuthProvider>
      </AdConfigProvider>
    </ThemeProvider>
  );
}
