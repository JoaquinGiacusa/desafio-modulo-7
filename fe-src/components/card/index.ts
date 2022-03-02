import { state } from "../../state";

customElements.define(
  "card-el",
  class extends HTMLElement {
    shadow: ShadowRoot;
    imageURL: string;
    name: string;
    loc: string;
    petId;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();

      // const report = this.querySelector(".report-link");
      // report.addEventListener("click", () => {
      //   console.log("anashei");
      // });
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      this.name = this.getAttribute("name");
      this.loc = this.getAttribute("loc") || "MENDOZA";
      this.imageURL = this.getAttribute("imageURL");
      this.petId = this.getAttribute("petId");

      div.innerHTML = `

      <div class="card">
      <img src="${this.imageURL}" width="300" height="200" />
      <div class="card-content">
        <div class="pet-info">
          <h2 class="pet-name">${this.name}</h2>
          <p>${this.loc}</p>
        </div>
        <div class="report">
          <a class="report-link" href="">REPORTAR INFORMACIÓN</a>
        </div>
      </div>
      <div class="modal">
        <form class="form">
          <h2 class="title">Reportar info de ${this.name}</h2>
          <label>
            <h2 class="label">Nombre</h2>
            <input type="text" class="input" name="fullname" />
          </label>
          <label>
            <h2 class="label">Tu teléfono</h2>
            <input type="text" class="input" name="phoneNum" />
          </label>
          <label>
            <h2 class="label">¿Donde lo viste?</h2>
            <textarea class="desc" name="lastSeen"></textarea>
          </label>
          <div class="btn-form-container">
          <button class="send-button">Enviar</button>
          </div>
          <div class="cerrar-container">
          <p></p>
          <p class="cerrar">Cerrar</p>
          </div>
        </form>
      </div>
    </div>
          `;
      // const test = parseInt(this.petId);
      // console.log(test);

      const report = div.querySelector(".report-link");
      report.addEventListener("click", () => {
        const modal = div.querySelector(".modal");
        modal["style"].display = "inherit";

        const form = div.querySelector(".form");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const target = e.target as any;
          const name = target.fullname.value;
          const phoneNum = target.phoneNum.value;
          const lastSeen = target.lastSeen.value;

          if (this.petId) {
            state.setReportInfo({
              fullName: name,
              lastSeen: lastSeen,
              petId: Number(this.petId),
              phoneNum: phoneNum,
            });
          }
        });
      });

      const cerrar = div.querySelector(".cerrar");
      cerrar.addEventListener("click", () => {
        const modal = div.querySelector(".modal");
        modal["style"].display = "none";
      });

      style.textContent = `
        .card{
          border: solid 2px black;
          border-radius: 5px;
          background-color: white;
        }

        .card-content{
          padding: 10px;
          display:flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .pet-name{
          margin:0;
        }

        .report{
          max-width: 130px;
          font-size:18px;
        }

        .modal{
          display:none;
          position:fixed;
          background-color: white;
          border-radius: 6px;
          border: solid 3px #D8D2CB;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding:40px;
        }

        .form{
          min-width:250px;
          height: 560px;
        }

        .title{
          font-size:32px;
          margin:10px;
        }

        .input{
          width:100%;
          height:40px;
          font-size:21px;
        }

        .label{
          margin-top:30px;
          margin-bottom: 2px;
          font-size:18px;
        }

        .desc{
          width:100%;
          height:100px;
          font-size:21px;
        }

        .btn-form-container{
          width:100%;
          flex-direction:column;
          display: flex;
          align-items: center;
          margin-top:30px;
        }
        
        .send-button {
          color: white;
          font-size: 35px;
          background-color: #398AB9;
          border: 5px solid #1C658C;
          border-radius: 5px;
          width: 100%;
          width: 280px;
        }

        .cerrar-container{
          display: flex;
          justify-content: space-between;
          margin-top:30px;
        }

        .cerrar{
          color:blue;
          cursor:pointer;
        }
        `;

      this.shadow.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
);
