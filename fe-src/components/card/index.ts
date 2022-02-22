customElements.define(
  "card-el",
  class extends HTMLElement {
    shadow: ShadowRoot;
    imageURL: string;
    name: string;
    loc: string;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");

      div.innerHTML = `

          `;

      style.textContent = `

        `;

      this.shadow.appendChild(style);
      this.shadow.appendChild(div);
    }
  }
);
