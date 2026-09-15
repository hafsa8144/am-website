export default function BrandStrip({ brands }) {
  // duplicate the list once so the scroll-left animation loops seamlessly
  const looped = [...brands, ...brands];

  return (
    <section className="py-6 border-t border-line mt-2">
      <h2 className="font-extrabold text-xl sm:text-2xl text-ink flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-pink-deep inline-block" />
        Brands we stock
      </h2>
      {/* text chips for now — swap for real brand logo images here later */}
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="flex gap-6 w-max animate-[scroll-left_50s_linear_infinite]">
        {looped.map((brand, i) => (
  <div
    key={`${brand.name}-${i}`}
    className="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl border border-line bg-card px-3"
  >
    <img
      src={brand.src}
      alt={brand.name}
      className="max-h-9 max-w-full object-contain"
    />
  </div>
))}
      </div>
      </div>
    </section>
  );
}
