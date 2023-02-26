import { Injectable } from '@angular/core';
import { Localisation, LocalisationLanguages, localisationValues } from './localisation.enum';
import { isArray, isFunction } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  constructor() {
  }

  public localize(value: Localisation | (Localisation | string)[], ...args: any[]): string {
    if (isArray(value)) {
      if (args.length !== 0) {
        console.warn('roomate warning: Localisation arguments are not available with arrays');
      }
      return value.map((item, index) => {
        const res = this.getString(localisationValues.get(item as Localisation));
        return index === 0 ? res : res.toLowerCase();
      }).join(' ');
    }
    else {
      return this.getString(localisationValues.get(value), ...args);
    }
  }

  private getString(value: LocalisationLanguages, ...args: any[]): string {
    const key = 'ru';
    if (!value) {
      return 'localization error';
    }
    else if (isFunction(value[key])) {
      return value[key](...args);
    }
    else {
      return value[key] as string;
    }
  }
}
