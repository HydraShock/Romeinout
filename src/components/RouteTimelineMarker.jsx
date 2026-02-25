import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

export default function RouteTimelineMarker({ isFirst = false, isLast = false, isStart = false }) {
  return (
    <div className="itinerary-marker-col">
      <span
        aria-hidden="true"
        className={`itinerary-marker-line ${isFirst ? 'is-first' : ''} ${isLast ? 'is-last' : ''}`}
      />

      <motion.span
        aria-hidden="true"
        className={`itinerary-marker ${isStart ? 'is-start' : 'is-default'}`}
        animate={isStart ? { scale: [1, 1.08, 1] } : undefined}
        transition={
          isStart
            ? {
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        <MapPin className="itinerary-marker-icon" strokeWidth={2.4} />
      </motion.span>
    </div>
  );
}
