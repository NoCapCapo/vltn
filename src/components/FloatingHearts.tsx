import { Heart } from 'lucide-react';

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <Heart
          key={i}
          size={16 + Math.random() * 24}
          className="absolute text-pink-500/30 fill-current animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingHearts;
