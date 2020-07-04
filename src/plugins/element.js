import Vue from 'vue'
import {
  Button,
  DatePicker,
  Form,
  FormItem,
  Dialog,
  Input,
  Select,
  Option,
  InfiniteScroll,
  Backtop,
  Tag,
  Message
} from 'element-ui'

if (window.innerWidth <= 414) {
  Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
}

Vue.prototype.$message = Message

Vue.use(Button)
  .use(DatePicker)
  .use(Form)
  .use(FormItem)
  .use(Dialog)
  .use(Input)
  .use(Select)
  .use(Option)
  .use(InfiniteScroll)
  .use(Backtop)
  .use(Tag)
