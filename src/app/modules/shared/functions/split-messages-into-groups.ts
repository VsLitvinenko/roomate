export const splitMessagesIntoGroups = (messages: any[]): any[] => messages.reduce(
  (res, item, index, arr) => {
    if (
      (index === 0) ||
      (item.from !== arr[index - 1].from)
    ) {
      // new group
      res.push({
        messages: [item],
        from: item.from
      });
    }
    else {
      // add to existing group
      res[res.length - 1].messages.push(item);
    }
    return res;
  },
  []
);
