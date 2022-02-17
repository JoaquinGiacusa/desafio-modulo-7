const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";

export const state = {
  data: {
    fullName: "",
    email: "",
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
    console.log("Soy el STATE, he cambiado a:", this.data);
    //localStorage.setItem("saved-state", JSON.stringify(newState));
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  async getDev() {
    const res = await fetch(API_BASE_URL + "/test");
    const data = await res.json();
    console.log(data);
  },

  setFullName(fullName: string) {
    const cs = this.getState();
    cs.fullName = fullName;
    this.setState(cs);
  },

  setEmail(email: string) {},
};
