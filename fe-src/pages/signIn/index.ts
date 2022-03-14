import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "sign-in",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const cs = state.getState();

      const form = this.querySelector(".form-cont");
      const contaier = this.querySelector(".content-cont");

      async function renderPsw(contaier) {
        contaier.innerHTML = `
        
        <h3 class="title">Ingresar</h3>
        <form class="form-cont">
          <label class="label"
            >CONTASEÑA<input class="input" type="password" name="psw"
          /></label>
          <div class="button-cont">
            <button class="button">Ingresar</button>
          </div>
        </form>
      
        `;
        const form = contaier.querySelector(".form-cont");

        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const target = e.target as any;
          const pws = target.psw.value;

          state.signIn(pws, () => {
            Router.go(cs.lastPage);
          });
        });
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const target = e.target as any;
        const email = target.email.value;
        cs.email = email;
        state.setState(cs);
        const user = await state.checkUserExist();
        if (user != undefined) {
          renderPsw(contaier);
        } else {
          Router.go("/mis-datos");
        }
      });
    }

    render() {
      const style = document.createElement("style");

      this.innerHTML = `
      <div class="sign-in">
      <header-el></header-el>
      <div class="content-cont">
        <h3 class="title">Ingresar</h3>
        <form class="form-cont">
          <label class="label"
            >EMAIL<input class="input" type="text" name="email"
          /></label>
          <div class="button-cont">
            <button class="button">Siguiente</button>
          </div>
        </form>
      </div>
    </div>
      `;

      style.textContent = `
      .sign-in{
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
    `;

      this.appendChild(style);
    }
  }
);
