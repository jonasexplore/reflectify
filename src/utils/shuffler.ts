export const shuffle = (text: string) => {
  let shuffled = text.split(""),
    len = shuffled.length;

  for (let index = len - 1; index > 0; index--) {
    let randomPosition = Math.floor(Math.random() * (index + 1));
    let tmp = shuffled[index];
    shuffled[index] = shuffled[randomPosition];
    shuffled[randomPosition] = tmp;
  }

  return shuffled.join("");
};
