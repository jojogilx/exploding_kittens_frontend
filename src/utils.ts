export const getURL = (path: string, name: string, extension: string) => {
  console.log(new URL(
    "./assets/images/" + path + name.toLocaleLowerCase().split(" ").join("").trim() + extension,
    import.meta.url,
  ).href)
  return new URL(
    "./assets/images/" + path + name.toLocaleLowerCase().split(" ").join("").trim() + extension,
    import.meta.url,
  ).href;
};
