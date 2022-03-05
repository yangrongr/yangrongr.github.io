<template>
	<div>
		<el-row>

			<el-input style="width:200px;" placeholder="请输入用户名或真实姓名" v-model="sechName"></el-input>
      <el-button type="primary" size="medium" style="margin-bottom: 20px;" icon="el-icon-search" @click="sechClick(sechName)">搜索</el-button>

			<el-button type="primary" size="small" style="margin-left:20px;" @click="dialogFormVisible = true">添加
			</el-button>
			<el-button type="danger" size="small" @click="delDialog">删除</el-button>
		</el-row>

		<el-table ref="multiTable" class="dark" :data="tableData" tooltip-effect="dark"
			style="width: 100%;margin-top: 20px;" row-key="id" @selection-change="handleSelectionChange"
			@select-all="selectAll" border >
			<el-table-column type="selection" width="60" align="center"></el-table-column>
			<el-table-column fixed prop="id" label="编号" width="80"></el-table-column>
			<el-table-column prop="name" label="用户名" width="120"></el-table-column>
			<el-table-column prop="real_name" label="真实姓名" width="120"></el-table-column>
			<el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
			<el-table-column prop="tuijian" label="推荐人" width="120">
				<template slot-scope="scope">
					<el-row>
						{{scope.row.tuijian==null?"无":scope.row.tuijian}}
					</el-row>
				</template>

			</el-table-column>
			<el-table-column prop="balance" label="金额" width="100"></el-table-column>
			<el-table-column prop="point" label="积分" width="120"></el-table-column>
			<el-table-column label="状态" width="120">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#02538C"
						inactive-color="#B9B9B9" @change="changeSwitch(scope.row)" />
				</template>

			</el-table-column>
			<el-table-column prop="group_id" label="会员等级" width="120"></el-table-column>
			<el-table-column prop="reg_time" label="注册时间" width="200"></el-table-column>
			<el-table-column fixed="right" label="操作" width="220">
				<template slot-scope="scope">
					<el-button type="success" size="small" @click="editClick(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="delClick(scope.row.id)">删除</el-button>
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- <el-pagination background layout="prev, pager, next" :total="total" @current-change="Page"
			style="margin-top: 30px;float: right;">
		</el-pagination> -->

  <!-- 页数 -->
  
    
  <!--  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
  


		<!-- 添加用户弹框 -->

		<el-dialog title="添加" width="50%" top="5vh" :visible.sync="dialogFormVisible" @close="closeAddDialog">
			<el-form ref="addForm" :model="form" :rules="rules">
				<el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
					<el-input size="small" v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" :label-width="formLabelWidth" prop="password">
					<el-input type="password" v-model="form.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" :label-width="formLabelWidth" prop="repassword">
					<el-input v-model="form.repassword" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
					<el-input v-model="form.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="真实姓名" :label-width="formLabelWidth">
					<el-input v-model="form.real_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="金额" :label-width="formLabelWidth" prop="balance">
					<el-input v-model="form.balance" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" :label-width="formLabelWidth">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-color="#02538C"
						inactive-color="#B9B9B9" />
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="AddcloseDialog"> 取 消</el-button>
				<el-button type="primary" @click="Addsubmit">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑用户弹框 -->
		<el-dialog title="编辑" width="50%" top="5vh" :visible.sync="EditFormVisible" @close="closeEdit">
			<el-form ref="EditFormRef" :model="editRuleForm" :rules="EditRules">
				<el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
					<el-input disabled  size="small" v-model="editRuleForm.name" autocomplete="off"></el-input>
				</el-form-item>


				<el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
					<el-input v-model="editRuleForm.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="真实姓名" :label-width="formLabelWidth">
					<el-input v-model="editRuleForm.real_name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="金额" :label-width="formLabelWidth" prop="balance">
					<el-input v-model="editRuleForm.balance" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" :label-width="formLabelWidth">
					<el-switch v-model="editRuleForm.status" :active-value="1" :inactive-value="0"
						active-color="#02538C" inactive-color="#B9B9B9" />
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditDialog"> 取 消</el-button>
				<el-button type="primary" @click="Editsubmit">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<style type="text/css">

</style>

<script>
	var a = 1 //number  1.int 2.float
	var b = "1" //string
	//===判定数据类型
	//parseInt(b)把string 转换成int
	if (a === parseInt(b)) {
		//alert("等于")
	} else {
		//alert("不等于")
	}


	import {
		userList,
		userSave,
		userDel
	} from '../../comoon/api/user.js'
	export default {
		methods: {
			handleClick(row) {
				console.log(row);
			}
		},

		data() {
			// 验证金额只能为数字
			 var isNum = (rule, value, callback) => {
			      const age= /^[0-9]*$/
			      if (!age.test(value)) {
			        callback(new Error('金额只能为数字'))
			      }else{
			        callback()
			      }
			    };
				
			// 验证手机号的规则

			var checkMobile = (rule, value, cb) => {
				// 验证手机号的正则表达式
				const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

				if (regMobile.test(value)) {
					return cb()
				}

				cb(new Error('请输入合法的手机号'))
			};
			
			// 密码比对
			var checkRepassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'))
				} else if (value !== this.form.password) {
					callback(new Error('两次输入密码不一致！'))
				} else {
					callback();
				}
			};
			return {
				sechName: "",
				listSech: [],
				allSech: [],
				checkList: [{
						id: 1,
						checked: false
					},
					{
						id: 2,
						checked: false
					},
					{
						id: 3,
						checked: false
					},
				], //全选demo
				dailog_title: '添加',
				getRowKeys: '',
				value: [],
				options: [],
				tableData: [],
				total: 0,
				pagenum: 1,
				dialogFormVisible: false, //弹窗
				EditFormVisible: false, //编辑弹窗
				form: {
					id: '',
					name: '',
					password: '',
					repassword: '',
					phone: '',
					real_name: '',
					status: 1,
					balance: '',
					address: '',
				}, //数据
				editRuleForm: {
					id: '',
					name: '',
					password: '',
					phone: '',
					balance: '',
					real_name: '',
					status: 1,
				},
				delid: [], //删除ID
				formLabelWidth: '100px',
				// 表单验证规则
				rules: {
					balance:[{
							required: true,
							message: '请输入金额',
							trigger: 'blur'
						},
						{
							trigger: 'blur',
							validator: isNum,
						}
					],
					name: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户名的长度在3~10个字符之间',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '密码的长度在6~15个字符之间',
							trigger: 'blur'
						}
					],
					repassword: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							trigger: 'blur',
							validator: checkRepassword,
						}
					],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: checkMobile,
							trigger: 'blur'
						}
					]
				},
				EditRules:{
					// balance:[{
					// 		required: true,
					// 		message: '请输入金额',
					// 		trigger: 'blur'
					// 	},
					// 	{
					// 		trigger: 'blur',
					// 		validator: isNum,
					// 	}
					// ],
				     name: [{
				     		required: true,
				     		message: '请输入用户名',
				     		trigger: 'blur'
				     	},
				     	{
				     		min: 3,
				     		max: 10,
				     		message: '用户名的长度在3~10个字符之间',
				     		trigger: 'blur'
				     	}
				     ],
				     phone: [{
				     		required: true,
				     		message: '请输入手机号',
				     		trigger: 'blur'
				     	},
				     	{
				     		validator: checkMobile,
				     		trigger: 'blur'
				     	}
				     ]
				},
			}
		},
      
		methods: {
		
			sechClick(sechName) {
				
				if(sechName==null || sechName ==""){
					 this.tableData = this.allSech.data;
					 return;
				}

				if (sechName.length > 0) {
					var hasLength = 0;
					for (var i = 0; i < this.allSech.data.length; i++) {
						
						if(this.allSech.data[i].name == "" || this.allSech.data[i].name==null){
							 
							break;
						}
							
						else{
							if (this.allSech.data[i].name.search(sechName) != -1 ) {
								this.listSech[hasLength] = this.allSech.data[i];
								hasLength++;
							}
						}
						
					}
					this.tableData = this.listSech;
					this.listSech = [];
					this.sechName="";
				}
			},
		
		
			// 获取数据列表
			getUserList() {
				let params = {
					page: this.pagenum
				}
				userList(params).then(res => {
					console.log("hhh")
					console.log(res)
					if (res.code !== 200) {
						return this.$message.error('获取列表数据失败！')
					}
					this.userList = res.data.data
					this.total = parseInt(res.data.total)
				})
			},
            
			//初始化获取数据
			initData() {
				this.findAlldata();
			},

			//提交参数 添加数据接口
			Addsubmit(){
				this.$refs['addForm'].validate(valid => {
					if(valid) {
						let params = this.form;
						// console.log(params)
						userSave(params).then(res => {
							this.$message({
								message: res.msg,
								duration: 1000,
								type: 'success'
							});
							if(res.code == 200){
								this.dialogFormVisible = false;
								this.form = {}
								this.getUserList();
								// 添加成功后重新获取数据
								this.findAlldata();
							}
						})
					}
				})
			},
			// submit() {
			// 	this.$refs['form'].validate(valid => {
			// 		if(!valid) 
			// 			return
					
			// 		if (valid) {
			// 			let params = this.form;
			// 			if (params['status'] == true) {
			// 				params['status'] = 1;
			// 			} else {
			// 				params['status'] = 0;
			// 			}
			// 			userSave(params).then(res => {
			// 				//代表添加
			// 				this.$message({
			// 					message: res.msg,
			// 					duration: 1000,
			// 					type: 'success'
			// 				});
			// 				if (res.code == 200) {

			// 					this.form = []; //数据清空
			// 					this.dialogFormVisible = false;
			// 					this.findAlldata() //数据调用
			// 				}
			// 			})
			// 		}
			// 	});
			// },
			// 编辑接口
			Editsubmit() {
				this.$refs['EditFormRef'].validate(valid => {
					if (valid) {
						let params = this.editRuleForm;
						console.log(params)
						userSave(params).then(res => {
							console.log(res)
							this.$message({
								message: "修改成功",
								duration: 1000,
								type: 'success'
							});
							if (res.code == 200) {
								// console.log(121212)
								this.editDialogVisible = false;
								this.editRuleForm = {}
								this.getUserList();
								// 编辑成功后重新获取数据
								this.findAlldata();
							}
							this.EditFormVisible = false
							this.getUserList();
							this.findAlldata();
						}
						
						)
					}
				})
			},

			//原生写法
			demo() {
				for (var i = 0; i < this.checkList.length; i++) {
					this.checkList[i].checked = true;
				}
			},
			//利用ui
			selectAll(val) {
				console.log(val);
				for (var i = 0; i < val.length; i++) {
					console.log(val[i].id); //获取选择的ID
					this.delid.push(val[i].id); //所有ID放到data参数里面
				}
			},
			handleSelectionChange(val) {

			},
			handleChange(value) {
				console.log(value);
			},
			changeSwitch(value) {
				console.log(value);
			},
			//确认删除弹窗
			delDialog() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.delClick(); //全部删除
				})
			},

			//根据ID删除数据
			delClick(id = 0) {
				let params = '';
				if (id != 0) {
					params = {
						id: id
					}
				} else {
					params = {
						id: this.delid
					}
				}

				//接口封装 删除功能
				this.$confirm('此操作将永久删除一个或多个用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					userDel(params).then(res => {
						if (res.code == 200) {
							//代表添加
							this.$message({
								message: res.msg,
								duration: 1000,
								type: 'success'
							});
							this.delid = []; //给删除字段清空
							this.findAlldata(); //重新获取参数
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},


			//监听添加窗口关闭事件
			closeAddDialog() {						
				this.$refs.addForm.resetFields()
			},
			// 监听编辑窗口关闭事件
			closeEdit(){
				this.$refs.EditFormRef.resetFields()
			},
			// 添加窗口取消按钮
			AddcloseDialog(){
				this.dialogFormVisible = false
			},
			// 编辑窗口关闭
			closeEditDialog(){
				// this.editRuleForm = {}
				this.EditFormVisible = false;
				// this.getUserList();
			},
			//编辑
			editClick(params) {
				this.EditFormVisible = true; //打开弹窗
				// this.dailog_title = '编辑' //弹窗名称
				this.editRuleForm['id'] = params.id; //提交ID是编辑  没有提交ID是添加数据
				this.editRuleForm['name'] = params.name;
				this.editRuleForm['status'] = params.status;
				this.editRuleForm['phone'] = params.phone;
				this.editRuleForm['balance'] = params.balance;
				// this.editRuleForm = userInfo;
			},

			//分页
			Page(e) {
				console.log(e);
				this.pagenum = e; //得到页数
				this.findAlldata();
			},
			//查询
			findAlldata() {
				//统一接口
				let params = {
					page: this.pagenum
				};
				//接口封装
				userList(params).then(res => {
					for (var i = 0; i < res.data.data.length; i++) {
						res.data.data[i].status = parseInt(res.data.data[i].status); //数据从string转化成Int
					}
					console.log(res.data.data);
					this.allSech = res.data;
					this.tableData = res.data.data;
					this.total = res.data.totalPage;
				});
			}
		},
		created: function() {
			this.initData();
		}

	}
</script>
