<template>
  <div class="home flex">
    <el-menu
      default-active="/home"
      router
      @select="handleSelectMenu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-menu-item index="/home">
        <i class="el-icon-tickets"></i>
        <span slot="title">账单</span>
      </el-menu-item>
      <el-menu-item index="/summary">
        <i class="el-icon-s-data"></i>
        <span slot="title">统计</span>
      </el-menu-item>
    </el-menu>
    <div class="main-content">
      <el-form :inline="true" :model="filterForm" class="flex justify_between">
        <div class="filter-content">
          <el-form-item label="当前月份">
            <el-date-picker
              v-model="filterForm.month"
              type="month"
              placeholder="选择月份"
              @change="onSubmit"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="filterForm.month"
              type="primary"
              @click="onClear"
              icon="el-icon-scissors"
              >清除筛选</el-button
            >
          </el-form-item>
          <template v-if="output || income">
            <el-form-item label="总支出" style="color: #F56C6C;"
              >￥{{ output }}</el-form-item
            >
            <el-form-item label="总收入" style="color: #67C23A;"
              >￥{{ income }}</el-form-item
            >
          </template>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            class="add-bill"
            @click="onAdd"
            icon="el-icon-edit"
            >新增账单</el-button
          >
        </el-form-item>
      </el-form>
      <!-- TODO: 筛选项 -->
      <div class="filter-data-container" v-if="filterForm.month">
        <div class="month-container">
          {{ formatMonth(filterForm.month) }}
        </div>
        <div class="value-container">
          <div
            v-for="(item, index) in currentBillList"
            :key="index"
            class="bill-item flex justify_between align_center"
          >
            <div>
              <p>{{ item.category }}</p>
              <p>{{ item.time }}</p>
            </div>
            <div :style="{color: item.type ? '#67C23A' : '#F56C6C'}">
              {{ item.amount }}
            </div>
          </div>
          <p
            class="no-more-list"
            v-if="!currentBillList || !currentBillList.length"
          >
            暂无数据
          </p>
        </div>
      </div>
      <div
        v-if="!filterForm.month"
        class="infinite-list"
        :infinite-scroll-distance="50"
        v-infinite-scroll="loadMoreBill"
        style="overflow:auto"
      >
        <div
          v-for="(value, key, index) in splitBillList"
          :key="index"
          class="infinite-list-item"
        >
          <template>
            <div class="month-container">
              {{ formatMonth(key) }}
            </div>
            <div class="value-container">
              <div
                v-for="(item, index) in value"
                :key="index"
                class="bill-item flex justify_between align_center"
              >
                <div>
                  <p>{{ item.category }}</p>
                  <p>{{ item.time }}</p>
                </div>
                <div :style="{color: item.type ? '#67C23A' : '#F56C6C'}">
                  {{ item.amount }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <p v-if="loading">加载中...</p>
        <!-- <p class="no-more-list" v-if="noMore">没有更多了</p> -->
      </div>
      <el-backtop :bottom="100">
        <i class="el-icon-caret-top"></i>
      </el-backtop>
      <AddBillDialog
        :show="dialogFormVisible"
        @hide="handleDialogHide"
        @update="handleDialogUpdate"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import dayjs from 'dayjs'
import bill from '@/mock/bill.csv'
import category from '@/mock/category.csv'
import AddBillDialog from '@/components/AddBillDialog'

export default {
  name: 'Home',
  components: {
    AddBillDialog
  },
  data() {
    return {
      category: null,
      filterForm: {
        month: ''
      },
      dialogFormVisible: false,
      isCollapse: true,
      loading: false,
      splitBillList: {},
      // 当前筛选月份的账单列表
      currentBillList: [],
      // 总收入总支出
      income: 0,
      output: 0
    }
  },
  created() {
    this.category = this.transformCategory(category)
    const temp = this.formatBillList(bill)
    this.splitBillList = this.handleSplitBillList(temp)
  },
  // computed: {
  //   noMore() {
  //     return this.splitBillList.length >= 20
  //   }
  // },
  watch: {
    'filterForm.month'(val) {
      const month = dayjs(val).format('YYYY-MM')
      this.calculateCurrentMonth(month)
    }
  },
  methods: {
    handleSplitBillList(billList) {
      const obj = {}
      billList.forEach(item => {
        const yearAndMonth = item.time.slice(0, 7)
        if (!obj[yearAndMonth]) {
          obj[yearAndMonth] = []
          obj[yearAndMonth].push(item)
        } else {
          obj[yearAndMonth].push(item)
        }
      })
      return obj
    },
    calculateCurrentMonth(month) {
      this.currentBillList = this.splitBillList[month]
      this.income = 0
      this.output = 0
      if (!this.currentBillList) return
      this.currentBillList.forEach(item => {
        if (item.type == 1) {
          this.income += Number(Math.abs(item.amount))
        } else {
          this.output += Number(Math.abs(item.amount))
        }
      })
    },
    handleSelectMenu(key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    loadMoreBill() {
      console.log('xxxxx')
    },
    formatBillList(billList) {
      // 默认时间倒序
      const temp = billList.sort((current, next) => {
        return next.time - current.time
      })
      // this.filterForm.month = dayjs(billList[0].time).format('YYYY-MM')
      // console.log(this.filterForm.month)
      return temp.map(item => {
        item.time = dayjs(item.time).format('YYYY-MM-DD HH:MM')
        item.category = this.category[item.category]
        item.amount = !item.type
          ? '-' + Math.abs(item.amount)
          : Math.abs(item.amount)
        return item
      })
    },
    transformCategory(category) {
      const temp = {}
      category.forEach(item => {
        temp[item.id] = item.name
      })
      return temp
    },
    formatDate(string) {
      return dayjs(string).format('YYYY-MM-DD HH:MM')
    },
    formatMonth(string) {
      return dayjs(string).format('YYYY年MM月')
    },
    tableRowClassName({row, rowIndex}) {
      if (row.type === 1) {
        return 'success-row'
      } else if (row.type === 0) {
        return 'warning-row'
      }
      return ''
    },
    onAdd() {
      console.log('add')
      this.dialogFormVisible = true
    },
    handleDialogHide() {
      this.dialogFormVisible = false
    },
    onSubmit() {
      console.log('submit')
    },
    handleDialogUpdate(data) {
      bill.unshift(data)
    },
    onClear() {
      this.filterForm.month = ''
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  min-height: 100vh;
}
.main-content {
  width: 100%;
  box-sizing: border-box;
}
.filter-content {
  padding-left: 15px;
}
.filter-data-container {
  padding: 0 10px 0 10px;
  font-size: 14px;
}
.month-container {
  padding-left: 10px;
  height: 32px;
  line-height: 32px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #79bbff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.bill-item {
  background-color: #fafafa;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 1;
  &:nth-of-type(2n - 1) {
    background-color: #fff;
  }
  &:hover {
    background-color: #f5f7fa;
  }
  // p {
  //   margin: 0;
  //   line-height: 1.5;
  //   padding: 4px 0px;
  // }
}
.infinite-list-item {
  padding: 0 10px 0 10px;
  font-size: 14px;
  // border-bottom: 1px solid #eee;
  // &:first-child {
  //   border-top: 1px solid #eee;
  // }
}
.no-more-list {
  text-align: center;
  color: #999;
  font-size: 14px;
}
.el-form {
  padding-top: 15px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  min-height: 36px;
  border-radius: 4px;
}
.el-table .warning-row {
  background: #fde2e2;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
