
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  /*

  import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

  import { provideClientHydration } from '@angular/platform-browser';
  import { provideHttpClient } from '@angular/common/http';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideClientHydration(),
      provideHttpClient()
    ]
  };
  */
// app.config.ts
