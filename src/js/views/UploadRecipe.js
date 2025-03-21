import View from "./View.js";
import previewView from "./PreviewView.js";

class UploadRecipeView extends View {
  _parentElement = document.querySelector(".upload");

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpenRecipeWindow = document.querySelector(".nav__btn--add-recipe");
  _btnCloseRecipeWindow = document.querySelector(".btn--close-modal");
  _message = "Recipe successfully uploaded";

  constructor() {
    super();
    this.showRecipeUploadWindow();
    this.hideRecipeUploadWindow();
  }

  showRecipeUploadWindow() {
    this._btnOpenRecipeWindow.addEventListener(
      "click",
      this.toggleWindow.bind(this)
    );
  }

  hideRecipeUploadWindow() {
    this._btnCloseRecipeWindow.addEventListener(
      "click",
      this.toggleWindow.bind(this)
    );
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  uploadRecipeData(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new UploadRecipeView();
