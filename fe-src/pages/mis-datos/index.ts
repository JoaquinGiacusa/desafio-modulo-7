import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "mis-datos",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const cs = state.getState();

      const savedToken = sessionStorage.getItem("token");
      if (savedToken) {
        state.getProfile(() => {
          const form = this.querySelector(".form-cont");
          form["fullname"].value = cs.fullName;

          //state.updateUser()
        });
      } else if (!savedToken && cs.email == "") {
        console.log("EMAIL");

        cs.lastPage = location.pathname;
        state.setState(cs);
        Router.go("/ingresar");
      }

      const form = this.querySelector(".form-cont");
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const target = e.target as any;
        const fullName = target.fullname.value;
        const psw = target.psw.value;
        const rePsw = target["re-psw"].value;

        if (savedToken && fullName != cs.fullName && psw == "") {
          console.log("1");

          state.updateUser(fullName);
        } else if (fullName == "" || psw == "") {
          window.alert("Debes completar todos los campos");
        } else if (psw != rePsw) {
          window.alert("Las contraseñas no coinciden");
        } else if (psw === rePsw) {
          //para cambiar nombre y contraseña juntos
          if (psw != "" && savedToken) {
            console.log("aca");
            state.updateUser(fullName, psw);
          } else if (!savedToken && fullName != "" && psw != "") {
            state.createUser(fullName, cs.email, psw);
            console.log("USUARIO CREADO");
            window.alert("Usuario creado exitosamente");
            state.signIn(psw, () => {
              Router.go("/");
            });
          }
        }
      });
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
            >NOMBRE<input class="input" type="text" name="fullname"
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
