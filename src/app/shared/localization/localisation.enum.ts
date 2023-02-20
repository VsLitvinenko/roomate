import { ruCaseByNumeral } from './functions';

export interface LocalisationLanguages {
  en: string | ((...args: any[]) => string);
  ru: string | ((...args: any[]) => string);
}

export enum LocalisationEnum {
  unknownError = 'unknownError',
  channels = 'channels',
  channel = 'channel',
  directs = 'directs',
  room = 'room',
  settings = 'settings',
  no = 'no',
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
  online = 'online',
  enterMessage = 'enterMessage',
  toSearch = 'toSearch',
  nUsers = 'nUsers',
  nMembers = 'nMembers',
  nMessages = 'nMessages'
}

export type Localisation = (keyof typeof LocalisationEnum);

export const localisationValues = new Map<Localisation, LocalisationLanguages>([
  [
    LocalisationEnum.unknownError,
    { en: 'UNKNOWN ERROR', ru: 'НЕИЗВЕСТНАЯ ОШИБКА' }
  ],
  [
    LocalisationEnum.no,
    { en: 'No', ru: 'Нет' }
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
  [
    LocalisationEnum.nMembers,
    {
      en: (n: number) => n === 1 ? 'member' : 'members',
      ru: (n: number) => {
        switch (ruCaseByNumeral(n)) {
          case 'single':
            return 'участник';
          case 'middle':
            return 'участника';
          case 'default':
            return 'участников';
        }
      }
    }
  ],
  [
    LocalisationEnum.nUsers,
    {
      en: (n: number) => n === 1 ? 'user' : 'users',
      ru: (n: number) => {
        switch (ruCaseByNumeral(n)) {
          case 'single':
            return 'пользователь';
          case 'middle':
            return 'пользователя';
          case 'default':
            return 'пользователей';
        }
      }
    }
  ],
  [
    LocalisationEnum.nMessages,
    {
      en: (n: number) => n === 1 ? 'message' : 'messages',
      ru: (n: number) => {
        switch (ruCaseByNumeral(n)) {
          case 'single':
            return 'сообщение';
          case 'middle':
            return 'сообщения';
          case 'default':
            return 'сообщений';
        }
      }
    }
  ]
]);
