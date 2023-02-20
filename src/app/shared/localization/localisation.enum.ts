export interface LocalisationLanguages {
  en: string;
  ru: string;
}

export enum LocalisationEnum {
  unknownError = 'unknownError',
  noMessages = 'noMessages',
  channels = 'channels',
  channel = 'channel',
  directs = 'directs',
  room = 'room',
  settings = 'settings',
  noUsers = 'noUsers',
  close = 'close',
  create = 'create',
  public = 'public',
  publics = 'publics',
  private = 'private',
  privates = 'privates',
  channelsName = 'channelsName',
  createNewChannel = 'createNewChannel',
  channelInfo = 'channelInfo',
  notifications = 'notifications',
  leave = 'leave',
  allChannelsMembers = 'allChannelsMembers',
  nUsers = 'nUsers',
  nMembers = 'nMembers',
  online = 'online',
  enterMessage = 'enterMessage',
  toSearch = 'toSearch',
}

export type Localisation = (keyof typeof LocalisationEnum);

export const localisationValues = new Map<Localisation, LocalisationLanguages>([
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
    LocalisationEnum.channel,
    { en: 'Channel', ru: 'Канал' }
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
    LocalisationEnum.public,
    { en: 'Public', ru: 'Публичный' }
  ],
  [
    LocalisationEnum.publics,
    { en: 'Public', ru: 'Публичные' }
  ],
  [
    LocalisationEnum.privates,
    { en: 'Private', ru: 'Приватные' }
  ],
  [
    LocalisationEnum.private,
    { en: 'Private', ru: 'Приватный' }
  ],
  [
    LocalisationEnum.channelsName,
    { en: 'Channel\'s name', ru: 'Название канала' }
  ],
  [
    LocalisationEnum.createNewChannel,
    { en: 'Create new channel', ru: 'Создать новый канал' }
  ],
  [
    LocalisationEnum.channelInfo,
    { en: 'Channel information', ru: 'Информация о канале' }
  ],
  [
    LocalisationEnum.notifications,
    { en: 'Notifications', ru: 'Уведомления' }
  ],
  [
    LocalisationEnum.leave,
    { en: 'Leave', ru: 'Покинуть' }
  ],
  [
    LocalisationEnum.allChannelsMembers,
    { en: 'All channel\'s members', ru: 'Все участники канала' }
  ],
  [
    LocalisationEnum.nMembers,
    { en: 'members', ru: 'участников' }
  ],
  [
    LocalisationEnum.nUsers,
    { en: 'users', ru: 'пользователей' }
  ],
  [
    LocalisationEnum.online,
    { en: 'Online', ru: 'Онлайн' }
  ],
  [
    LocalisationEnum.enterMessage,
    { en: 'Enter your message', ru: 'Напишите сообщение' }
  ],
  [
    LocalisationEnum.toSearch,
    { en: 'Search for', ru: 'Найти' }
  ],
]);
