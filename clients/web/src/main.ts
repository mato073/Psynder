import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import * as Sentry from "@sentry/angular";
// import { Integrations } from "@sentry/tracing";
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


/* Sentry initialization */
/* 
Sentry.init({
  dsn: "https://245e42417d9c418294b1c4d968f99849@o460714.ingest.sentry.io/5461415",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
}); */



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
