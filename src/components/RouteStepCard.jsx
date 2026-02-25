import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function RouteStepCard({ step, index }) {
  const isMustSee = Boolean(step.isMustSee);
  const isStart = Boolean(step.isStart);

  return (
    <motion.article
      initial={{ opacity: 0, x: 14, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.33,
        delay: 0.06 + index * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`itinerary-step-card ${isMustSee ? 'is-must-see' : ''}`}
    >
      <div className="itinerary-step-top">
        <div className="itinerary-step-meta">
          <span className="itinerary-step-label">
            Tappa {step.index || index + 1}
          </span>
          {isMustSee ? (
            <span className="itinerary-must-pill">
              <Star className="itinerary-must-pill-icon" strokeWidth={2.4} />
              Must-see
            </span>
          ) : null}
        </div>

        {isStart ? (
          <span className="itinerary-start-pill">
            Partenza
          </span>
        ) : null}
      </div>

      <h4 className="itinerary-step-title">{step.name}</h4>
    </motion.article>
  );
}
