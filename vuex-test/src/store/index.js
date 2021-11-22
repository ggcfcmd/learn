import Vue from "vue";
import Vuex from "vuex";
import moduleA from "./moduleA";
import moduleB from "./moduleB";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    moduleA,
    moduleB,
  },
  state: {
    name: "Tom",
  },
  mutations: {
    setName(state, newName) {
      state.name = newName;
    },
  },
  // actions: {
  //   modifyName({ commit }, newName) {
  //     commit("setName", newName);
  //   },
  // },
});
