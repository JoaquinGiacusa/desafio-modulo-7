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
      <img class="hand-img" src="${petHandImg}" />
      <img class="burger" src="${burgerImg}" />
    </div>

    <div class="menu">
    <div class="menu-content">
    <div class="cerrar">Cerrar</div>
        <div class="link-container">
          <a class="mis-datos">Mis datos</a>
          <a class="mis-mascotas">Mis mascotas reportadas</a>
          <a class="reportar">Reportar mascota</a>
        </div>
      </div>
    </div>
          `;

      const mano = div.querySelector(".hand-img");
      mano.addEventListener("click", () => {
        Router.go("/");
      });

      function openMenu() {
        const burger = div.querySelector(".burger");
        burger.addEventListener("click", () => {
          div.querySelector(".menu")["style"].display = "inherit";
        });

        div.querySelector(".mis-datos").addEventListener("click", () => {
          if (location.pathname == "/mis-datos") {
            div.querySelector(".menu")["style"].display = "none";
          } else {
            Router.go("/mis-datos");
          }
        });
        div.querySelector(".mis-mascotas").addEventListener("click", () => {
          Router.go("/my-pets");
        });
        div.querySelector(".reportar").addEventListener("click", () => {
          if (location.pathname == "/report-pet") {
            div.querySelector(".menu")["style"].display = "none";
          } else {
            Router.go("/report-my-pet");
          }
        });
        div.querySelector(".cerrar").addEventListener("click", () => {
          div.querySelector(".menu")["style"].display = "none";
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
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #1C658C;
        height: 100vh;
        z-index: 100;
        }

        .menu-content{
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
        }

        .cerrar{
          color:white;
          position:absolute;
          top:10px;
          right:10px;
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
