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
    myPets: "",
    //
    petId: "",
    reportMyLostPet: {
      name: "",
      imageURL: "",
      last_location_lat: "",
      last_location_lng: "",
      lastSeen: "",
      lostStatus: "",
    },
    //
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

  // setPetId(petId) {
  //   const cs = this.getState();
  //   cs.petId = petId;
  //   this.setState(cs);
  // },

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
            sessionStorage.setItem("token", data.token);
            callback();
          }
        });
    }
  },

  createUser(fullName, email, psw) {
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

  async getNearPets() {
    const cs = this.getState();
    const lat = cs.geoLoc.lat;
    const lng = cs.geoLoc.lng;

    if (lat != "" || lng != "") {
      const res = await fetch(
        API_BASE_URL + "/mascotas-cerca-de" + "?lat=" + lat + "&lng=" + lng
      );
      const data = await res.json();

      if (data) {
        const petsNear = data.filter((pet) => {
          return pet.lostStatus == true;
        });

        cs.petsNear = petsNear;
        this.setState(cs);
      } else {
        cs.petsNear = data;
        this.setState(cs);
      }
    } else {
      throw "falta lat y long";
    }
  },

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
    console.log(data);
  },

  setGeoLoc(lat, lng) {
    const cs = this.getState();
    (cs.reportMyLostPet.last_location_lat = lat.toString()),
      (cs.reportMyLostPet.last_location_lng = lng.toString()),
      this.setState(cs);
  },

  createALostPet(callback?) {
    const cs = this.getState();
    const savedToken = sessionStorage.getItem("token");

    fetch(API_BASE_URL + "/pet", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
      body: JSON.stringify(cs.reportMyLostPet),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        callback();
      });
  },

  editLostPet(callback?) {
    const savedToken = sessionStorage.getItem("token");
    const cs = this.getState();
    const petId = cs.petId;
    const updatedPetInfo = cs.reportMyLostPet;

    fetch(API_BASE_URL + "/update-pet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
      body: JSON.stringify({ petId, updatedPetInfo }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        callback();
      });
  },

  markFound(callback?) {
    const savedToken = sessionStorage.getItem("token");
    const cs = this.getState();
    const petId = cs.petId;
    const updatedPetInfo = cs.reportMyLostPet;

    fetch(API_BASE_URL + "/mark-found/" + petId, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        callback();
      });
  },

  deletePet(callback?) {
    const cs = this.getState();
    const savedToken = sessionStorage.getItem("token");
    const petId = cs.petId;

    fetch(API_BASE_URL + "/delet-pet/" + petId, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        callback();
      });
  },

  getMyPets(callback) {
    const cs = this.getState();
    const savedToken = sessionStorage.getItem("token");

    fetch(API_BASE_URL + "/my-pets", {
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Todos", data);

        if (data != undefined) {
          const petsLost = data.filter((pet) => {
            return pet.lostStatus == true;
          });

          cs.myPets = petsLost;
          this.setState(cs);
        } else {
          cs.myPets = data;
          this.setState(cs);
        }
        callback();
      });
  },

  getOnePetById(petId, callback?) {
    const cs = this.getState();
    const savedToken = sessionStorage.getItem("token");

    fetch(API_BASE_URL + "/pet/" + petId, {
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + savedToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.reportMyLostPet.name = data.name;
        cs.reportMyLostPet.imageURL = data.imageURL;
        cs.reportMyLostPet.last_location_lat = data.last_location_lat;
        cs.reportMyLostPet.last_location_lng = data.last_location_lng;
        this.setState(cs);
        callback();
      });
  },
};
