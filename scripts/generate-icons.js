const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6"/>
  <circle cx="${size/2}" cy="${size/3}" r="${size/8}" fill="white"/>
  <path d="M${size/4} ${size*2/3} Q${size/2} ${size*0.8} ${size*3/4} ${size*2/3}" stroke="white" stroke-width="${size/20}" fill="none"/>
  <text x="${size/2}" y="${size*0.9}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size/6}" font-weight="bold">HS</text>
</svg>`;

// Convert SVG to PNG (simplified - in real world you'd use a library like sharp)
const createPNGPlaceholder = (size) => {
  // This is a simplified placeholder - in production you'd use a proper image processing library
  const svg = createSVGIcon(size);
  return svg;
};

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create placeholder icons
const sizes = [192, 512];

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const svgPath = path.join(publicDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Created ${svgPath}`);
});

console.log('Icon generation complete!');
console.log('Note: For production, replace these SVG placeholders with proper PNG icons.');
