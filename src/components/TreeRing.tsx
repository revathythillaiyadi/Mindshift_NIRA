import React from 'react';

// Define the properties for the TreeRing component
interface TreeRingProps {
  // Increased default ring count from 5 to 8 (5 + 3)
  ringCount?: number; 
  className?: string;
  style?: React.CSSProperties;
}

export default function TreeRing({ ringCount = 8, className = '', style }: TreeRingProps) {
  // Function to generate a slightly irregular (organic) path for the ring
  const generateOrganicPath = (baseRadius: number, centerX: number, centerY: number) => {
    const points = 60;
    // Base irregularity is set proportionally to the radius
    const irregularity = baseRadius * 0.08; 
    let path = '';

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      
      // Introduce random offsets based on sine and cosine waves for an organic look
      const randomOffset = (Math.sin(angle * 3) * irregularity * 0.5) +
                         (Math.cos(angle * 5) * irregularity * 0.3) +
                         (Math.sin(angle * 7) * irregularity * 0.2);
                         
      const radius = baseRadius + randomOffset;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path + ' Z'; // Close the path
  };

  const rings = [];
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 140;
  const minRadius = 15;

  // Loop to generate the specified number of rings
  for (let i = 0; i < ringCount; i++) {
    // Calculate the normalized progress (0 to 1) for ring distribution
    // This ensures rings are evenly distributed from minRadius to maxRadius
    const progress = i / (ringCount - 1);
    const radius = maxRadius - (maxRadius - minRadius) * progress;
    
    // Determine the stroke class for visual variation (thin, thick, bold)
    const strokeClass = i % 3 === 0 ? 'tree-ring-path-bold' :
                       i % 2 === 0 ? 'tree-ring-path-thick' :
                       'tree-ring-path-thin';

    rings.push(
      <path
        key={i}
        d={generateOrganicPath(radius, centerX, centerY)}
        className={`tree-ring-path ${strokeClass}`}
        // The animation or styling classes (like 'tree-ring-path') are assumed to be defined in CSS/Tailwind
      />
    );
  }

  return (
    <div className={`tree-ring-complex ${className}`} style={style}>
      {/* SVG container with a fixed viewBox */}
      <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
        {rings}
      </svg>
    </div>
  );
}