import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      //const button = document.querySelector(".button");
      //   button.addEventListener("click", () => {
      //     console.log("hice click");
      //     state.getDev();
      //     Router.go("/ingresar");
      //   });
    }
    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <header-el></header-el>
      <div class="home">
      <form class="form">
        <label>
          <h2>Nombre</h2>
          <input type="text" class="input" name="fullname" />
        </label>
        <label>
          <h2>Bio</h2>
          <textarea name="bio" class="bio"></textarea>
        </label>
        <div class="profile-picture-container">
          <img class="profile-picture" />
          <h3>Arrastra tu foto aqui</h3>
        </div>
        <br />
        <div>
          <button>Guardar Perfil</button>
        </div>
      </form>
    </div>
      `;

      style.textContent = `
      .home{
        background-color: #EEEEEE;
      }
    `;

      this.appendChild(style);
    }
  }
);
