<template>
  <el-dialog
    class=""
    title="添加账单"
    width="30%"
    :visible.sync="show"
    :show-close="false"
  >
    <el-form :model="billForm" label-position="left">
      <el-form-item label="时间" :label-width="formLabelWidth">
        <el-date-picker
          v-model="billForm.time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
        >
          <!-- :picker-options="pickerOptions" -->
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分类" :label-width="formLabelWidth">
        <el-select v-model="billForm.category" placeholder="选择或创建分类">
          <el-option
            v-for="item in categorySelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth">
        <el-radio v-model="billForm.type" :label="0">支出</el-radio>
        <el-radio v-model="billForm.type" :label="1">收入</el-radio>
      </el-form-item>
      <el-form-item label="金额" :label-width="formLabelWidth">
        <el-input
          v-model="billForm.amount"
          min="0.00"
          type="number"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import category from '@/mock/category.csv'

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      billForm: null,
      formLabelWidth: '60px',
      categorySelect: []
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: '今天',
      //       onClick(picker) {
      //         picker.$emit('pick', new Date())
      //       }
      //     },
      //     {
      //       text: '昨天',
      //       onClick(picker) {
      //         const date = new Date()
      //         date.setTime(date.getTime() - 3600 * 1000 * 24)
      //         picker.$emit('pick', date)
      //       }
      //     },
      //     {
      //       text: '一周前',
      //       onClick(picker) {
      //         const date = new Date()
      //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      //         picker.$emit('pick', date)
      //       }
      //     }
      //   ]
      // }
    }
  },
  created() {
    this.resetDialog()
    this.categorySelect = category
  },
  methods: {
    processAmount(data) {
      data.amount = Number(data.amount).toFixed(2)
      return data
    },
    handleCancel() {
      this.hideDialog()
      this.resetDialog()
    },
    resetDialog() {
      this.billForm = {
        time: +new Date(),
        amount: 0,
        category: category[0].id,
        type: 0
      }
    },
    hideDialog() {
      this.$emit('hide')
    },
    handleConfirm() {
      const temp = this.processAmount(this.billForm)
      this.$emit('update', temp)
      this.handleCancel()
    }
  }
}
</script>
<style scoped lang="scss">
// .el-dialog {
//   .el-form-item {
//     margin-bottom: 0;
//   }
// }
</style>
