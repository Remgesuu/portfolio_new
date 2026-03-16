/**
 * Frame extraction script for scroll-driven book animation
 * 
 * Extracts a dense frame sequence suitable for scroll scrubbing.
 * Prefers visual smoothness over minimal frame count.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CONFIG = {
  inputVideo: './scripts/source-video/master_book.mp4',
  outputDir: './public/scroll-sequences/dossier',
  desktop: {
    dir: 'frames',
    width: 1120,
    height: 840,
    // Extract at high density for smooth scrubbing
    // We'll let ffmpeg extract at source fps, then sample if needed
    fps: 30,
  },
  mobile: {
    dir: 'frames-mobile', 
    width: 560,
    height: 420,
    // Mobile: still smooth but reduced for memory
    fps: 15,
  }
};

async function main() {
  console.log('Starting frame extraction...\n');

  // Get video info
  const probeCmd = `ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets,r_frame_rate,duration -of csv=p=0 "${CONFIG.inputVideo}"`;
  
  let videoInfo;
  try {
    const probeOutput = execSync(probeCmd, { encoding: 'utf-8' }).trim();
    const [frameRate, duration] = probeOutput.split(',');
    const [num, den] = frameRate.split('/');
    const fps = parseInt(num) / parseInt(den);
    videoInfo = { fps, duration: parseFloat(duration) };
    console.log(`Video info: ${fps.toFixed(2)} fps, ${duration}s duration`);
  } catch (e) {
    console.log('Could not probe video, using defaults');
    videoInfo = { fps: 30, duration: 5 };
  }

  // Create output directories
  const desktopDir = path.join(CONFIG.outputDir, CONFIG.desktop.dir);
  const mobileDir = path.join(CONFIG.outputDir, CONFIG.mobile.dir);
  
  fs.mkdirSync(desktopDir, { recursive: true });
  fs.mkdirSync(mobileDir, { recursive: true });

  // Extract desktop frames (dense, smooth)
  console.log(`\nExtracting desktop frames at ${CONFIG.desktop.fps}fps...`);
  const desktopCmd = `ffmpeg -i "${CONFIG.inputVideo}" -vf "fps=${CONFIG.desktop.fps},scale=${CONFIG.desktop.width}:${CONFIG.desktop.height}:flags=lanczos" -q:v 85 "${desktopDir}/frame-%04d.webp" -y`;
  
  try {
    execSync(desktopCmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Error extracting desktop frames:', e.message);
    // Fallback to jpg if webp not supported
    const fallbackCmd = `ffmpeg -i "${CONFIG.inputVideo}" -vf "fps=${CONFIG.desktop.fps},scale=${CONFIG.desktop.width}:${CONFIG.desktop.height}:flags=lanczos" -q:v 2 "${desktopDir}/frame-%04d.jpg" -y`;
    execSync(fallbackCmd, { stdio: 'inherit' });
  }

  // Extract mobile frames (reduced but coherent)
  console.log(`\nExtracting mobile frames at ${CONFIG.mobile.fps}fps...`);
  const mobileCmd = `ffmpeg -i "${CONFIG.inputVideo}" -vf "fps=${CONFIG.mobile.fps},scale=${CONFIG.mobile.width}:${CONFIG.mobile.height}:flags=lanczos" -q:v 80 "${mobileDir}/frame-%04d.webp" -y`;
  
  try {
    execSync(mobileCmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Error extracting mobile frames:', e.message);
    const fallbackCmd = `ffmpeg -i "${CONFIG.inputVideo}" -vf "fps=${CONFIG.mobile.fps},scale=${CONFIG.mobile.width}:${CONFIG.mobile.height}:flags=lanczos" -q:v 2 "${mobileDir}/frame-%04d.jpg" -y`;
    execSync(fallbackCmd, { stdio: 'inherit' });
  }

  // Count extracted frames
  const desktopFrames = fs.readdirSync(desktopDir).filter(f => f.startsWith('frame-')).length;
  const mobileFrames = fs.readdirSync(mobileDir).filter(f => f.startsWith('frame-')).length;

  // Detect format
  const desktopFormat = fs.existsSync(path.join(desktopDir, 'frame-0001.webp')) ? 'webp' : 'jpg';
  const mobileFormat = fs.existsSync(path.join(mobileDir, 'frame-0001.webp')) ? 'webp' : 'jpg';

  console.log(`\nExtracted ${desktopFrames} desktop frames, ${mobileFrames} mobile frames`);

  // Create manifest
  const manifest = {
    desktop: {
      frameCount: desktopFrames,
      frameDir: '/scroll-sequences/dossier/frames/',
      format: desktopFormat,
      dimensions: { width: CONFIG.desktop.width, height: CONFIG.desktop.height },
      firstFrame: 1,
      padLength: 4,
    },
    mobile: {
      frameCount: mobileFrames,
      frameDir: '/scroll-sequences/dossier/frames-mobile/',
      format: mobileFormat,
      dimensions: { width: CONFIG.mobile.width, height: CONFIG.mobile.height },
      firstFrame: 1,
      padLength: 4,
    },
    // Key moments for narrative sync
    keyMoments: {
      intro: { start: 0, end: 0.05 },
      intake: { start: 0.05, end: 0.30 },
      diagnosis: { start: 0.30, end: 0.55 },
      action: { start: 0.55, end: 0.80 },
      resolved: { start: 0.80, end: 1.0 },
    }
  };

  fs.writeFileSync(
    path.join(CONFIG.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\nManifest created at:', path.join(CONFIG.outputDir, 'manifest.json'));
  console.log('\nFrame extraction complete!');
}

main().catch(console.error);
