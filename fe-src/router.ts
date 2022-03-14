import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/ingresar", component: "sign-in" },
  { path: "/mis-datos", component: "mis-datos" },
  { path: "/report-my-pet", component: "report-pet" },
  { path: "/edit-lost-pet", component: "edit-lost-pet" },
  { path: "/my-pets", component: "my-pets" },
]);
