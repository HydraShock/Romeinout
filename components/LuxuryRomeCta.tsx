import React, { useEffect, useRef, useState } from "react";

type CopyTarget = "phone" | "email" | null;

interface LuxuryRomeCtaProps {
  onBookTour?: () => void;
  bookHref?: string;
  className?: string;
}

const PHONE_LABEL = "+39 375 605 1114";
const PHONE_LINK = "tel:+393756051114";
const EMAIL = "info@tuktukroma.it";

const CalendarIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);

const PhoneIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 17.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 3h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.64 2.63a2 2 0 0 1-.45 2.11L8 10.97a16 16 0 0 0 5.04 5.04l1.51-1.3a2 2 0 0 1 2.11-.45c.85.3 1.73.52 2.63.64A2 2 0 0 1 22 17.92z" />
  </svg>
);

const MailIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2.8" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

interface CopyButtonProps {
  copied: boolean;
  onCopy: () => void;
}

const CopyButton = ({ copied, onCopy }: CopyButtonProps) => (
  <button
    type="button"
    onClick={onCopy}
    className="relative inline-flex h-10 min-w-16 items-center justify-center rounded-full bg-[linear-gradient(120deg,#f5dba5_0%,#c38835_52%,#a56c24_100%)] px-4 text-xs font-semibold tracking-wide text-[#2f1905] shadow-[0_6px_18px_rgba(116,72,18,0.32)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_22px_rgba(154,97,26,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd98b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#edd7b0]"
    aria-label="Copia contatto"
  >
    Copia
    <span
      className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#2f1a09]/95 px-2 py-1 text-[11px] font-medium text-[#fff7e2] shadow-md transition duration-200 ${
        copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      Copiato!
    </span>
  </button>
);

const LuxuryRomeCta: React.FC<LuxuryRomeCtaProps> = ({
  onBookTour,
  bookHref = "/prenota",
  className = "",
}) => {
  const [copied, setCopied] = useState<CopyTarget>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const showCopiedState = (target: Exclude<CopyTarget, null>) => {
    setCopied(target);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopied(null), 1500);
  };

  const copyValue = async (value: string, target: Exclude<CopyTarget, null>) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (typeof document !== "undefined") {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }
      showCopiedState(target);
    } catch {
      // Silent fail to avoid blocking interactions.
    }
  };

  const handleBookClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onBookTour) return;
    event.preventDefault();
    onBookTour();
  };

  return (
    <section className={`relative isolate w-full overflow-hidden py-16 sm:py-20 ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/rome-bg.jpg')" }}
      />

      {/* Atmosfera oro + scrim per garantire leggibilita del contenuto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(120deg, rgba(43,26,9,0.58) 0%, rgba(106,69,28,0.34) 38%, rgba(245,206,139,0.36) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-80 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,226,166,0.45), transparent 42%), radial-gradient(circle at 82% 20%, rgba(255,230,178,0.42), transparent 46%), radial-gradient(circle at 52% 78%, rgba(210,134,42,0.34), transparent 58%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,221,149,0.95) 0.8px, transparent 1px), radial-gradient(rgba(255,201,120,0.75) 0.8px, transparent 1px)",
          backgroundPosition: "0 0, 12px 12px",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex min-h-[480px] max-w-[1180px] items-center justify-center py-8 sm:py-12">
          {/* Layer obbligatori: due marble cards sfocate dietro la card principale */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-5 top-1/2 z-0 h-[260px] w-[230px] -translate-y-1/2 rounded-[30px] border border-[#f1d194]/55 opacity-75 blur-[14px] sm:-left-16 sm:h-[340px] sm:w-[350px] sm:scale-[0.98] lg:-left-24 lg:h-[392px] lg:w-[430px] lg:-translate-y-[53%] lg:scale-[0.97]"
            style={{ backgroundImage: "url('/assets/marble.jpg')", backgroundSize: "cover" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 top-1/2 z-0 h-[260px] w-[230px] -translate-y-1/2 rounded-[30px] border border-[#f1d194]/55 opacity-75 blur-[14px] sm:-right-16 sm:h-[340px] sm:w-[350px] sm:scale-[0.98] lg:-right-24 lg:h-[392px] lg:w-[430px] lg:-translate-y-[47%] lg:scale-[0.97]"
            style={{ backgroundImage: "url('/assets/marble.jpg')", backgroundSize: "cover" }}
          />

          {/* Doppio bordo oro: outer gradient crisp + inner highlight premium */}
          <div className="relative z-10 w-full rounded-[32px] bg-[linear-gradient(130deg,#f7e5ba_0%,#d49d4d_33%,#a66a24_62%,#f3ce8f_100%)] p-[2px] shadow-[0_26px_68px_rgba(45,24,6,0.42),0_0_26px_rgba(230,169,64,0.22)]">
            <div className="rounded-[30px] bg-[linear-gradient(145deg,rgba(255,249,236,0.9)_0%,rgba(244,222,182,0.78)_55%,rgba(255,250,239,0.9)_100%)] p-[1px]">
              <div className="relative overflow-hidden rounded-[29px] px-5 pb-6 pt-16 sm:px-9 sm:pb-9 sm:pt-20 lg:min-h-[438px] lg:px-14">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/assets/marble.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,252,243,0.86) 0%, rgba(247,237,216,0.72) 45%, rgba(239,224,194,0.84) 100%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 14% 26%, rgba(255,244,212,0.5), transparent 42%), radial-gradient(circle at 86% 72%, rgba(194,126,37,0.2), transparent 54%)",
                  }}
                />

                <div className="relative z-20">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="rounded-2xl bg-[linear-gradient(130deg,#f6e0af_0%,#be8132_52%,#f2cb88_100%)] p-[2px] shadow-[0_12px_28px_rgba(70,38,8,0.32)]">
                      <div className="rounded-[15px] bg-[linear-gradient(145deg,rgba(255,250,236,0.95),rgba(240,224,190,0.84))] p-[1px]">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-[14px] text-[#8e5e1f]"
                          style={{
                            backgroundImage: "url('/assets/marble.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <CalendarIcon />
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="absolute right-0 top-0 inline-flex rounded-full border border-[#d4a251]/70 bg-[#fff8ea]/88 px-4 py-1.5 text-sm font-medium text-[#603b17] shadow-[0_8px_18px_rgba(97,55,15,0.18)] sm:right-1 sm:top-1 sm:px-5">
                    {"Disponibilit\u00e0 Live"}
                  </span>

                  <div className="mx-auto flex max-w-[820px] flex-col items-center pt-2 text-center sm:pt-4">
                    <h2
                      className="text-[2.25rem] font-semibold leading-[1.1] text-[#4a2d11] drop-shadow-[0_2px_2px_rgba(255,247,226,0.45)] sm:text-[3.15rem]"
                      style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
                    >
                      Pronti a Vivere Roma?
                    </h2>

                    <p className="mt-4 max-w-[760px] text-lg font-medium leading-relaxed text-[#5f3d1b] sm:text-[2rem] sm:leading-[1.45]">
                      {"Prenota ora il tuo tour in tuk tuk e scopri la magia della citt\u00e0 eterna"}
                    </p>

                    <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                      <a
                        href={bookHref}
                        onClick={handleBookClick}
                        className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(120deg,#a86b25_0%,#d9a758_44%,#8d5318_100%)] px-9 text-[1.72rem] font-semibold tracking-[0.01em] text-[#fff9ea] shadow-[0_12px_26px_rgba(104,58,12,0.35)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_30px_rgba(167,108,30,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe2a4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebd4a8] sm:w-auto"
                      >
                        <span className="relative z-10">Prenota il Tuo Tour</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.07)_42%,rgba(255,255,255,0.22)_100%)] opacity-85 transition duration-300 group-hover:opacity-100"
                        />
                      </a>

                      <a
                        href={PHONE_LINK}
                        className="inline-flex h-14 w-full items-center justify-center rounded-full border border-[#be8536]/70 bg-[#fff7e7]/84 px-8 text-[1.72rem] font-semibold text-[#5b3918] shadow-[0_10px_20px_rgba(97,57,16,0.2)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_26px_rgba(164,105,33,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d791] focus-visible:ring-offset-2 focus-visible:ring-offset-[#edd8b0] sm:w-auto"
                      >
                        Chiama Ora
                      </a>
                    </div>

                    <p className="mt-3 text-sm font-medium tracking-wide text-[#60401f]">
                      Risposta rapida su WhatsApp
                    </p>
                  </div>

                  <div className="mt-8 grid w-full gap-4 md:grid-cols-2">
                    <div className="rounded-[22px] bg-[linear-gradient(130deg,#f6dfb3_0%,#c48734_52%,#f2cd8c_100%)] p-[1px] shadow-[0_12px_28px_rgba(67,39,10,0.22)]">
                      <div className="flex items-center justify-between gap-3 rounded-[21px] border border-white/45 bg-[rgba(255,246,227,0.82)] px-4 py-4 backdrop-blur-sm sm:px-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8a75c]/70 bg-[#fff5df] text-[#8b5a1e] shadow-[0_6px_14px_rgba(106,66,21,0.18)]">
                            <PhoneIcon />
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#6d4722]">
                              Chiama
                            </p>
                            <a
                              href={PHONE_LINK}
                              className="mt-0.5 block text-2xl font-semibold leading-tight text-[#3c220c] hover:text-[#7a4a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4b86c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0dfc0] sm:text-[2rem]"
                            >
                              {PHONE_LABEL}
                            </a>
                          </div>
                        </div>
                        <CopyButton
                          copied={copied === "phone"}
                          onCopy={() => copyValue(PHONE_LABEL, "phone")}
                        />
                      </div>
                    </div>

                    <div className="rounded-[22px] bg-[linear-gradient(130deg,#f6dfb3_0%,#c48734_52%,#f2cd8c_100%)] p-[1px] shadow-[0_12px_28px_rgba(67,39,10,0.22)]">
                      <div className="flex items-center justify-between gap-3 rounded-[21px] border border-white/45 bg-[rgba(255,246,227,0.82)] px-4 py-4 backdrop-blur-sm sm:px-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8a75c]/70 bg-[#fff5df] text-[#8b5a1e] shadow-[0_6px_14px_rgba(106,66,21,0.18)]">
                            <MailIcon />
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#6d4722]">
                              Scrivi
                            </p>
                            <a
                              href={`mailto:${EMAIL}`}
                              className="mt-0.5 block text-2xl font-semibold leading-tight text-[#3c220c] hover:text-[#7a4a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4b86c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0dfc0] sm:text-[2rem]"
                            >
                              {EMAIL}
                            </a>
                          </div>
                        </div>
                        <CopyButton copied={copied === "email"} onCopy={() => copyValue(EMAIL, "email")} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryRomeCta;
