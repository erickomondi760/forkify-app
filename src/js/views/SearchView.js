import View from "./View";

class SeachView extends View {
  #parentElement = document.querySelector(".search");

  getQuery() {
    const result = document.querySelector(".search__field").value;
    this.#clearInput();
    return result;
  }

  #clearInput() {
    document.querySelector(".search__field").value = "";
  }

  addSearchHandler(handler) {
    this.#parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SeachView();
