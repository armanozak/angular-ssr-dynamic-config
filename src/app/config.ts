import { InjectionToken } from '@angular/core';

export const CONFIG = new InjectionToken<Config>('config');

export interface Config {
  company: Company;
}

interface Company {
  name: string;
  catchPhrase: string;
}
