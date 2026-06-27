/**
 * MF Prime Acabamentos - Entry Point (Módulos ES6)
 */

import { initScrollAnimations, initHeaderScroll } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initCalculator } from './modules/calculator.js';
import { initCatalogTabs } from './modules/catalog.js';

// Import the main CSS so Vite bundles it automatically
import '../css/main.css';

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initLightbox();
  initGallery();
  initCalculator();
  initCatalogTabs();
});
