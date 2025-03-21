import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";
import paginationView from "./views/PaginationView.js";
import bookmarkView from "./views/BookmarkView.js";
import uploadRecipe from "./views/UploadRecipe.js";

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = "";

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    //Render spinner & search results
    recipeView.rendeSpinner(recipeView._parentElement);

    //update view
    resultsView.update(model.getSearchResultsPage());

    //1.Loading the recipe

    //Getting ecipe id from the link
    const id = window.location.hash.slice(1);

    if (!id) return;

    await model.loadRecipe(id);

    //2.Rendering the recipe
    recipeView.render(model.state.recipe, true);
  } catch (err) {
    recipeView.renderError();
  }
};

const searchResults = async function () {
  try {
    resultsView.rendeSpinner(resultsView._parentElement);

    const query = searchView.getQuery();

    if (!query) return;
    await model.loadSearchResults(query);

    //Render search results
    resultsView.render(model.getSearchResultsPage(), true);

    //Render pagination
    paginationView.render(model.state.search, true);
  } catch (err) {}
};

//render pagination
const controlPagination = function (pageTo) {
  //Render search results
  resultsView.render(model.getSearchResultsPage(pageTo));
  console.log("page:", model.state.search.page);

  //Render pagination
  paginationView.render(model.state.search, true);
};

//change servings
const controlServings = function (newServings) {
  //change serving details
  model.updateServings(newServings);

  //rerender the recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//Add bookmark
const bookmarkRecipe = function () {
  if (model.state.recipe.isBookMarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookMark(model.state.recipe);

  //update view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookMark, true);
  bookmarkView.update(model.state.bookMark);
};

const loadStoredBookMarks = function () {
  bookmarkView.render(model.state.bookMark, true);
};

/**
 *
 * @param {*} newRecipe
 *
 */
const uploadNewRecipe = async function (newRecipe) {
  try {
    uploadRecipe.rendeSpinner();
    //upload
    await model.persistRecipe(newRecipe);

    //render the uploaded recipe
    uploadRecipe.render(model.state.recipe);

    //show success message
    uploadRecipe.renderMessage();

    //render bookmark
    // bookmarkView.render(model.state.recipe);

    //change id in the url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //close form
    setTimeout(() => {
      uploadRecipe.toggleWindow();
    }, 10000);
  } catch (err) {
    uploadRecipe.renderError(err.message);
  }
};

//Listening for hash change & load events
const init = function () {
  bookmarkView.loadBookmarks(loadStoredBookMarks);
  recipeView.handleeRender(controlRecipe);
  recipeView.addHandlerForServings(controlServings);
  recipeView.bookmarkRecipe(bookmarkRecipe);
  searchView.addSearchHandler(searchResults);
  paginationView.addBtnClickHandler(controlPagination);
  uploadRecipe.uploadRecipeData(uploadNewRecipe);
};
init();
