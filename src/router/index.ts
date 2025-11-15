import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameView from "../views/GameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/game",
    name: "game",
    component: GameView,
  },
  {
    path: "/challenge",
    name: "challenge",
    component: () => import("../views/ChallengeView.vue"),
  },
  {
    path: "/timingMode",
    name: "timingMode",
    component: () => import("../views/timingMode/TimingModeView.vue"),
  },
  {
    path: "/yangGame",
    name: "yangGame",
    component: () => import("../views/yangGame/YangGameView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
