import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "mis-datos",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();

      this.render();

      // async function test() {
      //   const res = await state.checkToken();
      //   //rta /ingresar o undefined
      //   console.log(res);
      //   if (res != undefined) {
      //     Router.go(res);
      //   }
      // }
      // test();
      const savedToken = sessionStorage.getItem("token");
      if (savedToken) {
        console.log("tengo el tocken");
      } else {
        cs.lastPage = location.pathname;
        state.setState(cs);
        Router.go("/ingresar");
      }
    }

    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <div class="mis-datos">
      <header-el></header-el>
      <div class="content-cont">
        <h3 class="title">Mis datos</h3>
        <form class="form-cont">
          <label class="label"
            >NOMBRE<input class="input" type="text" name="email"
          /></label>

          <div class="psw-cont">
            <label class="label"
              >CONTRASEÑA<input class="input" type="password" name="psw"
            /></label>

            <label class="label"
              >REPETIR CONTRASEÑA<input
                class="input"
                type="password"
                name="re-psw"
            /></label>
          </div>

          <div class="button-cont">
            <button class="button">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
      `;

      style.textContent = `
      .mis-datos{
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

      .psw-cont{
        margin-top:40px;
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
    `;

      this.appendChild(style);
    }
  }
);
