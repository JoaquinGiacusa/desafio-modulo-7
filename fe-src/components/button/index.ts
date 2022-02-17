customElements.define(
  "button-el",
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
      const button = document.createElement("button");
      const style = document.createElement("style");

      style.textContent = `
      .blue-button {
        color: white;
        font-size: 35px;
        background-color: #398AB9;
        border: 5px solid #1C658C;
        border-radius: 5px;
        width: 100%;
        width: 280px;
      }
      `;

      button.textContent = this.textContent;
      button.classList.add("blue-button");
      this.shadow.appendChild(button);
      this.shadow.appendChild(style);
    }
  }
);

/* customElements.define(
    "button-el",
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
        const button = document.createElement("button");
        const style = document.createElement("style");
  
        this.innerHTML = `
         
          `;
  
        style.textContent = `
        
        `;
  
        this.appendChild(style);
      }
    }
  ); */
