export const getKeyByValue = (map, value) => {
  for (const [key, mapValue] of map.entries()) {
    if (mapValue === value) {
      return key;
    }
  }
  return null;
};
