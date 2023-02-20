interface LocalisationLanguages {
  en: string;
  ru: string;
}

export enum LocalisationEnum {
  unknownError = 'unknownError',
  noMessages = 'noMessages',
  channels = 'channels',
  directs = 'directs',
  room = 'room',
  settings = 'settings',
  noUsers = 'noUsers',
  close = 'close',
  create = 'create',
  publicChannel = 'publicChannel',
  channelsName = 'channelsName',
  createNewChannel = 'createNewChannel',
}

export const localisationValues = new Map<keyof typeof LocalisationEnum, LocalisationLanguages>([
  [
    LocalisationEnum.unknownError,
    { en: 'UNKNOWN ERROR', ru: 'НЕИЗВЕСТНАЯ ОШИБКА' }
  ],
  [
    LocalisationEnum.noMessages,
    { en: 'No messages', ru: 'Нет сообщений' }
  ],
  [
    LocalisationEnum.channels,
    { en: 'Channels', ru: 'Каналы' }
  ],
  [
    LocalisationEnum.directs,
    { en: 'Directs', ru: 'Сообщения' }
  ],
  [
    LocalisationEnum.room,
    { en: 'Room', ru: 'Комната' }
  ],
  [
    LocalisationEnum.settings,
    { en: 'Settings', ru: 'Настройки' }
  ],
  [
    LocalisationEnum.noUsers,
    { en: 'No users', ru: 'Нет пользователей' }
  ],
  [
    LocalisationEnum.close,
    { en: 'Close', ru: 'Закрыть' }
  ],
  [
    LocalisationEnum.create,
    { en: 'Create', ru: 'Создать' }
  ],
  [
    LocalisationEnum.publicChannel,
    { en: 'Public channel', ru: 'Публичный канал' }
  ],
  [
    LocalisationEnum.channelsName,
    { en: 'Channel\'s name', ru: 'Название канала' }
  ],
  [
    LocalisationEnum.createNewChannel,
    { en: 'Create new channel', ru: 'Создать новый канал' }
  ],
]);
