<template>
  <div>
    <el-row>
		<el-input style="width:200px;" placeholder="请输入用户名或手机号"></el-input>
		<el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="small" @click="dialogFormVisible = true" style="margin-bottom: 20px;">添加</el-button>
	  <el-button type="danger" size="small" @click="">删除</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border >
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="money" label="消费金额"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top: 20px;">

      <el-pagination @size-change="handleSizeChange"
       background  @current-change="handleCurrentChange" :current-page="currentPage"
         :page-size="10" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

<!-- 添加会员弹窗 -->
    <el-dialog title="添加" :visible.sync="dialogFormVisible" @close="Addjibie">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费金额">
          <el-input v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
	
	<!-- 编辑会员弹窗 -->
	<el-dialog title="编辑" :visible.sync="EditdialogVisible" @close="Editjibie">
	  <el-form :model="EditForm" :rules="rules" ref="EditRuleForm">
	    <el-form-item label="名称" prop="name">
	      <el-input v-model="EditForm.name" autocomplete="off"></el-input>
	    </el-form-item>
	    <el-form-item label="消费金额">
	      <el-input v-model="EditForm.money" autocomplete="off"></el-input>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="EditdialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="EditData">确 定</el-button>
	  </div>
	</el-dialog>

  </div>
</template>
<style>
  .demo {
    width: 500px;
    height: 500px;
    border: 1px solid #000000;
    background: #FFF;
    position: fixed;
    top: 20px;
    margin-left: 20%;
    z-index: 1000;
  }

  .close {
    width: 96%;
    margin: 0px 50px 0px 0px;
    height: 50px;
    padding: 0px;
    line-height: 50px;
    text-align: right;
  }
</style>
<script>
  import {
    gradeList,
    gradeSave,
    gradeDel
  } from '../../comoon/api/grade.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        total:0,
        demo: false,
        dialogFormVisible: false,
		// 编辑弹窗控制
		EditdialogVisible:false,
		// 添加
        form: {
          name: '',
          money: 0,
        },
		// 编辑
		EditForm:{
			name:'',
			money:0,
		},
        formLabelWidth: 200,
        labelWidth: 200,
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

      initData() {
        let that = this;
        let params = {
          page: 1
        }
        gradeList(params).then(res => {
          if (res.code == 200) {
            that.tableData = res.data.data;
            console.log(res.data.total);
            that.total=parseInt(res.data.total);
          }
          console.log(res);
        });
      },
      editClick(res) {
        // console.log(res);
        this.EditForm = res;
        this.EditdialogVisible = true;
        //this.demo=true;
      },
     
	  // 监听添加会员关闭事件
	  Addjibie() {						
	  	this.$refs.ruleForm.resetFields()
	  },
	  // 监听编辑会员关闭事件
	  Editjibie(){
		  this.$refs.EditRuleForm.resetFields()
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
          gradeDel({
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
            //提交数据接口
            gradeSave(this.form).then(res => {
              if (res.code == 200) {
                that.close(); //窗口处理
              }
              this.$message.success(res.msg);
			   this.initData();
            });
          }
        });
      },
	  // 编辑数据
	  EditData(){
		  let that = this;
		  this.$refs['EditRuleForm'].validate((valid) => {
		    if (valid) {
		      //提交数据接口
		      gradeSave(this.EditForm).then(res => {
		        if (res.code == 200) {
		          this.EditdialogVisible = false;
		        }
		        this.$message.success(res.msg);
				 this.initData();
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
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
