import { Injectable } from '@angular/core';
import { LocalisationEnum, localisationValues } from './localisation.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  constructor() {
  }

  public localize(value: keyof typeof LocalisationEnum): string {
    const res = localisationValues.get(value);
    return res ? res.en : 'localization error';
  }
}
