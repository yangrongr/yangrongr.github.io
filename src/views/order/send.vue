<template>
  <div>
    <el-dialog title="配送" width="50%" :visible.sync="invoiceFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="物流公司">
          <el-select v-model="value" placeholder="请选择物流公司">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流订单号" :label-width="formLabelWidth">
          <el-input v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="发货地址" :label-width="formLabelWidth">
          <el-input v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
</script>

<style>
</style>
