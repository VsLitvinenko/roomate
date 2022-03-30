/*eslint-disable */

export const usersImages = [
  'https://sun9-70.userapi.com/impf/c851428/v851428511/dc9c/X5rqZO2l3Q8.jpg?size=939x938&quality=96&sign=23067997c0ef1020b9459d5baf7f582f&type=album',
  'https://sun9-55.userapi.com/impf/c851428/v851428511/dcad/nzCHOSymubI.jpg?size=1200x1200&quality=96&sign=c18587ad6b9e3d6641d1cc48353e176c&type=album',
  'https://sun9-57.userapi.com/impf/c851428/v851428511/dcb7/LhfeUh9E2q8.jpg?size=1600x1600&quality=96&sign=1546243d353dc2e6bda98d3c381945d8&type=album',
  'https://sun9-82.userapi.com/impf/c851428/v851428511/dccb/RRBs7avCEw0.jpg?size=2160x2160&quality=96&sign=1dac912caac1d64b3e00188e4799b80e&type=album',
  'https://sun9-43.userapi.com/impf/c851428/v851428511/dcef/po3GAAjA4Yc.jpg?size=1800x1800&quality=96&sign=547343b89a6f515cc775b49bede58ef3&type=album',
  'https://sun9-56.userapi.com/impf/c845017/v845017302/f6a61/ZgBk9vvzdeI.jpg?size=1300x1300&quality=96&sign=bbc5c596c12c09d268328514f2cc9f62&type=album'
];

export const rooms = [
  {
    id: 1,
    title: 'room 1',
    private: true,
    joined: {
      total: 10,
      list: [
        { name: 'slava', img: usersImages[0] },
        { name: 'sasha', img: usersImages[1] },
        { name: 'anton', img: usersImages[2] },
        { name: 'ilvir', img: usersImages[3] },
        { name: 'sonya', img: usersImages[4] },
        // { name: 'zamir', img: usersImages[5] },
      ]
    }
  },
  {
    id: 2,
    title: 'room 2',
    private: false,
    joined: {
      total: 4,
      list: [
        { name: 'slava', img: usersImages[0] },
        { name: 'sasha', img: usersImages[1] },
        { name: 'anton', img: usersImages[2] },
        { name: 'ilvir', img: usersImages[3] },
      ]
    }
  },
  {
    id: 3,
    title: 'room 3',
    private: false,
    joined: {
      total: 2,
      list: [
        { name: 'slava', img: usersImages[0] },
        { name: 'anton', img: usersImages[2] },
      ]
    }
  },
];
