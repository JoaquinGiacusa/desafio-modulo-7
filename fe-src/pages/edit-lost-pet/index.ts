import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";

const mapToken = process.env.MAPBOX_TOKEN;

import mapboxgl from "mapbox-gl";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

customElements.define(
  "edit-lost-pet",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const cs = state.getState();
      const form = document.querySelector(".form-cont");
      const imgCont = document.querySelector(".pet-picture-container");

      const savedToken = sessionStorage.getItem("token");
      if (!savedToken && cs.email == "") {
        cs.lastPage = location.pathname;
        state.setState(cs);
        Router.go("/ingresar");
      } else if (cs.lastPage == "/my-pets" && cs.petId != "") {
        form["fullname"].value = cs.reportMyLostPet.name;
        imgCont.innerHTML = `
        <img src="${cs.reportMyLostPet.imageURL}" style="width: 220px; height:140px;" ">
        `;

        form.addEventListener("submit", (e) => {
          e.preventDefault();

          const petName = form["fullname"].value;

          if (petName != "") {
            cs.reportMyLostPet.name = petName;
            const lat = cs.reportMyLostPet.last_location_lat;
            const lng = cs.reportMyLostPet.last_location_lng;

            fetch(
              "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                lng +
                "," +
                lat +
                ".json?access_token=" +
                mapToken
            )
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                const loc = data.features[0]["place_name"];

                const finalLoc = loc.split(",");
                //console.log(finalLoc.splice(1).join(","));
                return finalLoc.splice(1).join(",");
              })
              .then((loc) => {
                cs.reportMyLostPet.lastSeen = loc;
                state.setState(cs);
              })
              .then(() => {
                state.editLostPet(() => {
                  Router.go("/my-pets");
                });
              });
          } else {
            console.log("falta el nombre");
          }
        });

        let imageDataURL;
        let myDropzone = new Dropzone(".pet-picture-container", {
          url: "/falsa",
          autoProcessQueue: false,
        });

        myDropzone.on("thumbnail", function (file) {
          // usando este evento pueden acceder al dataURL directamente
          //console.log(file.dataURL);
          document.querySelector(".dz-success-mark").remove();
          document.querySelector(".dz-filename").remove();
          document.querySelector(".dz-details").remove();
          document.querySelector(".dz-error-mark").remove();
          const petImg = document.querySelector(".dz-image");
          petImg.firstChild["classList"].add("petImg");
          console.log(petImg);

          imageDataURL = file.dataURL;
          if (imageDataURL != undefined) {
            cs.reportMyLostPet.imageURL = imageDataURL;
            state.setState(cs);
            labelPet.textContent = "Borrar imagen";
          }
        });

        const labelPet = document.querySelector(".pet-text");
        labelPet.addEventListener("click", () => {
          imgCont.innerHTML = "";
          labelPet.textContent =
            "Arrastra o clickea en el rectangulo de abajo para agregar una imagen de tu mascota.";
        });

        (function () {
          mapboxgl.accessToken = mapToken;
          const map = new mapboxgl.Map({
            container: "map", // container ID
            style: "mapbox://styles/mapbox/streets-v11", // style URL
            center: [-60.708399, -31.622584], // starting position [lng, lat]
            zoom: 9, // starting zoom
          });

          var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
          });
          map.addControl(geocoder);

          var marker1;
          const lat = cs.reportMyLostPet.last_location_lat;
          const lng = cs.reportMyLostPet.last_location_lng;
          if (lat != "" && lng != "") {
            marker1 = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
          } else {
            marker1 = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);
          }

          map.on("click", (e) => {
            var coordinates = e.lngLat;
            console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);
            marker1.setLngLat(coordinates).addTo(map);
            state.setGeoLoc(coordinates.lat, coordinates.lng);
          });
        })();

        document.querySelector(".delet-pet").addEventListener("click", () => {
          console.log("delete");
          state.deletePet(() => {
            Router.go("/my-pets");
          });
        });

        document.querySelector(".finded-btn").addEventListener("click", () => {
          console.log("found");
          state.markFound(() => {
            Router.go("/my-pets");
          });
        });
      }
    }

    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <div class="report-pet">
      <header-el></header-el>
      
      <div class="content-cont">
        <h3 class="title">Editar
        mascota perdida</h3>
        <form class="form-cont dropzone">
          <label class="label"
            >NOMBRE<input class="input" type="text" name="fullname"
          /></label>

          <p class="pet-text">Borrar imagen</p>
          <div class="pet-picture-container"></div>
        
          <div id='map' class="mapa" style='width: 350px; height: 200px;'></div>
          <p>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad. Luego seleccion la ubicacion haciendo click en el mapa.</p>

          <div class="button-cont">
          <button class="button">Guardar</button>
          </div>
          </form>
          <div class="edit-conteiner">
            <button class="finded-btn">Reportar como encontrado</button>
            <a class="delet-pet">Despublicar</a>
          </div>
      </div>
    </div>
      `;

      style.textContent = `
      .report-pet{
        font-family: 'Roboto', sans-serif;
      }

      .content-cont{
        padding:50px;
        margin: 0 auto;
        background-color: #EEEEEE;
        max-width: 600px;
        min-height: 92vh;
      }

      .title{
        font-size:45px;
        margin:30px;
        text-align: center;
      }
      
      
      .form-cont{
        max-width: 351px;
        margin: 70px auto;
      }

      .label{
        font-size:20px;

      }

      .input{
        display:block;
        margin:0px 0px;
        width:100%;
        height:40px;
        max-width: 351px;
        font-size:21px;
      }


      .button-cont{
        margin-top:30px;
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

      .pet-picture-container{
        border:solid 3px black;
        border-radius: 4px;
        width:230px;
        height:150px;
        display: flex;
        align-items: center;
        margin: 0 auto;
      }
      
      .pet-text{
        margin:30px 0 0 0;
        font-size:15px;
      }

      .petImg{
        height:130px;
        width:220px;
      }

      .mapa{
        margin-top: 30px;
      }

      .edit-conteiner{
      display: flex;
      flex-direction:column;
      text-align: center;
      } 
      
      .finded-btn{
        background-color: #219F94;
        font-family: 'Roboto', sans-serif;
        font-size:20px;
        border: solid 2px black;
        border-radius: 4px;
        max-width: 350px;
        margin: 0 auto;
      } 
      
      .delet-pet{
        color: red;
        text-decoration: underline red;
        margin-top:20px;
        cursor: pointer;
      }
    `;

      this.appendChild(style);
    }
  }
);
