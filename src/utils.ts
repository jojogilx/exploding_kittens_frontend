export const getURL = (path: string, name: string, extension: string) => {

  return require("./assets/images/" + path + name.toLocaleLowerCase().split(" ").join("").trim() + extension
  )
};
