<template>
  <div>
    <el-row>
      <el-button type="primary" size="medium" @click="addClick" style="margin-bottom: 20px;">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border >
      <el-table-column prop="id" label="编号" width="120"></el-table-column>
      <el-table-column prop="name" label="名称" width="120"></el-table-column>
      <el-table-column prop="note" label="备注" width="120"></el-table-column>
       <el-table-column  label="属性">
         <template slot-scope="scope">
             <span v-for="(item,index) in scope.row.spec" :key="index">
               {{item.name}} |  
             </span>
         </template>
       </el-table-column>

      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px;">
      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="添加" :visible.sync="dialogFormVisible" width="500px" @close="Addclose">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="labelWidth"
        style="height: 400px;overflow-y: auto;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" autocomplete="off"></el-input>
        </el-form-item>




        <el-form-item v-for="(item,index) in form.spec" :key="index" label="属性">
          <el-input v-model="form.spec[index].name" style="width: 200px;" autocomplete="off"></el-input>
          <el-button v-if="index>0" @click="specDel(index)">-</el-button>
          <el-button v-if="index==0" @click="specAdd()">+</el-button>
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
  import {
    specList,
    specSave,
    specDel
  } from '../../comoon/api/spec.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        total: 0,
        demo: false,
        dialogFormVisible: false,
        form: {
          spec: [{}]
        },

        formLabelWidth: 200,
        labelWidth: "100px",
        tableData: [],
        rules: {
          name: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }, ]
        }
      }
    },
    methods: {

      // 监听弹窗事件
	  Addclose(){
		  this.$refs.ruleForm.resetFields()
	  },
      initData() {
        let that = this;
        let params = {
          page: 1
        }
        specList(params).then(res => {
          if (res.code == 200) {
            that.tableData = res.data.data;
            console.log(res.data.total);
            that.total = parseInt(res.data.total);
          }
          console.log(res);
        });
      },
      specAdd() {

        this.form.spec.push({});

      },
      //删除属性
      specDel(index) {
        this.form.spec.splice(index, 1);
      },
      editClick(res) {
        console.log(res);
        this.form = res;
        this.dialogFormVisible = true;
        //this.demo=true;
      },
      addClick() {
        this.dialogFormVisible = true;
      },
      //删除事件
      delClick(id) {
        if (id == '') {
          this.$message.error('请传入ID');
          return;
        }
        let that = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          specDel({
            id: id
          }).then(res => {
            if (res.code == 200) {
              var type = 'success';

              setTimeout(that.initData, 1000); //延迟加载

            } else {
              var type = 'error';
            }
            this.$message({
              type: type,
              message: res.msg
            });
          });
        })
      },
      //添加数据
      addData() {
        let that = this;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            specSave(this.form).then(res => {
              if (res.code == 200) {
                that.close(); //窗口处理
              }
              this.$message.success(res.msg);
            });
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      close() {
        this.dialogFormVisible = false;
        this.form = {};
        this.initData();
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
