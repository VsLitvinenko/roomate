/*eslint-disable */

export const userData = (id: string) => {
  return {
    id,
    fullName: 'Vyacheslav Litvinenko',
    shortName: 'Vyacheslav',
    screenName: 'tiltvinenko',
    online: true,
    lastMessage: 'Ты пилил сервак уже?',
    smallImg: 'https://sun9-70.userapi.com/impf/c851428/v851428511/dc9c/X5rqZO2l3Q8.jpg?size=604x603&quality=96&sign=aac8875eedd13eee3d5d805641d0dc8c&type=album',

    imagesCount: randInt(5, 50),
    filesCount: randInt(2, 20),
    linksCount: randInt(4, 40),
    channelsCount: randInt(1, 10)
  };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
