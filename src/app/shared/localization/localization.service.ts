import { Injectable } from '@angular/core';
import { Localisation, LocalisationLanguages, localisationValues } from './localisation.enum';
import { isArray } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  constructor() {
  }

  // todo склонения после числительных
  public localize(value: Localisation | (Localisation | string)[]): string {
    if (isArray(value)) {
      return value.map((item, index) => {
        const res = this.getString(localisationValues.get(item as Localisation));
        return index === 0 ? res : res.toLowerCase();
      }).join(' ');
    }
    else {
      return this.getString(localisationValues.get(value));
    }
  }

  private getString(value: LocalisationLanguages): string {
    return value ? value.ru : 'localization error';
  }
}
