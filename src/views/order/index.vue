<template>
	<div>
		<el-row>
			<el-input size="small" style="width:200px;" placeholder="搜索会员账号或者收货人" v-model="sechName"></el-input>


      <el-button type="primary" size="medium" style="margin-bottom: 20px;" icon="el-icon-search" @click="sechClick(sechName)">搜索</el-button>

 		</el-row>
		<el-table :data="tableData" style="width: 100%" border>
			<el-table-column prop="id" label="编号" width="80"></el-table-column>
			<el-table-column prop="order_no" label="订单号" width="200"></el-table-column>
			<el-table-column prop="order_amount" label="商品总额"></el-table-column>
			<el-table-column prop="user_name" label="会员账号"></el-table-column>
			<el-table-column prop="accept_name" label="收货人"></el-table-column>
			<el-table-column prop="phone" label="收货人电话" width="120"></el-table-column>
			<el-table-column prop="payment_text" label="支付方式"></el-table-column>
			<el-table-column prop="pay_status_text" label="支付状态"></el-table-column>
			<el-table-column prop="delivery_status_text" label="配送状态"></el-table-column>
			<el-table-column prop="status_text" label="订单状态"></el-table-column>

			<el-table-column fixed="right" label="操作" width="240">
				<template slot-scope="scope">
					<el-button type="success" size="small" @click="actClick(scope.row,1)" icon="el-icon-view">
					</el-button>
					<el-button type="success" size="small" @click="actClick(scope.row,2)" icon="el-icon-edit">
					</el-button>
					<el-button v-if="scope.row.delivery_status==0" type="danger" size="small"
						@click="invoClick(scope.row.id)" icon="el-icon-truck"></el-button>
					<el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">
					</el-button>
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="margin-top: 20px;">
			<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange"
				:current-page="currentPage" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
		<!--订单详情-->
		<el-dialog :title="actType==1?'查看':'编辑'" width="72%" top="10px" height="30vh" :visible.sync="dialogViewVisible">

			<h4>商品详情：</h4>
			<el-table :data="form.goods" style="width: 100%">
				<el-table-column label="货号" width="200">
					<template slot-scope="scope">
						<img :src="scope.row.img" width="50px" style="float: left;">
						<span style="float: left;height: 50px;line-height: 50px;">{{scope.row.pro_no}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="商品名" width="180">

				</el-table-column>
				<el-table-column prop="spec_text" label="规格">


				</el-table-column>
				<el-table-column prop="goods_price" label="价格">
				</el-table-column>
				<el-table-column prop="goods_nums" label="数量">
				</el-table-column>
				<el-table-column prop="address" label="优惠劵">
				</el-table-column>
				<el-table-column prop="real_price" label="小计">
				</el-table-column>
			</el-table>

			<h4>购买人信息：</h4>


			<el-row :gutter="24">
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">用户名：</label>
						<span>{{form.user_id}}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">姓名：</label>
						<span>{{form.accept_name}}</span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">手机：</label>
						<span>{{form.phone}}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">地址：</label>
						<span>{{form.addr}}</span>
					</div>
				</el-col>
			</el-row>
			<h4>订单信息：</h4>

			<el-row :gutter="24">
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">订单编号：</label>
						<span>{{form.order_no}}</span>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">下单时间：</label>
						<span>{{form.create_time}}</span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">配送方式：</label>
						<span>{{form.payment}}</span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">配送费用：</label>
						<span>{{form.pay}}</span>
					</div>
				</el-col>


				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">原订单总金额：</label>
						<span>{{form.order_amount}}</span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">调整后订单总金：</label>
						<span>{{form.real_amount}}</span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">发货信息：</label>
						<span>{{form.addr}}</span>
					</div>
				</el-col>
			</el-row>
			<h4>收货人信息：</h4>
			<el-row :gutter="24">
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">收货人姓名：</label>
						<!-- :title="actType==1?'查看':'编辑'" -->
						<!-- disabled="title=='编辑' ? 1 :0" -->
						<span><input type="text" v-model="form.accept_name"></span>
					</div>
				</el-col>

				<el-col :span="12">
					<div class="grid-content bg-purple">
						<label class="bg_red">联系手机：</label>
						<span><input type="text" v-model="form.phone"></span>
					</div>
				</el-col>




				<el-col :span="24">
					<div class="grid-content bg-purple">
						<label class="bg_red" style="flex: 0.5;">收货地区：</label>
						<span><input type="text" v-model="form.address"></span>
					</div>
				</el-col>

				<el-col :span="24">
					<div class="grid-content bg-purple">
						<label class="bg_red" style="flex: 0.5;">收货地址：</label>
						<span><input type="text" v-model="form.address"></span>
					</div>
				</el-col>



			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="actClose">关闭</el-button>
				<el-button type="primary" @click="actSave" v-if="actType==2">保存</el-button>

			</div>



		</el-dialog>



		<!--配送-->
		<el-dialog title="配送" width="50%" :visible.sync="invoiceFormVisible">
			<el-form :model="form" :rules="rules" ref="ruleForm">
				<el-form-item label="物流公司" :label-width="formLabelWidth">
					<el-select v-model="value" placeholder="请选择物流公司">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="物流订单号" :label-width="formLabelWidth">
					<el-input v-model="form.logid" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="发货地址" :label-width="formLabelWidth">
					<el-input v-model="form.addr" autocomplete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="invoiceFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="paysend">确 定</el-button>
			</div>
		</el-dialog>


	</div>
</template>
<style>
	.bg_red {
		background: #aaa9a5;
		color: #FFF;
		line-height: 35px;
		height: 35px;
		text-align: center;
		flex: 1.2;
	}

	.bg-purple {

		display: flex;
	}

	.bg-purple span {
		flex: 4;
		line-height: 35px;
		height: 35px;
		text-indent: 1em;
		border-bottom: 1px dashed #344056;
	}


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
		orderList,
		orderSave,
		orderDel,
		orderSend
	} from '../../comoon/api/order.js'; //调用外部JS文件
	export default {
		data() {
			return {
				sechName: "",
				listSech: [],
				allSech: [],

				search: {},
				paySelect: [{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '待付款'
					},
					{
						id: 2,
						name: '待发货'
					},
				],
				deliverySelect: [{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '未发货'
					},
					{
						id: 2,
						name: '已发货'
					},
				],
				options: [{
					value: '1',
					label: '顺丰'
				}, {
					value: '2',
					label: '圆通'
				}, ],
				actType: 1, //操作类型 1代表是查看，2代表编辑
				value: '1',
				currentPage: 1,
				total: 0,
				demo: false,
				dialogViewVisible: false, //订单详情弹窗
				dialogFormVisible: false,
				invoiceFormVisible: false, //配送状态
				form: {},
				formLabelWidth: '100px', //
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
			sechClick(sechName){
				   	 if(sechName.length==null){
				   	 		this.tableData=this.allSech.data;
				   			return;
				   	 }
				   	 if(sechName.length>0){
				   		 var hasLength=0;
				   		 for(var i=0;i<this.allSech.data.length;i++){
				   		 	if(this.allSech.data[i].user_name.search(sechName) != -1 || this.allSech.data[i].accept_name.search(sechName) != -1) {
				   		 		this.listSech[hasLength]=this.allSech.data[i];
				   		 		hasLength++;
				   		 	}
				   		 }
				   		 this.tableData=this.listSech;
				   		 this.listSech=[];
				   	 }
				   	  
				   	
				   },	 
			 
			//请求列表中加筛选字段
			initData() {
				let that = this;
				let params = {
					page: 1,
					search: this.search
				}
				let delivery_array = ['未发货', '已发货'];
				let pay_array = ['未支付', '已支付'];
				orderList(params).then(res => {
					if (res.code == 200) {
						let map = res.data.data;
						map.forEach(function(item, index) {
							map[index]['delivery_status_text'] = delivery_array[map[index][
								'delivery_status'
							]];
							map[index]['pay_status_text'] = pay_array[map[index]['pay_status']];
						})
						console.log(map);
						that.tableData = map;
						this.allSech = res.data;
						that.total = parseInt(res.data.total);
					}
					console.log(res);
				});
			},

			//添加窗口
			addClick() {
				this.dialogFormVisible = true;
			},
			//查看/编辑窗口
			actClick(res, type = 1) {
				this.actType = type;
				this.form = res;
				this.dialogViewVisible = true;
			},
			actSave() {
				//提交
				orderSave(this.form).then(res => {
					console.log(res);
				})

			},
			actClose() {
				this.dialogViewVisible = false;
				this.form = {};
			},
			//配送窗口
			invoClick(id) {
				this.form.id = id;
				this.invoiceFormVisible = true;
			},
			//配送发货
			paysend() {
				orderSend(this.form).then(res => {
					this.$message.success(res.msg);
					if (res.code == 200) {
						this.closeSend();
						this.initData();
					}
				});
			},
			//关闭配送
			closeSend() {
				this.invoiceFormVisible = false;
				this.form = {};
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
					orderDel({
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
						orderSave(this.form).then(res => {
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
			}

		},
		//初始化状态
		created: function() {
			this.initData();
		},
	}
</script>
