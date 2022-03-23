import { isPlatformServer } from '@angular/common';
import {
  APP_INITIALIZER,
  InjectionToken,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';

export const createConfigProvider = (
  getConfig: () => Config | Promise<Config>
) => [
  {
    provide: APP_INITIALIZER,
    useFactory:
      (platformId: Object, state: TransferState, config: Config) => () => {
        if (isPlatformServer(platformId)) {
          return state.set(CONFIG_STATE_KEY, config);
        }

        if (state.hasKey(CONFIG_STATE_KEY)) return;

        const configOrPromise = getConfig();

        if (configOrPromise instanceof Promise) {
          return configOrPromise.then((jsonConfig) => {
            state.set(CONFIG_STATE_KEY, jsonConfig);
          });
        }

        return state.set(CONFIG_STATE_KEY, configOrPromise);
      },
    deps: [PLATFORM_ID, TransferState, [REMOTE_CONFIG, new Optional()]],
    multi: true,
  },
  {
    provide: CONFIG,
    useFactory: (state: TransferState) => state.get(CONFIG_STATE_KEY, null),
    deps: [TransferState],
  },
];

export const CONFIG_STATE_KEY = makeStateKey<Config>('config-state');

export const REMOTE_CONFIG = new InjectionToken<Config>('remote config');

export const CONFIG = new InjectionToken<Config>('config');

export interface Config {
  company: Company;
}

interface Company {
  name: string;
  catchPhrase: string;
}
