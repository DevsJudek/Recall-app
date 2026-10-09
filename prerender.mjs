import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
    console.log('Starting prerendering process for Grant AI bots...');
    
    // Serve the built static files
    const app = express();
    app.use(express.static(path.join(__dirname, 'dist')));
    
    const server = app.listen(3000, async () => {
        try {
            console.log('Local server started. Launching headless browser...');
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            
            console.log('Loading landing page...');
            await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
            
            // Wait an extra second to ensure any API calls (like stats) finish
            await new Promise(r => setTimeout(r, 1500));
            
            const html = await page.content();
            
            // Save the hydrated HTML back to dist
            fs.writeFileSync(path.join(__dirname, 'dist/index.html'), html);
            console.log('✅ Successfully prerendered index.html!');
            
            await browser.close();
            server.close();
        } catch (error) {
            console.error('❌ Prerendering failed:', error);
            server.close();
            process.exit(1);
        }
    });
}

prerender();
