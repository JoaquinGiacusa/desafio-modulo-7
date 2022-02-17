import { Router } from "@vaadin/router";

customElements.define(
  "sign-in",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <header-el></header-el>

    <div class="sign-in">
      <h3>ingresa tus datos</h3>
      <button class="button">Cambiar de pagina</button>
    </div>
      `;

      style.textContent = `
      .sign-in{
          padding:40px;
          border:solid 3px blue;
      }
    `;

      this.appendChild(style);
    }
  }
);
