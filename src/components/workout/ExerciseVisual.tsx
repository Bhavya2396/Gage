import React from 'react';
import { motion } from 'framer-motion';

interface ExerciseVisualProps {
  exerciseName: string;
  className?: string;
}

const ExerciseVisual: React.FC<ExerciseVisualProps> = ({ exerciseName, className = '' }) => {
  // Map of exercise names to their visual representations
  const exerciseVisuals: Record<string, React.ReactNode> = {
    'Barbell Squats': <BarbellSquatVisual />,
    'Medicine Ball Rotational Throws': <RotationalThrowVisual />,
    'Cable Woodchoppers': <WoodchopperVisual />,
    'Kettlebell Swings': <KettlebellSwingVisual />,
    'Plank with Rotation': <PlankRotationVisual />,
    // Default for any unmatched exercise
    'default': <DefaultExerciseVisual name={exerciseName} />
  };

  return (
    <div className={`bg-glass-background bg-opacity-30 rounded-lg overflow-hidden ${className}`}>
      {exerciseVisuals[exerciseName] || exerciseVisuals['default']}
    </div>
  );
};

// Barbell Squat Visual Component
const BarbellSquatVisual: React.FC = () => {
  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 200 200">
          {/* Barbell */}
          <motion.line 
            x1="40" y1="60" x2="160" y2="60"
            stroke="#E8F0FF" 
            strokeWidth="6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Weight plates */}
          <motion.circle 
            cx="50" cy="60" r="15" 
            fill="#00CCFF" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.circle 
            cx="150" cy="60" r="15" 
            fill="#00CCFF"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          
          {/* Figure - top position */}
          <motion.g
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: [1, 0.5, 1], y: [0, 40, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Head */}
            <circle cx="100" cy="80" r="10" fill="#E8F0FF" />
            
            {/* Body */}
            <line x1="100" y1="90" x2="100" y2="120" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Arms */}
            <line x1="100" y1="95" x2="70" y2="60" stroke="#E8F0FF" strokeWidth="3" />
            <line x1="100" y1="95" x2="130" y2="60" stroke="#E8F0FF" strokeWidth="3" />
            
            {/* Legs */}
            <line x1="100" y1="120" x2="80" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="100" y1="120" x2="120" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Feet */}
            <line x1="80" y1="150" x2="70" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="120" y1="150" x2="130" y2="150" stroke="#E8F0FF" strokeWidth="4" />
          </motion.g>
          
          {/* Target muscle groups */}
          <motion.g
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              fill: ["#00CCFF", "#00B8B8", "#00CCFF"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Quads */}
            <ellipse cx="90" cy="135" rx="8" ry="15" />
            <ellipse cx="110" cy="135" rx="8" ry="15" />
            
            {/* Glutes */}
            <ellipse cx="100" cy="115" rx="12" ry="8" />
          </motion.g>
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-glass-background px-2 py-1 rounded-md">
        <span className="text-xs text-alpine-mist">Targets: Quads, Glutes, Core</span>
      </div>
    </div>
  );
};

// Medicine Ball Rotational Throw Visual
const RotationalThrowVisual: React.FC = () => {
  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 200 200">
          {/* Figure */}
          <motion.g
            initial={{ rotate: -20 }}
            animate={{ rotate: [20, -20] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformOrigin: '100px 120px' }}
          >
            {/* Head */}
            <circle cx="100" cy="80" r="10" fill="#E8F0FF" />
            
            {/* Body */}
            <line x1="100" y1="90" x2="100" y2="120" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Arms */}
            <line x1="100" y1="95" x2="130" y2="85" stroke="#E8F0FF" strokeWidth="3" />
            
            {/* Legs */}
            <line x1="100" y1="120" x2="80" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="100" y1="120" x2="120" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Feet */}
            <line x1="80" y1="150" x2="70" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="120" y1="150" x2="130" y2="150" stroke="#E8F0FF" strokeWidth="4" />
          </motion.g>
          
          {/* Medicine Ball */}
          <motion.circle 
            cx="130" cy="85" r="12" 
            fill="#00CCFF"
            initial={{ x: 0 }}
            animate={{ x: [0, 50, -50, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", times: [0, 0.3, 0.7, 1] }}
          />
          
          {/* Target muscle groups */}
          <motion.g
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              fill: ["#00CCFF", "#00B8B8", "#00CCFF"]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Core */}
            <ellipse cx="100" cy="105" rx="15" ry="10" />
          </motion.g>
          
          {/* Rotation path */}
          <motion.path
            d="M 130,85 Q 160,70 180,100"
            fill="none"
            stroke="#00CCFF"
            strokeWidth="2"
            strokeDasharray="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", times: [0, 0.3, 1] }}
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-glass-background px-2 py-1 rounded-md">
        <span className="text-xs text-alpine-mist">Targets: Core, Rotational</span>
      </div>
    </div>
  );
};

// Cable Woodchopper Visual
const WoodchopperVisual: React.FC = () => {
  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 200 200">
          {/* Cable machine */}
          <rect x="40" y="40" width="20" height="120" fill="#1A2530" />
          
          {/* Cable */}
          <motion.path
            d="M 50,60 Q 80,80 110,90"
            fill="none"
            stroke="#E8F0FF"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Figure */}
          <motion.g
            initial={{ rotate: -30 }}
            animate={{ rotate: [30, -30] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformOrigin: '100px 120px' }}
          >
            {/* Head */}
            <circle cx="100" cy="80" r="10" fill="#E8F0FF" />
            
            {/* Body */}
            <line x1="100" y1="90" x2="100" y2="120" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Arms */}
            <line x1="100" y1="95" x2="110" y2="90" stroke="#E8F0FF" strokeWidth="3" />
            
            {/* Legs */}
            <line x1="100" y1="120" x2="80" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="100" y1="120" x2="120" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Feet */}
            <line x1="80" y1="150" x2="70" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            <line x1="120" y1="150" x2="130" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Handle */}
            <rect x="110" y="85" width="15" height="10" fill="#00CCFF" rx="2" />
          </motion.g>
          
          {/* Target muscle groups */}
          <motion.g
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              fill: ["#00CCFF", "#00B8B8", "#00CCFF"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Core */}
            <ellipse cx="100" cy="105" rx="15" ry="10" />
          </motion.g>
          
          {/* Movement arc */}
          <motion.path
            d="M 110,90 A 40,40 0 0 1 150,120"
            fill="none"
            stroke="#00CCFF"
            strokeWidth="2"
            strokeDasharray="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-glass-background px-2 py-1 rounded-md">
        <span className="text-xs text-alpine-mist">Targets: Core, Obliques</span>
      </div>
    </div>
  );
};

// Kettlebell Swing Visual
const KettlebellSwingVisual: React.FC = () => {
  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 200 200">
          {/* Figure */}
          <motion.g
            animate={{ 
              rotate: [0, 30, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformOrigin: '100px 120px' }}
          >
            {/* Head */}
            <circle cx="100" cy="80" r="10" fill="#E8F0FF" />
            
            {/* Body */}
            <line x1="100" y1="90" x2="100" y2="120" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Arms */}
            <line x1="100" y1="95" x2="80" y2="120" stroke="#E8F0FF" strokeWidth="3" />
            <line x1="100" y1="95" x2="120" y2="120" stroke="#E8F0FF" strokeWidth="3" />
            
            {/* Legs */}
            <motion.g
              animate={{ rotate: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              style={{ transformOrigin: '100px 120px' }}
            >
              <line x1="100" y1="120" x2="80" y2="150" stroke="#E8F0FF" strokeWidth="4" />
              <line x1="100" y1="120" x2="120" y2="150" stroke="#E8F0FF" strokeWidth="4" />
              
              {/* Feet */}
              <line x1="80" y1="150" x2="70" y2="150" stroke="#E8F0FF" strokeWidth="4" />
              <line x1="120" y1="150" x2="130" y2="150" stroke="#E8F0FF" strokeWidth="4" />
            </motion.g>
          </motion.g>
          
          {/* Kettlebell */}
          <motion.g
            animate={{ 
              y: [0, -80, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '100px 120px' }}
          >
            <circle cx="100" cy="140" r="15" fill="#00CCFF" />
            <rect x="95" y="125" width="10" height="15" fill="#00CCFF" />
          </motion.g>
          
          {/* Target muscle groups */}
          <motion.g
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              fill: ["#00CCFF", "#00B8B8", "#00CCFF"]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Glutes */}
            <ellipse cx="100" cy="115" rx="12" ry="8" />
            
            {/* Hamstrings */}
            <ellipse cx="90" cy="135" rx="5" ry="12" />
            <ellipse cx="110" cy="135" rx="5" ry="12" />
          </motion.g>
          
          {/* Swing arc */}
          <motion.path
            d="M 100,140 A 60,60 0 0 1 100,60"
            fill="none"
            stroke="#00CCFF"
            strokeWidth="2"
            strokeDasharray="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-glass-background px-2 py-1 rounded-md">
        <span className="text-xs text-alpine-mist">Targets: Posterior Chain, Core</span>
      </div>
    </div>
  );
};

// Plank with Rotation Visual
const PlankRotationVisual: React.FC = () => {
  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 200 200">
          {/* Figure in plank position */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 30, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformOrigin: '100px 130px' }}
          >
            {/* Head */}
            <circle cx="160" cy="110" r="10" fill="#E8F0FF" />
            
            {/* Body */}
            <line x1="160" y1="120" x2="100" y2="130" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Support arm */}
            <line x1="100" y1="130" x2="100" y2="150" stroke="#E8F0FF" strokeWidth="3" />
            
            {/* Rotating arm */}
            <motion.line 
              x1="100" y1="130" x2="100" y2="100"
              stroke="#E8F0FF" 
              strokeWidth="3"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{ transformOrigin: '100px 130px' }}
            />
            
            {/* Legs */}
            <line x1="40" y1="150" x2="100" y2="130" stroke="#E8F0FF" strokeWidth="4" />
            
            {/* Feet */}
            <line x1="40" y1="150" x2="30" y2="150" stroke="#E8F0FF" strokeWidth="4" />
          </motion.g>
          
          {/* Target muscle groups */}
          <motion.g
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              fill: ["#00CCFF", "#00B8B8", "#00CCFF"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Core */}
            <ellipse cx="130" cy="125" rx="20" ry="8" />
            
            {/* Shoulders */}
            <circle cx="100" cy="130" r="8" />
          </motion.g>
          
          {/* Rotation arc */}
          <motion.path
            d="M 100,100 A 30,30 0 0 1 130,80"
            fill="none"
            stroke="#00CCFF"
            strokeWidth="2"
            strokeDasharray="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-glass-background px-2 py-1 rounded-md">
        <span className="text-xs text-alpine-mist">Targets: Core, Shoulders</span>
      </div>
    </div>
  );
};

// Default Exercise Visual
const DefaultExerciseVisual: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="h-48 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mx-auto mb-3"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 17.5L17.5 6.5M6.5 6.5L17.5 17.5" stroke="#00CCFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="#00CCFF" strokeWidth="2"/>
          </svg>
        </motion.div>
        <p className="text-sm text-alpine-mist">{name}</p>
        <p className="text-xs text-alpine-mist/60 mt-1">Visual guide coming soon</p>
      </div>
    </div>
  );
};

export default ExerciseVisual;
