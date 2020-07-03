<template>
  <el-dialog
    class="add-bill-dialog"
    title="添加账单"
    :visible="show"
    :show-close="true"
    @close="handleClose"
  >
    <el-form :model="billForm" label-position="left">
      <el-form-item label="时间" :label-width="formLabelWidth">
        <el-date-picker
          v-model="billForm.time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分类" :label-width="formLabelWidth">
        <el-select
          v-model="billForm.category"
          @change="handleSelectCategory"
          placeholder="选择或创建分类"
        >
          <el-option
            v-for="item in categorySelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
import { mapGetters } from 'vuex'
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
    }
  },
  computed: {
    ...mapGetters(['category'])
  },
  created() {
    this.resetDialog()
    this.categorySelect = this.category
  },
  methods: {
    handleSelectCategory(val) {
      const index = this.categorySelect.findIndex(item => item.id == val)
      this.billForm.type = this.categorySelect[index].type
    },
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
        category: this.category[0].id,
        type: this.category[0].type
      }
    },
    hideDialog() {
      this.$emit('hide')
    },
    handleConfirm() {
      const temp = this.processAmount(this.billForm)
      this.$emit('update', temp)
      this.handleCancel()
    },
    handleClose() {
      this.hideDialog()
    }
  }
}
</script>
<style lang="scss">
.add-bill-dialog {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto !important;
    min-width: 100%;
  }
  .el-select {
    display: block;
  }
}
</style>
