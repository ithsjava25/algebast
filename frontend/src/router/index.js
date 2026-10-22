import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ExamSelectionView from "@/views/ExamSelectionView.vue";
import ExamView from "@/views/ExamView.vue";
import ExerciseView from "@/views/ExerciseView.vue";
import AuthView from "@/views/AuthView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/exams",
    name: "exams",
    component: ExamSelectionView,
  },
  {
    path: "/exams/:examId",
    name: "exam",
    component: ExamView,
    props: true,
  },
  {
    path: "/exercises",
    name: "exercises",
    component: ExerciseView,
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
