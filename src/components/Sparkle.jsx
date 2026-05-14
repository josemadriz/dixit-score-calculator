import { useState } from 'react';

const Sparkle = ({ style, size = "small" }) => {
  const sparkleClass = size === "large" ? "sparkle-float" : "sparkle";

  return (
    <div
      className={sparkleClass}
      style={style}
    />
  );
};

function buildSparkles(count) {
  return Array.from({ length: count }, (_, i) => ({
    key: i,
    size: i % 3 === 0 ? "large" : "small",
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${1.5 + Math.random()}s`,
    },
  }));
}

const SparkleContainer = ({ children, sparkleCount = 8 }) => {
  const [sparkles] = useState(() => buildSparkles(sparkleCount));

  return (
    <div className="sparkle-container">
      {sparkles.map(({ key, size, style }) => (
        <Sparkle key={key} size={size} style={style} />
      ))}
      {children}
    </div>
  );
};

export { Sparkle, SparkleContainer };
