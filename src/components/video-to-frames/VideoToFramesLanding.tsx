import Link from "next/link";
import {
  Download,
  ImageIcon,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Video,
  Zap,
} from "lucide-react";
import { VideoToFramesTool } from "@/src/components/video-to-frames/VideoToFramesTool";
import { CookieSettingsButton } from "@/src/components/analytics/CookieConsent";

type VideoToFramesLandingProps = {
  toolPath: string;
  structuredData?: Record<string, unknown>;
};

export const videoToFramesTitle = "Video to Frames: Free Video Frame Extractor & Photo from Video";
export const videoToFramesDescription =
  "Video to Frames is a free Video Frame Extractor to extract frames from video and save a photo from video as JPG, PNG, or WebP. Private, fast, and browser-based.";

export const videoToFramesFaqItems = [
  {
    question: "How do I extract frames from video?",
    answer:
      "Choose a video from your device, set the capture range and interval, then select Extract Frames. Preview the frames from video and download individual images or a ZIP file.",
  },
  {
    question: "Can I save a photo from video?",
    answer:
      "Yes. This Video Frame Extractor turns a chosen video moment into a JPG, PNG, or WebP photo. Pick a short range and use a small interval to find the exact moment you want.",
  },
  {
    question: "Is my video uploaded anywhere?",
    answer:
      "No. The video to frames tool uses your browser to decode the video and create image files locally. The video never leaves your device.",
  },
  {
    question: "Which video formats work?",
    answer:
      "MP4 (H.264) and WebM are the most reliable choices. Other formats may work when their codec is supported by your browser.",
  },
  {
    question: "Can I extract every exact video frame?",
    answer:
      "This fast video frame extractor is designed for time-based captures. It samples a video at the interval you choose, which is ideal for screenshots, photos from video, and storyboards.",
  },
  {
    question: "Why is there a frame limit?",
    answer:
      "Frames are generated and kept in browser memory until you download them. A limit keeps the video to frames tool responsive and protects your device on large videos.",
  },
];

export function createVideoToFramesStructuredData(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Video to Frames",
        url: pageUrl,
        description: videoToFramesDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires a modern browser with HTML5 video support.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Extract frames from video",
          "Save a photo from video",
          "JPG, PNG, and WebP output",
          "Local browser processing",
          "ZIP download",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: videoToFramesFaqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

function SiteHeader({ toolPath }: { toolPath: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#C5BEB6] bg-[#F3EBE2]/95 backdrop-blur">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={toolPath} className="group flex items-center gap-2.5 text-[#1A1A1A]">
          <img src="/logo.jpg" alt="" className="size-8" />
          <span className="text-[15px] font-bold tracking-[-0.03em]">Video to Frames</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden items-center gap-6 text-xs font-semibold text-[#3D3D3D] sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-[#A85C40]">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-[#A85C40]">
              FAQ
            </a>
          </nav>
          <span className="inline-flex items-center gap-1.5 border border-[#C5BEB6] px-2.5 py-1.5 font-mono text-[9px] font-semibold tracking-[0.11em] text-[#3D3D3D]">
            <span className="size-1.5 bg-[#375F50]" />
            LOCAL ONLY
          </span>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A85C40]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-[#1A1A1A] sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-[#3D3D3D]">{description}</p>
    </div>
  );
}

export function VideoToFramesLanding({ toolPath, structuredData }: VideoToFramesLandingProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3EBE2] text-[#1A1A1A]">
      <SiteHeader toolPath={toolPath} />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      )}

      <main>
        <section className="border-b border-[#C5BEB6] px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-9 py-12 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end lg:gap-16 lg:py-16">
              <div className="max-w-3xl">
                <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#A85C40]">
                  EXTRACT STILLS / 100% IN BROWSER
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.065em] text-[#1A1A1A] sm:text-6xl sm:leading-[0.98]">
                  Video to Frames: extract the <span className="inline-block bg-[#1A1A1A] px-2.5 pb-1.5 pt-0.5 text-[#FFFDF8]">right frames.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#3D3D3D] sm:text-lg">
                  Video to Frames is a private video frame extractor: load a clip, choose a range, and extract clean video frames without sending the video anywhere.
                </p>
              </div>

              <div className="border-l border-[#1A1A1A] pl-5 lg:mb-1">
                <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#6B6B6B]">SESSION / READY</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#1A1A1A]">Your files stay on this device.</p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.07em] text-[#6B6B6B]">MP4 · WEBM · JPG · PNG · WEBP</p>
              </div>
            </div>

            <div id="tool" className="scroll-mt-24 border-t border-[#C5BEB6] py-7 sm:py-9">
              <VideoToFramesTool />
            </div>

            <div className="grid border-t border-[#C5BEB6] sm:grid-cols-3">
              {[
                ["0", "UPLOADS", "Your source stays in the browser."],
                ["0", "SIGN-UPS", "Open the tool and start working."],
                ["3", "EXPORT FORMATS", "JPG, PNG, and WebP are ready."],
              ].map(([value, label, copy]) => (
                <div key={label} className="flex gap-3 border-b border-[#C5BEB6] px-4 py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:not-last:border-r">
                  <span className="font-mono text-xl font-bold tracking-[-0.08em] text-[#1A1A1A]">{value}</span>
                  <div>
                    <p className="font-mono text-[9px] font-semibold tracking-[0.11em] text-[#6B6B6B]">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-[#3D3D3D]">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-[#C5BEB6] bg-[#FFFDF8] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="How to extract frames from video"
              title="A direct way to extract frames from video."
              description="Use Video to Frames, a private video frame extractor, for screenshots, storyboards, references, and every moment worth saving."
            />
            <div className="mt-10 grid border border-[#C5BEB6] md:grid-cols-3">
              {[
                {
                  number: "01",
                  icon: Video,
                  title: "Choose a video to extract frames",
                  copy: "Select a video from your device. Video to Frames reads it locally, directly in your browser.",
                },
                {
                  number: "02",
                  icon: Zap,
                  title: "Set the capture range",
                  copy: "Pick the start and end time, interval, image size, and your preferred output format.",
                },
                {
                  number: "03",
                  icon: Download,
                  title: "Keep the stills you need",
                  copy: "Preview every captured frame, then download individual images or a ZIP file.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <article key={step.number} className="border-b border-[#C5BEB6] p-6 last:border-b-0 md:border-b-0 md:not-last:border-r sm:p-8">
                    <div className="flex items-start justify-between">
                      <span className="flex size-10 items-center justify-center bg-[#1A1A1A] text-[#F3EBE2]">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#A85C40]">{step.number}</span>
                    </div>
                    <h3 className="mt-9 text-lg font-bold tracking-[-0.03em] text-[#1A1A1A]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#3D3D3D]">{step.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[#C5BEB6] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl border border-[#C5BEB6] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#1A1A1A] p-8 text-[#FFFDF8] sm:p-10">
              <div className="flex size-11 items-center justify-center border border-[#D4916E] text-[#D4916E]">
                <LockKeyhole className="size-5" />
              </div>
              <p className="mt-8 font-mono text-[10px] font-semibold tracking-[0.12em] text-[#D4916E]">PRIVACY BY DESIGN</p>
              <h2 className="mt-3 max-w-md text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
                A video frame extractor that keeps your video on your device.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#E5DED5]">
                Extraction uses browser APIs on this device. There is no account, server upload, or cloud processing step between your video and the photos you save.
              </p>
            </div>
            <div className="grid bg-[#FFFDF8] sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: ImageIcon,
                  title: "Useful output controls",
                  copy: "Export JPG, PNG, or WebP and resize frames without opening another editor.",
                },
                {
                  icon: MonitorSmartphone,
                  title: "Works in modern browsers",
                  copy: "MP4 and WebM work best. Compatibility depends on the codecs supported by your browser.",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className={index === 0 ? "border-b border-[#C5BEB6] p-7 sm:p-8" : "p-7 sm:p-8"}>
                    <Icon className="size-5 text-[#A85C40]" />
                    <h3 className="mt-5 text-lg font-bold tracking-[-0.03em] text-[#1A1A1A]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#3D3D3D]">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="frames-from-video" className="border-b border-[#C5BEB6] bg-[#FFFDF8] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Frames from video, made simple"
              title="Video to Frames for one useful moment."
              description="This video frame extractor is built for the common tasks that start with a clip and end with a sequence, a storyboard, or one sharp still."
            />
            <div className="mt-10 grid border border-[#C5BEB6] md:grid-cols-2">
              <article className="border-b border-[#C5BEB6] p-7 md:border-b-0 md:border-r sm:p-8">
                <p className="font-mono text-[10px] font-semibold tracking-[0.1em] text-[#A85C40]">WIDER RANGE</p>
                <h3 className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#1A1A1A]">Extract frames for a storyboard</h3>
                <p className="mt-3 text-sm leading-7 text-[#3D3D3D]">
                  Choose a wider range and a regular interval to create a sequence of frames. It is a quick way to review scenes, prepare a storyboard, or choose stills before editing.
                </p>
              </article>
              <article className="p-7 sm:p-8">
                <p className="font-mono text-[10px] font-semibold tracking-[0.1em] text-[#A85C40]">SHORTER RANGE</p>
                <h3 className="mt-3 text-xl font-bold tracking-[-0.04em] text-[#1A1A1A]">Turn one video moment into a photo</h3>
                <p className="mt-3 text-sm leading-7 text-[#3D3D3D]">
                  Narrow the range, use a shorter interval, and select the sharpest result. Save a photo from video in JPG, PNG, or WebP without a desktop video editor.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-b border-[#C5BEB6] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-18">
            <SectionHeading
              eyebrow="Video to Frames FAQ"
              title="The practical details."
              description="Answers about extracting photos and sequences from video in your browser."
            />
            <div className="border-y border-[#C5BEB6]">
              {videoToFramesFaqItems.map((item, index) => (
                <details key={item.question} className={index === videoToFramesFaqItems.length - 1 ? "group py-5" : "group border-b border-[#C5BEB6] py-5"}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-bold text-[#1A1A1A] marker:hidden">
                    {item.question}
                    <span className="shrink-0 font-mono text-lg font-normal text-[#A85C40] group-open:hidden">+</span>
                    <span className="hidden shrink-0 font-mono text-lg font-normal text-[#A85C40] group-open:block">−</span>
                  </summary>
                  <p className="max-w-2xl pt-3 text-sm leading-6 text-[#3D3D3D]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-xs text-[#6B6B6B] sm:flex-row sm:text-left">
          <p>© 2026 Video to Frames. Private video frame extraction.</p>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <p className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em]">
              <ShieldCheck className="size-3.5 text-[#375F50]" />
              YOUR FILES STAY WITH YOU
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:justify-end">
              <Link href="/privacy-policy" className="hover:text-[#1A1A1A]">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#1A1A1A]">Terms of Service</Link>
              <CookieSettingsButton className="text-[#6B6B6B] hover:text-[#1A1A1A]" />
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
