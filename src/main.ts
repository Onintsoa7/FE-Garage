import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { fr_FR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    importProvidersFrom(
      HttpClientModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
      }),
      FormsModule
    ),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideNzI18n(fr_FR),
    importProvidersFrom(FormsModule),
    provideHttpClient()
  ]
});
