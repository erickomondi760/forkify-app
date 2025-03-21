import View from "./View.js";
import previewView from "./PreviewView.js";
class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet";
  _message = "";

  loadBookmarks(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join(" ");
  }
}

export default new BookmarkView();
