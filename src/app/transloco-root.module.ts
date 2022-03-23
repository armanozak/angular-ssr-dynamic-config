import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { of, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(
    private http: HttpClient,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getTranslation(lang: string) {
    const key = makeStateKey<Translation>(`transloco-${lang}`);

    if (this.state.hasKey(key)) return of(this.state.get(key, {}));

    return this.http
      .get<Translation>(`${environment.baseUrl}/assets/i18n/${lang}.json`)
      .pipe(
        tap((json) => {
          if (isPlatformServer(this.platformId)) {
            this.state.set(key, json);
          }
        })
      );
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en'],
        defaultLang: 'en',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
