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
      const ubiButton = this.querySelector(".button");
      const home = this.querySelector(".home");
      const cs = state.getState();

      function getMyLoc(callback?) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          //return pos.coords.latitude, pos.coords.longitude;

          cs.geoLoc.lat = pos.coords.latitude;
          cs.geoLoc.lng = pos.coords.longitude;
          state.setState(cs);
          callback();
        });
      }

      function checkGeo() {
        if (cs.petsNear == "") {
          console.log("no hay mascotas cerca");
        } else {
          home.innerHTML = `
          <header-el></header-el>
          <div class="container">
          <div class="container-content">
          </div>
          </div>
          `;
        }
      }

      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            getMyLoc(() => {
              checkGeo();
            });
          }
          //si no tengo la loc:
          else if (result.state === "prompt") {
            ubiButton.addEventListener("click", () => {
              getMyLoc(() => {
                checkGeo();
              });
            });

            // if (cs.petsNear == "") {
            //   console.log("no hay mascotas cerca");
            // } else {
            //   console.log("array de mascotas");

            //   //home.remove();
            //   home.innerHTML = `
            //     <header-el></header-el>
            //     <div class="container">
            //     <div class="container-content">
            //     </div>
            //   </div>
            //     `;
            // }
          }
          // Don't do anything if the permission was denied.
        });

      // if (navigator.geolocation.getCurrentPosition.name == "") {
      //   const ubiButton = this.querySelector(".button");

      //   ubiButton.addEventListener("click", async () => {
      //     navigator.geolocation.getCurrentPosition(function (pos) {
      //       //return pos.coords.latitude, pos.coords.longitude;

      //       cs.geoLoc.lat = pos.coords.latitude;
      //       cs.geoLoc.lng = pos.coords.longitude;
      //       state.setState(cs);
      //     });
      //     if (cs.petsNear == "") {
      //       console.log("no hay mascotas cerca");
      //     } else {
      //       console.log("array de mascotas");
      //       const home = this.querySelector(".home");
      //       //home.remove();

      //       home.innerHTML = `
      //       <header-el></header-el>
      //       <div class="container">
      //       <div class="container-content">

      //       </div>
      //     </div>
      //       `;
      //     }
      //   });
      // } else {
      // }
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
        height: 100vh;
        font-family: 'Roboto', sans-serif;
      }

      .container{
        height: 92vh;
        
        margin: 0 auto;
        background-color: #EEEEEE;
        max-width: 600px;
      }

      .container-content{
        display: flex;
        padding:50px;
        align-items: center;
        justify-content: space-between;
        flex-direction:column;
        min-height: 400px;
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
