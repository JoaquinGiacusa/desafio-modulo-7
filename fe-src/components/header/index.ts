import { Router } from "@vaadin/router";

customElements.define(
  "header-el",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");

      const petHandImg = require("../../img/petHand.svg");
      const burgerImg = require("../../img/burger.svg");

      div.innerHTML = `
    <div class="header">
      <img src="${petHandImg}" />
      <img class="burger" src="${burgerImg}" />
    </div>

    <div class="menu">
      <div class="menu-content">
        <div class="link-container">
          <a class="mis-datos">Mis datos</a>
          <a class="mis-mascotas">Mis mascotas reportadas</a>
          <a class="reportar">Reportar mascota</a>
        </div>
      </div>
    </div>
          `;

      function openMenu() {
        const burger = div.querySelector(".burger");
        burger.addEventListener("click", () => {
          div.querySelector(".menu")["style"].display = "inherit";
        });

        div.querySelector(".mis-datos").addEventListener("click", () => {
          Router.go("/ingresar");
        });
        div.querySelector(".mis-mascotas").addEventListener("click", () => {
          Router.go("/ingresar");
        });
        div.querySelector(".reportar").addEventListener("click", () => {
          Router.go("/ingresar");
        });
      }

      style.textContent = `
      .header {
          height: 8vh;
          background-color: #398ab9;
          padding:0px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

      .menu{
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #1C658C;
        }

        .menu-content{
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
        }

     .link-container{
        display: grid;
        gap:80px;
        text-align: center;
        font-size:30px;
        font-family: 'Roboto', sans-serif;
        color: white;
        margin:30px;
        }
        
        `;

      this.shadow.appendChild(style);
      this.shadow.appendChild(div);
      openMenu();
    }
  }
);
