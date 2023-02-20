export enum LocalisationEnum {
  unknownError = 'unknownError',
  noMessages = 'noMessages',
  channels = 'channels',
  directs = 'directs',
  room = 'room',
  settings = 'settings',
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
  [
    LocalisationEnum.channels,
    { en: 'Channels' }
  ],
  [
    LocalisationEnum.directs,
    { en: 'Directs' }
  ],
  [
    LocalisationEnum.room,
    { en: 'Room' }
  ],
  [
    LocalisationEnum.settings,
    { en: 'Settings' }
  ],
]);
