/**
 * MF Prime Acabamentos - Entry Point (TypeScript)
 */

import { initScrollAnimations, initHeaderScroll } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initCalculator } from './modules/calculator.js';
import { initCatalogTabs } from './modules/catalog.js';
import { initCatalogFilter } from './modules/catalogFilter.js';

import '../css/main.css';

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initLightbox();
  initGallery();
  initCalculator();
  initCatalogTabs();
  initCatalogFilter();
});
