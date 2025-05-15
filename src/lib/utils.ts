export const parseCommaSeparatedString = (str: string) => {
  return str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

export const toIntEachItems = (arr: string[]) => {
  return arr
    .map((item) => {
      if (!isNaN(parseInt(item))) {
        return parseInt(item);
      }
    })
    .filter((item) => item !== undefined);
};
