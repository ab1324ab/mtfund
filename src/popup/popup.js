import Vue from "vue";
import App from "./App";
import axios from "axios";
import {
  Button,
  Dialog,
  Icon,
  Loading,
  Message,
  Option,
  RadioButton,
  RadioGroup,
  Select,
  Slider,
  Switch,
  TabPane,
  Tabs,
  Badge,
  Tooltip,
  Col,
  Row,
  Card,
  Tag,
  MessageBox
} from "element-ui";

Vue.prototype.$axios = axios;
Vue.prototype.$ELEMENT = { size: "mini" };
Vue.prototype.$message = Message;
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(Slider);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(Tooltip);
Vue.use(Col);
Vue.use(Row);
Vue.use(Card);
Vue.use(Tag);
// Vue.use(MessageBox)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
