import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { CONFIG } from './app/config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  fetch('./assets/config.json')
    .then((response) => response.json())
    .then((config) =>
      platformBrowserDynamic([
        {
          provide: CONFIG,
          useValue: config,
        },
      ]).bootstrapModule(AppModule)
    )
    .catch((err) => console.error(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
