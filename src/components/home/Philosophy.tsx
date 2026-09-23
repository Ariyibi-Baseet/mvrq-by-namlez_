import React from 'react';

export const Philosophy: React.FC = () => {
  return (
    <section className="border-t border-navy-800/80 light:border-slate-300 py-20 md:py-28 overflow-hidden bg-navy-950/40 light:bg-slate-50 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Editorial Headline */}
          <div className="md:col-span-7">
            <p className="magazine-label text-slate-400 light:text-slate-500 mb-6">
              The MVRQ Philosophy
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight text-slate-100 light:text-navy-950">
              Worn by those<br />
              <span className="text-amber-400 light:text-amber-600 font-normal">who move</span> through<br />
              the world quietly.
            </h2>
          </div>

          {/* Right Column: Narrative & Metrics Grid */}
          <div className="md:col-span-5 space-y-6">
            <p className="text-slate-300 light:text-slate-700 leading-relaxed text-sm md:text-base font-light">
              MVRQ by naMLez was built for people who understand that real presence doesn't require noise. Every piece is considered. Every cut is intentional. Designed in Lagos, worn everywhere.
            </p>

            {/* 3 Metrics Columns */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-800 light:border-slate-300">
              <div>
                <p className="font-serif text-2xl md:text-3xl font-semibold text-electric-400 light:text-electric-600">
                  100%
                </p>
                <p className="magazine-label text-slate-400 light:text-slate-500 mt-1" style={{ fontSize: '9px' }}>
                  Premium Cotton
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl md:text-3xl font-semibold text-electric-400 light:text-electric-600">
                  NGN
                </p>
                <p className="magazine-label text-slate-400 light:text-slate-500 mt-1" style={{ fontSize: '9px' }}>
                  Local Currency
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl md:text-3xl font-semibold text-electric-400 light:text-electric-600">
                  LGS
                </p>
                <p className="magazine-label text-slate-400 light:text-slate-500 mt-1" style={{ fontSize: '9px' }}>
                  Designed in Lagos
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
