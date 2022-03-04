import { LOADIPHLPAPI } from "dns";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";

export const state = {
  data: {
    fullName: "",
    email: "",
    geoLoc: {
      lat: "",
      lng: "",
    },
    petsNear: "",
    lastPage: "",

    reportInfo: {
      fullName: "",
      phoneNum: "",
      lastSeen: "",
      petId: "",
    },
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

  async checkUserExist() {
    const cs = this.getState();

    const res = await fetch(API_BASE_URL + "/users/" + cs.email);
    const data = await res.json();
    if (data == "user doesn't exist") {
      //console.error(data);
    } else {
      cs.fullName = data.fullName;
      this.setState(cs);
      return data;
    }
  },

  //iniciar sesion
  signIn(password, callback) {
    const cs = this.getState();

    if (cs.email) {
      fetch(API_BASE_URL + "/auth/token", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: cs.email,
          password: password,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.token.hasOwnProperty("error")) {
          } else {
            console.log(data);
            sessionStorage.setItem("token", data.token);
            callback();
          }
        });
    }
  },

  createUser(fullName, email, psw) {
    console.log("STATE", fullName, email, psw);

    fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        password: psw,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  updateUser(fullName, psw?) {
    console.log("STATE", fullName, psw);
    const savedToken = sessionStorage.getItem("token");

    fetch(API_BASE_URL + "/update-profile", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
      body: JSON.stringify({
        fullName,
        password: psw,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  async getProfile(callback) {
    const cs = this.getState();
    const savedToken = sessionStorage.getItem("token");
    const res = await fetch(API_BASE_URL + "/profile", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
    });
    const data = await res.json();

    cs.fullName = data.fullName;
    cs.email = data.email;
    this.setState(cs);
    callback();
  },

  // async checkToken() {
  //   const cs = this.getState();
  //   const savedToken = sessionStorage.getItem("token");
  //   if (!savedToken) {
  //     cs.lastPage = location.pathname;
  //     this.setState(cs);
  //     return "/ingresar";
  //   }
  // },

  async getNearPets() {
    const cs = this.getState();
    const lat = cs.geoLoc.lat;
    const lng = cs.geoLoc.lng;

    if (lat != "" || lng != "") {
      const res = await fetch(
        API_BASE_URL + "/mascotas-cerca-de" + "?lat=" + lat + "&lng=" + lng
      );
      const data = await res.json();
      console.log("DATA zs", data);
      const test = data[1].objectID;

      cs.petsNear = data;
      this.setState(cs);
    } else {
      throw "falta lat y long";
    }
  },
  /* 
////////////////BUSCAR EL STRING NUMERO DE LA FUNCION D ABAJO
*/
  async setReportInfo(reportParams) {
    const cs = this.getState();
    cs.reportInfo = reportParams;
    this.setState(cs);

    const res = await fetch(API_BASE_URL + "/report", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cs.reportInfo),
    });
    const data = await res.json();
    console.log("DATITAA", data);
  },

  // getMyLoc(callback?) {
  //   const cs = this.getState();

  //   const coor = navigator.geolocation.getCurrentPosition(function (pos) {
  //     //return pos.coords.latitude, pos.coords.longitude;

  //     cs.geoLoc.lat = pos.coords.latitude;
  //     cs.geoLoc.lng = pos.coords.longitude;
  //     state.setState(cs);
  //   });
  //   callback();
  // },
};
