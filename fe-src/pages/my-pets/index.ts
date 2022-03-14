import { Router } from "@vaadin/router";

import { state } from "../../state";

customElements.define(
  "my-pets",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const cs = state.getState();

      const myPetsPage = this.querySelector(".my-pets");
      console.log(myPetsPage);

      const savedToken = sessionStorage.getItem("token");
      if (!savedToken && cs.email == "") {
        cs.lastPage = location.pathname;
        state.setState(cs);
        Router.go("/ingresar");
      } else {
        state.getMyPets(() => {
          if (cs.myPets == "") {
            document.querySelector(".container-content").innerHTML = `
            <h2>
            Aun no reportaste mascotas perdidas
            </h2>
            `;
          } else {
            checkPets();
          }
        });

        function createCard(petsColl) {
          const cards = [];
          console.log(petsColl);

          for (const pet of petsColl) {
            //if(pet.lostStatus == true){}
            const petName = pet.name;
            const petImgUrl = pet.imageURL;
            const petId = pet.id;
            const loc = pet.lastSeen;

            const cardEl =
              "<card-el " +
              "function=edit" +
              " name=" +
              petName +
              " imageURL=" +
              petImgUrl +
              " petId=" +
              petId +
              " loc='" +
              loc +
              "'></card-el>";

            cards.push(cardEl);
          }

          return cards.join("");
        }

        async function checkPets() {
          if (cs.myPets != "") {
            myPetsPage.innerHTML = `
            <header-el></header-el>
            <div class="container">
            <div class="container-content">
            <div class="cards">
            ${createCard(cs.myPets)}
            </div>
            </div>
            </div>
            `;
          }
        }
      }
    }
    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <div class="my-pets">
      <header-el></header-el>
      <div class="container">
      <div class="container-content">
      <h1 class="titulo">Mis mascotas  reportadas</h1>
      </div>
      </div>
      </div>
      `;

      style.textContent = `
      .my-pets{
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

    `;

      this.appendChild(style);
    }
  }
);
