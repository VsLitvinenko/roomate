export enum LocalisationEnum {
  unknownError = 'unknownError',
  noMessages = 'noMessages'
}

interface LocalisationLanguages {
  en: string;
  // ru: string;
}

export const localisationValues = new Map<keyof typeof LocalisationEnum, LocalisationLanguages>([
  [
    LocalisationEnum.unknownError,
    { en: 'UNKNOWN ERROR' }
  ],
  [
    LocalisationEnum.noMessages,
    { en: 'No messages' }
  ],
]);
