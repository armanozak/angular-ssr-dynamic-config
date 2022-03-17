import {
  HashMap,
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

export function createTranslocoTestingModule(
  overrideOptions = addTranslations({})
) {
  const testingOptions = overrideOptions({
    langs: {
      en: {},
    },
    preloadLangs: true,
    translocoConfig: {
      availableLangs: ['en'],
      defaultLang: 'en',
    },
  });

  return [
    TranslocoTestingModule.forRoot(testingOptions),
    TranslocoLocaleModule.forRoot({
      langToLocaleMapping: {
        en: 'en-US',
      },
    }),
  ];
}

export function addTranslations(
  translations: HashMap<Translation>,
  lang = 'en'
): (options: TranslocoTestingOptions) => TranslocoTestingOptions {
  return (options) => {
    options.langs![lang] = translations;

    return options;
  };
}

type Translation = string | { [key: string]: Translation };
