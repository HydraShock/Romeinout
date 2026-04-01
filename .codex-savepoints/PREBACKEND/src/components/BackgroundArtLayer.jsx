const ART_DETAILS = [
  { id: 'foro', src: '/bg/details/rome-detail-foro.png', className: 'bg-art-detail-1' },
  { id: 'colosseo', src: '/bg/details/rome-detail-colosseo.png', className: 'bg-art-detail-2' },
  { id: 'pantheon', src: '/bg/details/rome-detail-pantheon.png', className: 'bg-art-detail-3' },
  { id: 'castel', src: '/bg/details/rome-detail-castel.png', className: 'bg-art-detail-4' },
  { id: 'piazza', src: '/bg/details/rome-detail-piazza.png', className: 'bg-art-detail-5' },
  { id: 'vatican-river', src: '/bg/details/rome-detail-vatican-river.png', className: 'bg-art-detail-6' },
];

export default function BackgroundArtLayer() {
  return (
    <div className="bg-art-layer" aria-hidden="true">
      {ART_DETAILS.map((detail) => (
        <img
          key={detail.id}
          src={detail.src}
          alt=""
          className={`bg-art-detail ${detail.className}`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}
