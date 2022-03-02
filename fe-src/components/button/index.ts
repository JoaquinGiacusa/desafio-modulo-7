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
        background-color: #398AB9;
        font-family: 'Roboto', sans-serif;
        font-size:30px;
        border: solid 2px black;
        border-radius: 4px;
        width:100%;
        max-width: 350px;
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
