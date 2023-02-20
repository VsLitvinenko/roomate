import { Pipe, PipeTransform } from '@angular/core';
import { Localisation } from './localisation.enum';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'localization'
})
export class LocalizationPipe implements PipeTransform {
  constructor(private readonly localizeService: LocalizationService) {
  }

  public transform(value: Localisation | (Localisation | string)[]): string {
    return this.localizeService.localize(value);
  }
}
