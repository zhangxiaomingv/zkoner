import { initVortex } from './vortex.js';
import { initI18n } from './i18n.js';
import { initRipple } from './ripple.js';

document.addEventListener('DOMContentLoaded', function () {
  initVortex();
  initI18n();
  initRipple();
});
