import React, { useState } from 'react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const slides = [
    {
      bg: "https://images.unsplash.com/photo-1643051589091-a8eecf62367a?auto=format&fit=crop&q=80&w=2000",
      title: "Made for those",
      line2: "who don't need to",
      line3: "overstate their presence.",
    },
    {
      bg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000",
      title: "Considered cuts.",
      line2: "Heavyweight cottons.",
      line3: "Engineered drape.",
    },
    {
      bg: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=2000",
      title: "Silence as a statement.",
      line2: "Luxury in restraint.",
      line3: "Designed in Lagos.",
    }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-navy-950 min-h-[calc(100vh-88px)] flex flex-col justify-end">
      
      {/* Background Images with Dark Blue Overlay */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <img
            src={slide.bg}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter grayscale mix-blend-luminosity"
          />
        </div>
      ))}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-900/30 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 px-6 md:px-12 pb-16 max-w-[1600px] w-full mx-auto">
        
        {/* M.V.R.Q Border Badge */}
        <div className="mb-6">
          <span className="magazine-label border border-white/50 px-4 py-2 text-white bg-navy-950/60 backdrop-blur-sm">
            M . V . R . Q
          </span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="hero-headline text-white mb-5 max-w-2xl">
          {slides[currentSlide].title}<br />
          {slides[currentSlide].line2}<br />
          {slides[currentSlide].line3}
        </h1>

        {/* Tagline */}
        <p className="magazine-label text-white/70 mb-8">
          TIMELESS PIECES. MODERN ESSENCE.
        </p>

        {/* Outlined Button */}
        <div>
          <button onClick={onExploreClick} className="outlined-btn cursor-pointer">
            <span>EXPLORE THE COLLECTION</span>
            <span>→</span>
          </button>
        </div>

        {/* Bottom Right Slide Counter (02 —— 03) */}
        <div className="absolute bottom-16 right-6 md:right-12 slide-counter z-20">
          <span className="current">0{currentSlide + 1}</span>
          <span className="line" />
          <span>03</span>
        </div>

        {/* Bottom Center Indicator Dashes */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="transition-all duration-300"
              style={{
                width: idx === currentSlide ? '24px' : '6px',
                height: '2px',
                backgroundColor: idx === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
};
