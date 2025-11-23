import * as THREE from 'three';

export const COLORS = {
    bg: 0xf0f0e6,
    primary: 0xff4719,   // Orange
    secondary: 0x00a8ff, // Blue
    highlight: 0xe6b31e, // Mustard
    dark: 0x1a1a1a       // Ink
};

export const VERTEX_SHADER = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    uniform float uTime;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        vPosition = position;

        // Subtle wobble animation based on time
        vec3 pos = position;
        pos.x += sin(pos.y * 4.0 + uTime) * 0.05;
        pos.z += cos(pos.y * 4.0 + uTime) * 0.05;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

export const FRAGMENT_SHADER = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform vec3 uColorDark;
    uniform vec3 uLightDir;
    uniform vec2 uResolution;
    uniform float uScale;

    void main() {
        // Basic lighting
        float intensity = dot(vNormal, uLightDir);
        intensity = intensity * 0.5 + 0.5; // Map to 0-1

        // Halftone calculation
        vec2 uv = gl_FragCoord.xy / uResolution.y;
        uv *= uScale;
        
        vec2 nearest = 2.0 * fract(uv) - 1.0;
        float dist = length(nearest);
        // Darker areas get bigger dots (inverse relationship)
        
        vec3 finalColor;
        
        // Hard thresholds for comic book look
        if (intensity > 0.8) {
            float dotSize = 0.6;
            if (dist > dotSize) {
                finalColor = uColorPrimary; // Lightest area (Orange)
            } else {
                finalColor = uColorSecondary; // Dots (Blue)
            }
        } else if (intensity > 0.4) {
            float dotSize = 0.8;
            if (dist > dotSize) {
                finalColor = uColorSecondary; // Midtone (Blue)
            } else {
                finalColor = uColorDark; // Shadow dots (Black)
            }
        } else {
            finalColor = uColorDark; // Deep shadow
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

export const PRODUCT_GENERATOR_PROMPT = `
You are a satirical product designer for 'keyfabe', a surreal streetwear lab posing as a fake corporation.
Invent a new, useless, or slightly unsettling "product" that solves a problem nobody has and reads like a mid-century ad.
It should feel like a broadcast break from 1974 with modern paranoia. Always keep the brand lowercase.

Return strictly JSON.
Schema:
{
  "name": "string (max 4 words)",
  "description": "string (max 20 words, punchy, cynical)",
  "price": "string (e.g. '$19.99' or 'Your Firstborn')",
  "warning": "string (short safety warning)",
  "icon": "string (a single emoji that best fits)"
}
`;
