<template>
  <div>
    <el-row>
      <el-button type="primary" size="medium" @click="addClick" style="margin-bottom: 20px;">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border  >
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column label="属性">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.spec" :key="index">
            {{item.name}}
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
<!-- 添加、编辑弹框 -->
    <el-dialog title="添加" :visible.sync="dialogFormVisible" @close="AddEditClose" >
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="labelWidth">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-tabs v-model="activeName" @tab-click="handleClick" >
          <el-tab-pane label="商品属性" name="first">
            <el-table :data="form.spec" style="width: 100%">
              <el-table-column label="属性名称" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" readonly></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.note" readonly></el-input>
                </template>
              </el-table-column>
              <el-table-column label="属性值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spec_text" readonly></el-input>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="220">
                <template slot-scope="scope">
                  <el-button type="success" size="small" @click="editSpecClick(scope.row,scope.$index)"
                    icon="el-icon-edit">选择
                  </el-button>
                  <el-button type="danger" v-if="scope.$index==0" size="small" @click="addSpecClick(scope.row.id)"
                    icon="el-icon-delete">添加
                  </el-button>
                  <el-button type="danger" v-else size="small" @click="delSpecClick(scope.$index)"
                    icon="el-icon-delete">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="属性" :visible.sync="dialogSpecVisible">
      <el-table :data="specData" style="width: 100%">
        <el-table-column prop="id" label="编号" width="120"></el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="spec_text" label="属性">

        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="selectSpecClick(scope.row)" icon="el-icon-edit">选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
  import {
    goodsTypeList,
    goodsTypeSave,
    goodsTypeDel
  } from '@/comoon/api/goodstype.js'; //调用外部JS文件

  import {
    specList
  } from '../../comoon/api/spec.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        total: 0,
        demo: false,
        dialogFormVisible: false,
        dialogSpecVisible: false,
        form: {
          spec: [{}],
          str: [{}],
        },
        specIndex: 0,
        specData: [],
        activeName: 'first',
        formLabelWidth: 200,
        labelWidth: '100px',
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
        goodsTypeList(params).then(res => {
          if (res.code == 200) {
            that.tableData = res.data.data;
            console.log(res.data.total);
            that.total = parseInt(res.data.total);
          }
          console.log(res);
        });
      },
      editClick(res) {
        console.log(res);
        this.form=res;
        this.dialogFormVisible=true;
      },
      //选择回调属性
      selectSpecClick(res) {
        let i = 0;
        if (this.form.spec.length > 0) {
          //for  filter
          this.form.spec.forEach((item, index) => {
            if (item.id == res.id) {
              i++;
              this.$message.error('已选择当前属性，不可重复');
              return; //中断循环
            }
          });
        }
        this.dialogSpecVisible = false;
        if (i == 0) {
          this.form.spec.splice(this.specIndex, 1); //先删除
          this.form.spec[this.specIndex] = res; //再赋值
        }

      },

      //编辑属性
      editSpecClick(res, index) {
        this.specIndex = index; //记录Index属性位置
        //调用属性
        let that = this;
        let params = {
          page: 1
        }
        specList(params).then(res => {
          if (res.code == 200) {
            that.specData = res.data.data;
            that.dialogSpecVisible = true;
          }
        });
      },
	  // 监听添加、编辑弹窗关闭事件
	  			AddEditClose() {						
	  				this.$refs.ruleForm.resetFields();
	  			},
      //删除属性
      delSpecClick(index) {
        this.form.spec.splice(index, 1); //删除
      },
      //增加属性
      addSpecClick(res) {
        let len = this.form.spec.length;
        //console.log(len);
        //return;
        if (this.form.spec[len - 1]['name'] == null || this.form.spec[len - 1]['spec_text'] == null) {
          this.$message.error('你还有未添加的参数');
          return;
        }
        this.form.spec.push({});
      },
      //打开弹窗
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
          goodsTypeDel({
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
        let len = this.form.spec.length;
        let i = 0;
        this.form.spec.forEach((item, index) => {
          if (item.name == null || item.spec_text == null) {
            i++;
            this.$message.error('你提交信息不完善,请补充完');
            return; //中断循环
          }
        });
        if (i == 0) {
          let that = this;
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              //提交数据接口
              goodsTypeSave(this.form).then(res => {
                if (res.code == 200) {
                  that.close(); //窗口处理
                }
                this.$message.success(res.msg);
              });
            }
          });
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      close() {
        this.dialogFormVisible = false;
        this.form = {
          spec: [{}]
        };
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
