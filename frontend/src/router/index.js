import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ExamView from "@/views/ExamView.vue";
import ExerciseView from "@/views/ExerciseView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/exams",
    name: "exams",
    component: ExamView,
  },
  {
    path: "/exercises",
    name: "exercises",
    component: ExerciseView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
