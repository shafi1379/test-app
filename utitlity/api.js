import { article } from "./test";

export const getArticles = () => {
  fetch("https://opentdb.com/api.php?amount=10").then((response) =>
    response.json()
  );
  // .then(data => console.log(data));
  return article;
};
