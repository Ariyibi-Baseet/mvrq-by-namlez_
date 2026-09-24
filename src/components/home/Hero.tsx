import React, { useState, useEffect, useRef } from "react";

interface HeroProps {
  onExploreClick: () => void;
}

const SLIDE_INTERVAL = 6000; // ms between slides
const FADE_MS = 1500; // background crossfade
const ZOOM_MS = 8000; // slow zoom (desktop only)
const DESKTOP_IMAGE_OPACITY = 0.75; // 0 = fully dark, 1 = full brightness
const MOBILE_IMAGE_OPACITY = 1; // phones show the picture at full brightness
const SWIPE_THRESHOLD = 50; // px a finger must travel to change slide
const PAUSE_ON_HOVER = false; // set true if you want hover to pause the slider

const slides = [
  {
    // bg: "https://images.unsplash.com/photo-1643051589091-a8eecf62367a?auto=format&fit=crop&q=80&w=2000",
    bg: "https://res.cloudinary.com/dsfc1o1bp/image/upload/v1790196176/WhatsApp_Image_2026-09-21_at_12.40.32_PM_akcxsy.jpg",
    title: "Made for those",
    line2: "who don't need to",
    line3: "overstate their presence.",
  },
  {
    // bg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000",
    bg: "https://res.cloudinary.com/dsfc1o1bp/image/upload/v1790196176/WhatsApp_Image_2026-09-21_at_12.40.32_PM___u9nukt.jpg",
    title: "Considered cuts.",
    line2: "Heavyweight cottons.",
    line3: "Engineered drape.",
  },
  {
    // bg: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=2000",
    bg: "https://res.cloudinary.com/dsfc1o1bp/image/upload/v1790196180/WhatsApp_Image_2026-09-21_at_12.40.32_PM______tkqok2.jpg",
    title: "Silence as a statement.",
    line2: "Luxury in restraint.",
    line3: "Designed in Lagos.",
  },
];

/** Live-updating CSS media query. */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // md (768px) and up = full-bleed layout. Below that = stacked layout.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Preload all slide images so the crossfade never shows a blank frame
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.bg;
    });
  }, []);

  // Auto-advance. Depends on currentSlide so a click or swipe restarts the countdown.
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [currentSlide, paused]);

  const goTo = (i: number) =>
    setCurrentSlide((i + slides.length) % slides.length);

  // Swipe left / right on touch screens
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    goTo(dx < 0 ? currentSlide + 1 : currentSlide - 1);
  };

  return (
    <section
      onMouseEnter={() => PAUSE_ON_HOVER && setPaused(true)}
      onMouseLeave={() => PAUSE_ON_HOVER && setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden bg-navy-950 flex flex-col md:justify-end md:min-h-[calc(100svh-5rem)]"
    >
      {/* Keyframes for the progress dash */}
      <style>{`
        @keyframes hero-dash-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      {/* IMAGE LAYER
          Phones/small tablets: its own block above the text, showing the WHOLE image.
          md and up: absolute, fills the section behind the text (cover). */}
      <div className="relative md:absolute md:inset-0 w-full h-[60svh] min-h-[340px] max-h-[680px] md:h-auto md:min-h-0 md:max-h-none overflow-hidden">
        {slides.map((slide, idx) => {
          const active = idx === currentSlide;
          return (
            <div
              key={idx}
              className="absolute inset-0"
              style={{
                opacity: active
                  ? isDesktop
                    ? DESKTOP_IMAGE_OPACITY
                    : MOBILE_IMAGE_OPACITY
                  : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
                willChange: "opacity",
              }}
            >
              {/* Mobile only: blurred copy fills any empty space beside the portrait image */}
              <img
                src={slide.bg}
                alt=""
                aria-hidden="true"
                className="md:hidden absolute inset-0 w-full h-full object-cover filter grayscale blur-2xl scale-125 opacity-40"
              />

              {/* Main image: object-contain on mobile (nothing cropped), cover on desktop */}
              <img
                src={slide.bg}
                alt={slide.title}
                className="relative w-full h-full object-contain object-center md:object-cover md:object-[center_20%]"
                style={{
                  transform:
                    active && isDesktop && !reducedMotion
                      ? "scale(1.1)"
                      : "scale(1)",
                  transition:
                    reducedMotion || !isDesktop
                      ? "none"
                      : `transform ${ZOOM_MS}ms ease-out`,
                  willChange: "transform",
                }}
              />
            </div>
          );
        })}

        {/* Mobile only: soft fade from the image into the text area below */}
        <div className="md:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Desktop gradient overlay: darker only at the bottom, where the text sits */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent z-10 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-20 px-4 sm:px-6 md:px-12 pt-6 pb-6 md:pt-0 md:pb-16 max-w-[1600px] w-full mx-auto">
        {/* M.V.R.Q Border Badge */}
        <div className="mb-4 md:mb-6">
          <span className="magazine-label border border-white/50 px-4 py-2 text-white bg-navy-950/60 backdrop-blur-sm">
            M . V . R . Q
          </span>
        </div>

        {/* Headline: all three share one grid cell, so the container
            takes the height of the tallest one. */}
        <div className="mb-4 md:mb-5 max-w-2xl" style={{ display: "grid" }}>
          {slides.map((slide, idx) => {
            const active = idx === currentSlide;
            return (
              <h1
                key={idx}
                aria-hidden={!active}
                className="hero-headline text-white"
                style={{
                  gridArea: "1 / 1",
                  visibility: active ? "visible" : "hidden",
                  pointerEvents: active ? "auto" : "none",
                }}
              >
                {slide.title}
                <br />
                {slide.line2}
                <br />
                {slide.line3}
              </h1>
            );
          })}
        </div>

        {/* Tagline */}
        <p className="magazine-label text-white/70 mb-6 md:mb-8">
          TIMELESS PIECES. MODERN ESSENCE.
        </p>

        {/* Outlined Button: full width on phones */}
        <div>
          <button
            onClick={onExploreClick}
            className="outlined-btn cursor-pointer w-full sm:w-auto"
          >
            <span>EXPLORE THE COLLECTION</span>
            <span>→</span>
          </button>
        </div>

        {/* Controls. Phones: one row under the button (dashes left, counter right).
            md and up: `contents` removes this wrapper, so the dashes and counter
            position themselves against the content box like before. */}
        <div className="mt-8 flex items-center justify-between md:contents">
          {/* Indicator dashes with progress fill.
              The button is padded so it's an easy touch target; the bar inside is 2px. */}
          <div className="flex items-center -ml-1 md:ml-0 md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:z-20">
            {slides.map((_, idx) => {
              const active = idx === currentSlide;
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="py-3 px-1"
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={active}
                >
                  <span
                    className="relative block overflow-hidden"
                    style={{
                      width: active ? "32px" : "6px",
                      height: "2px",
                      backgroundColor: "rgba(255, 255, 255, 0.4)",
                      transition: "width 300ms ease",
                    }}
                  >
                    {active && (
                      <span
                        key={currentSlide} // restarts the animation on every slide change
                        className="absolute inset-0 bg-white"
                        style={{
                          transformOrigin: "left",
                          animation: `hero-dash-fill ${SLIDE_INTERVAL}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slide counter */}
          <div className="slide-counter md:absolute md:bottom-16 md:right-12 md:z-20">
            <span className="current">0{currentSlide + 1}</span>
            <span className="line" />
            <span>0{slides.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
