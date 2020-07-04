<template>
  <div class="home flex">
    <div class="main-content">
      <el-form :inline="true" :model="filterForm" class="flex justify_between">
        <div class="filter-content">
          <el-form-item label="当前月份">
            <el-date-picker
              v-model="filterForm.month"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="当前分类">
            <el-select
              v-model="filterForm.category"
              clearable
              placeholder="选择分类"
            >
              <el-option
                v-for="item in category"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item>
            <el-button
              type="success"
              class="add-bill"
              @click="onAdd"
              icon="el-icon-edit"
              >新增账单</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-form
        :inline="true"
        class="flex align_center"
        v-if="filterForm.month || filterForm.category"
      >
        <div class="filter-condition flex align_center" v-if="output || income">
          <el-form-item
            class="current-filter-condition"
            :label="'当前筛选条件：'"
          >
            <el-tag
              closable
              @close="filterForm.month = ''"
              v-if="filterForm.month"
              style="margin-right: 10px;"
              type="primary"
            >
              {{ formatMonth(filterForm.month) }}
            </el-tag>
            <el-tag
              closable
              @close="filterForm.category = ''"
              v-if="filterForm.category"
              style="margin-right: 10px;"
              type="primary"
            >
              {{ categoryMap[filterForm.category] }}
            </el-tag>
          </el-form-item>
          <el-form-item label="总支出" style="color: #F56C6C;"
            >￥{{ output }}</el-form-item
          >
          <el-form-item label="总收入" style="color: #67C23A;"
            >￥{{ income }}</el-form-item
          >
        </div>
      </el-form>
      <!-- 统计区域 -->
      <div
        class="statistic-container flex justify_center"
        :style="isMobile ? 'flex-direction: column;' : ''"
        v-if="this.currentBillList && filterForm.month && !filterForm.category"
      >
        <ve-pie
          v-if="output"
          :style="{ width: isMobile ? '100%' : '50%' }"
          :data="outputChartData"
        ></ve-pie>
        <ve-pie
          v-if="income"
          :style="{ width: isMobile ? '100%' : '50%' }"
          :data="incomeChartData"
        ></ve-pie>
      </div>
      <!-- 有月份的筛选结果 -->
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
            <div :style="{ color: item.type ? '#67C23A' : '#F56C6C' }">
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
      <!-- 所有月份的结果列表 -->
      <div
        v-if="!filterForm.month"
        class="infinite-list"
        :infinite-scroll-distance="50"
        v-infinite-scroll="loadMoreBill"
        style="overflow:auto"
      >
        <template v-if="!filterSplitBillList">
          <div
            v-for="(value, key, index) in splitBillList"
            :key="index"
            class="infinite-list-item"
          >
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
                <div :style="{ color: item.type ? '#67C23A' : '#F56C6C' }">
                  {{ item.amount }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="filterSplitBillList">
          <div
            v-for="(value, key, index) in filterSplitBillList"
            :key="index"
            class="infinite-list-item"
          >
            <template>
              <div class="month-container" v-if="value.length">
                {{ formatMonth(key) }}
              </div>
              <div class="value-container" v-if="value.length">
                <div
                  v-for="(item, index) in value"
                  :key="index"
                  class="bill-item flex justify_between align_center"
                >
                  <div>
                    <p>{{ item.category }}</p>
                    <p>{{ item.time }}</p>
                  </div>
                  <div :style="{ color: item.type ? '#67C23A' : '#F56C6C' }">
                    {{ item.amount }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <!-- <p v-if="loading">加载中...</p> -->
        <p class="no-more-list" v-if="true">没有更多了</p>
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
import { formatDate } from '@/utils'
import AddBillDialog from '@/components/AddBillDialog'

export default {
  name: 'Home',
  components: {
    AddBillDialog
  },
  data() {
    return {
      originBill: [],
      // 二级筛选条件
      filterForm: {
        month: '',
        category: ''
      },
      // 添加账单
      dialogFormVisible: false,
      // 用于页面响应的数据
      isMobile: false,
      isCollapse: window && window.innerWidth <= 768,
      // loading: false,
      // 当前筛选月份的账单列表
      currentBillList: [],
      filterSplitBillList: null,
      // 总收入总支出
      income: 0,
      output: 0,
      // 图表数据
      outputChartData: {
        columns: ['分类', '消费金额']
      },
      incomeChartData: {
        columns: ['分类', '消费金额']
      }
    }
  },
  computed: {
    ...mapGetters(['bill', 'category', 'categoryMap', 'splitBillList'])
  },
  created() {
    if (window.innerWidth <= 414) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    this.$store.commit('transformCategory')
    // 不修改源数据
    this.processBillList()
  },
  watch: {
    'filterForm.month'(val) {
      if (!val) {
        this.filterSplitBillList = null
        if (this.filterForm.category) {
          const category = this.filterForm.category
          this.calculateCurrentCategory(category)
        }
        return
      }
      const month = formatDate(val, 'YYYY-MM')
      this.calculateCurrentMonth(month)
    },
    'filterForm.category'(val) {
      if (!val) {
        this.filterSplitBillList = null
        if (this.filterForm.month) {
          const month = formatDate(this.filterForm.month, 'YYYY-MM')
          this.calculateCurrentMonth(month)
        }
        return
      }
      const category = val
      this.calculateCurrentCategory(category)
    }
  },
  methods: {
    processBillList() {
      this.originBill = Object.assign([], this.bill)
      const temp = this.formatBillList(this.bill)
      this.$store.commit('handleSplitBillList', temp)
    },
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
      if (!this.filterForm.category) {
        this.currentBillList = this.splitBillList[month]
        this.calculateCurrentTotal()
        this.calculateChartData()
      } else {
        const temp = this.splitBillList[month] || []
        this.currentBillList = temp.filter(
          item => item.category == this.categoryMap[this.filterForm.category]
        )
        this.calculateCurrentTotal()
      }
    },
    // 计算图片相关数据
    calculateChartData() {
      if (!this.currentBillList || !this.currentBillList.length) return
      this.incomeTotal()
      this.outputTotal()
    },
    incomeTotal() {
      const temp = {}
      this.currentBillList.forEach(item => {
        if (item.type == 1) {
          const absAmount = Math.abs(item.amount)
          if (temp[item.category]) {
            temp[item.category] += Number(absAmount)
          } else {
            temp[item.category] = 0
            temp[item.category] += Number(absAmount)
          }
        }
      })
      this.incomeChartData = Object.assign({}, this.incomeChartData, {
        rows: Object.keys(temp)
          .map(key => {
            return {
              分类: key,
              消费金额: temp[key]
            }
          })
          .sort((cur, next) => {
            return cur['消费金额'] - next['消费金额']
          })
      })
    },
    outputTotal() {
      const temp = {}
      this.currentBillList.forEach(item => {
        if (item.type == 0) {
          const absAmount = Math.abs(item.amount)
          if (temp[item.category]) {
            temp[item.category] += Number(absAmount)
          } else {
            temp[item.category] = 0
            temp[item.category] += Number(absAmount)
          }
        }
      })
      this.outputChartData = Object.assign({}, this.outputChartData, {
        rows: Object.keys(temp)
          .map(key => {
            return {
              分类: key,
              消费金额: temp[key]
            }
          })
          .sort((cur, next) => {
            return cur['消费金额'] - next['消费金额']
          })
      })
    },
    // 计算当前列表的里的总收入和总支出
    calculateCurrentTotal() {
      this.income = 0
      this.output = 0
      if (!this.currentBillList) return
      this.currentBillList.forEach(item => {
        const absAmount = Math.abs(item.amount)
        if (item.type == 1) {
          this.income += Number(absAmount)
        } else {
          this.output += Number(absAmount)
        }
      })
    },
    // 筛选出当前分类下的列表
    calculateCurrentCategory(category) {
      if (!this.filterForm.month) {
        // 筛选全部里的某一个分类
        const temp = {}
        Object.keys(this.splitBillList).forEach(key => {
          const filtered = this.splitBillList[key].filter(
            item => item.category == this.categoryMap[category]
          )
          temp[key] = filtered
        })
        this.filterSplitBillList = temp
      } else {
        // 筛选某个月份下的某个分类
        const month = formatDate(this.filterForm.month, 'YYYY-MM')
        const temp = this.splitBillList[month] || []
        this.currentBillList = temp.filter(
          item => item.category == this.categoryMap[category]
        )
        this.calculateCurrentTotal()
      }
    },
    loadMoreBill() {
      console.log('TODO 加载更多账单')
    },
    sortBillList(billList) {
      return billList.sort((current, next) => next.time - current.time)
    },
    formatBillList(billList) {
      // 默认时间倒序
      const temp = this.sortBillList(billList)
      return temp.map(item => {
        item.time = formatDate(item.time)
        item.category = this.categoryMap[item.category] || item.category
        const absAmount = Math.abs(item.amount)
        item.amount = !item.type ? '-' + absAmount : absAmount
        return item
      })
    },
    formatMonth(string) {
      return formatDate(string, 'YYYY年MM月')
    },
    onAdd() {
      this.dialogFormVisible = true
    },
    handleDialogHide() {
      this.dialogFormVisible = false
    },
    handleDialogUpdate(data) {
      console.log(data)
      this.filterForm.month = ''
      this.filterForm.category = ''
      // 新增数据更新
      this.$store.commit('addBill', data)
      this.$message({
        message: '添加成功',
        type: 'success'
      });
      this.processBillList()
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
  padding-top: 64px;
  box-sizing: border-box;
  background-color: #fff;
  .filter-content {
    padding-left: 15px;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: auto !important;
      min-width: 100%;
    }
    .el-select {
      display: block;
    }
  }
  .filter-condition {
    padding-left: 15px;
    margin-bottom: 0px;
  }
  .filter-data-container {
    padding: 0 10px 0 10px;
    font-size: 14px;
  }
  .el-form-item.current-filter-condition {
    margin-right: 0;
    .el-form-item__label {
      padding: 0;
    }
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
  }
  .infinite-list-item {
    padding: 0 10px 0 10px;
    font-size: 14px;
  }
  .no-more-list {
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  .el-form {
    padding-top: 15px;
  }
}

// 大于 768
@media screen and (min-width: 768px) {
  .home {
    padding: 0 15%;
  }
}
// 小于 768 大于 414
@media screen and (max-width: 768px) and (min-width: 415px) {
  .home {
    padding: 0 10%;
  }
}
// 小于 414
@media screen and (max-width: 414px) {
  .home {
    padding: 0 0;
  }
  .main-content {
    padding-top: 10px;
  }
}
</style>
