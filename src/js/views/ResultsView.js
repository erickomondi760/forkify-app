import View from "./View.js";
import previewView from "./PreviewView.js";
class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "Requested recipe does not exist, Kindly retry";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join(" ");
  }
}

export default new ResultsView();
