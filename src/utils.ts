export const getURL = (path: string, name: string, extension: string, extension2?: string) => {

  const filePath = "./assets/images/" + path + name.toLocaleLowerCase().split(" ").join("");

  try {
    return require(`${filePath + extension}`);
  } catch (err) {
    return require(`${filePath + extension2}`);
  }

};
