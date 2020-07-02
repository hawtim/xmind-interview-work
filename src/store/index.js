import Vue from 'vue'
import Vuex from 'vuex'
import bill from '@/mock/bill.csv'
import category from '@/mock/category.csv'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    category: category,
    bill: bill,
    categoryMap: {},
    splitBillList: {}
  },
  mutations: {
    transformCategory(state) {
      const temp = {}
      state.category.forEach(item => {
        temp[item.id] = item.name
      })
      this.commit('updateCategoryMap', temp)
    },
    updateCategoryMap(state, map) {
      state.categoryMap = map
    },
    // CURD
    addBill(state, data) {
      state.bill.unshift(data)
    },
    deleteBill(state, data) {
      // delete bill
    },
    updateBill(state, data) {
      // update bill
    },
    handleSplitBillList(state, data) {
      const temp = {}
      data.forEach(item => {
        const yearAndMonth = item.time.slice(0, 7)
        if (!temp[yearAndMonth]) {
          temp[yearAndMonth] = []
          temp[yearAndMonth].push(item)
        } else {
          temp[yearAndMonth].push(item)
        }
      })
      this.commit('updateSplitBillList', temp)
    },
    updateSplitBillList(state, data) {
      state.splitBillList = data
    }
  },
  getters: {
    bill: state => state.bill,
    category: state => state.category,
    categoryMap: state => state.categoryMap,
    splitBillList: state => state.splitBillList
  }
})
