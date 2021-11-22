Component({
  properties: {
    name: {
      type: String,
      value: "aaa",
    },
    age: {
      type: Number,
      value: 10,
    },
  },
  data: {
    message: "我是组件A",
  },
  methods: {
    clickMe() {
      this.triggerEvent("click", {
        name: "szn",
        age: 18,
      });
    },
  },
});
