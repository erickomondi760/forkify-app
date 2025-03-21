import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config.js";
import { getJson, sendJson } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    result: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookMark: [],
};

const obtainRecipeData = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(API_URL + `${id}`);

    state.recipe = obtainRecipeData(data);

    state.bookMark.some((bookmark) => {
      if (bookmark.id === id) state.recipe.isBookMarked = true;
      else state.recipe.isBookMarked = false;
    });
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (param) {
  const data = await getJson(`${API_URL}?search=${param}`);

  state.search.query = param;
  state.search.result = data.data.recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    };
  });
  state.search.page = 1;
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const storeBookmark = function () {
  localStorage.setItem("bookmark", JSON.stringify(state.bookMark));
};

export const addBookMark = function (recipe) {
  state.bookMark.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.isBookMarked = true;
  storeBookmark();
};

export const deleteBookmark = function (id) {
  let index = state.bookMark.findIndex((item) => item.id === id);
  state.bookMark.splice(index, 1);

  if (id === state.recipe.id) state.recipe.isBookMarked = false;
  storeBookmark();
};

const init = function () {
  let bookmarkData = localStorage.getItem("bookmark");
  if (bookmarkData) state.bookMark = JSON.parse(bookmarkData);
};
init();

export const persistRecipe = async function (recipe) {
  try {
    let recipeData = Object.entries(recipe);

    recipeData = recipeData
      .filter((data) => {
        return data[0].startsWith("ingredient") && data[1] !== "";
      })
      .map((ing) => {
        let ingData = ing[1].replaceAll(" ", "").split(",");
        if (ingData.length < 3) {
          throw new Error(
            "Invalid entry, ingredients must follow the specified format"
          );
        }

        let [quantity, unit, description] = ingData;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipeObject = {
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
      ingredients: recipeData,
    };
    const result = await sendJson(`${API_URL}?key=${API_KEY}`, recipeObject);

    state.recipe = obtainRecipeData(result);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
