export const splitMessagesIntoGroups = (messages: any[]): any[] => messages.reduce(
  (res, item, index, arr) => {
    if (
      (index === 0) ||
      (item.from !== arr[index - 1].from)
    ) {
      // new group
      res.push([item]);
    }
    else {
      // add to existing group
      res[res.length - 1].push(item);
    }
    return res;
  },
  []
);
