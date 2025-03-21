import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data, render = false) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const html = this._generateMarkup();

    if (render === false) return html;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  update(data) {
    this._data = data;
    const newHtml = this._generateMarkup();

    //Create a virtual DOM that lives in memory
    const dom = document.createRange().createContextualFragment(newHtml);

    const newElements = Array.from(dom.querySelectorAll("*"));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    newElements.forEach((newEl, i) => {
      //Changing text content
      if (
        !newEl.isEqualNode(currentElements[i]) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        currentElements[i].textContent = newEl.textContent;
      }

      //Changing attributes
      if (!currentElements[i].isEqualNode(newEl))
        Array.from(newEl.attributes).forEach((el) => {
          currentElements[i].setAttribute(el.name, el.value);
        });
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  rendeSpinner(element) {
    const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderError(message = this._errorMessage) {
    const html = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderMessage(message = this._message) {
    const html = `
        <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}

// export default new View();
