import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, container, header, aside, main, 
  Menu, Submenu, MenuItemGroup, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox, Tag, Tree, Select, Option, Alert, Step, Steps, Tabs, TabPane , Cascader,
  CheckboxGroup, Checkbox, Upload, Timeline, TimelineItem } from 'element-ui'

Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Upload)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Alert)
Vue.use(Option)
Vue.use(Select)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
