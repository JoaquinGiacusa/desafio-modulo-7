import { Router } from "@vaadin/router";
import { timeEnd } from "console";
import { state } from "../../state";

customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const cs = state.getState();
      const ubiButton = this.querySelector(".button");
      const home = this.querySelector(".home");

      function getMyLoc(callback?) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          cs.geoLoc.lat = pos.coords.latitude;
          cs.geoLoc.lng = pos.coords.longitude;
          state.setState(cs);
          callback();
        });
      }

      function createCard(petsColl) {
        const cards = [];
        for (const pet of petsColl) {
          const petName = pet.name;
          const petImgUrl = pet.imageURL;
          const petId = pet.objectID;
          //console.log("petId", petId);

          const cardEl =
            "<card-el " +
            "name=" +
            petName +
            " imageURL=" +
            petImgUrl +
            " petId=" +
            petId +
            "></card-el>";

          cards.push(cardEl);
        }

        return cards.join("");
      }

      async function checkPets() {
        if (cs.petsNear == "") {
          home.innerHTML = `
          <h2>No hay mascotas cerca de tu ubicacion actual</h2>
          `;
        } else {
          home.innerHTML = `
          <header-el></header-el>
          <div class="container">
            <div class="container-content">
              <div class="cards"> 
              ${createCard(cs.petsNear)}
              </div>
            </div>
          </div>
          `;
        }
      }

      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          //si tengo ya el permiso de loc
          if (result.state === "granted") {
            getMyLoc(() => {
              state.getNearPets().then(() => {
                checkPets();
              });
            });
          }
          //si no tengo la loc:
          else if (result.state === "prompt") {
            ubiButton.addEventListener("click", () => {
              getMyLoc(() => {
                state.getNearPets().then(() => {
                  checkPets();
                });
              });
            });
          }
        });
    }
    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <div class="home">
      <header-el></header-el>
        <div class="container">
          <div class="container-content">
            <h1 class="titulo">Mascotas perdidas cerca tuyo</h1>
            <p class="desc">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</p>
            <button class="button">Dar mi ubicación</button>
          </div>
        </div>
      </div>
      `;

      style.textContent = `
      .home{
        font-family: 'Roboto', sans-serif;
      }

      .container{ 
       margin: 0 auto;
        background-color: #EEEEEE;
        max-width: 600px;
        min-height: 92vh;
      }

      .container-content{
        display: flex;
        padding:50px;
        align-items: center;
        justify-content: space-between;
        flex-direction:column;
        min-height: 400px;
      }

      .cards{
        display:grid;
        gap: 30px;
      }

      .titulo{
        margin:0;
        font-size:40px;
      }

      .desc{
        font-size:20px;
      }

      .button{
        background-color: #398AB9;
        font-family: 'Roboto', sans-serif;
        font-size:30px;
        border: solid 2px black;
        border-radius: 4px;
        width:100%;
        max-width: 350px;
      }
    `;

      this.appendChild(style);
    }
  }
);
