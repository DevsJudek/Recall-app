const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\components\\ui\\glowing-effect.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove TypeScript interfaces
content = content.replace(/interface GlowingEffectProps {[\s\S]*?}/, '');

// Fix imports
content = content.replace('import { cn } from "@/lib/utils";', 'import { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nfunction cn(...inputs) {\n  return twMerge(clsx(inputs));\n}');
content = content.replace('import { animate } from "motion/react";', 'import { animate } from "framer-motion";');

// Fix types in parameters
// from: const GlowingEffect = memo(({ blur = 0, inactiveZone = 0.7, ... }: GlowingEffectProps) => {
// to: const GlowingEffect = memo(({ blur = 0, inactiveZone = 0.7, ... }) => {
content = content.replace(/}: GlowingEffectProps\) => {/g, '}) => {');

fs.writeFileSync(file, content);
console.log('GlowingEffect fixed for JS!');
