export default {
  namespaced: true,
  state: {
    text: "moduleA",
  },
  mutations: {
    setText(state) {
      state.text = "A";
    },
  },
  getters: {
    detail(state, getters, rootState) {
      return state.text + "-" + rootState.name;
    },
  },
  actions: {
    callAction: {
      root: true,
      handler(namespacedContext) {
        let { state, commit } = namespacedContext;
        commit("setText");
        alert(state.text);
      },
    },
  },
};
