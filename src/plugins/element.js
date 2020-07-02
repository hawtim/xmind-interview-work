import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  DatePicker,
  Form,
  FormItem,
  Dialog,
  Input,
  Select,
  Option,
  InfiniteScroll,
  Radio,
  Backtop
} from 'element-ui'

if (window.innerWidth <= 414) {
  Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
}

Vue.use(Button)
  .use(Row)
  .use(Col)
  .use(DatePicker)
  .use(Form)
  .use(FormItem)
  .use(Dialog)
  .use(Input)
  .use(Select)
  .use(Option)
  .use(InfiniteScroll)
  .use(Radio)
  .use(Backtop)
