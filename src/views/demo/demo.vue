<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="24">
				<el-card shadow="never" class="card">
					<div id="charts_one" style="width:100%;min-height:80vh">

						<div class="btn-group" style="margin-bottom:11px;">
							<div>
								<el-button type="success" size="mini" icon="el-icon-plus" @click="add(ids)"
									 >添加</el-button>
								<el-button type="primary" :disabled="single" size="mini" icon="el-icon-edit"
									 >修改
								</el-button>
								<el-button type="danger" :disabled="multiple" size="mini" icon="el-icon-delete"
								 >删除</el-button>
								<el-button type="info" :disabled="single" size="mini" icon="el-icon-view"
								 >查看详情
								</el-button>
							</div>
							<table-tool :searchVisible.sync="searchVisible" :fieldList="fieldList" @refesh_list="index"
								:searchTool="true"></table-tool>
						</div>
						<el-table :row-class-name="rowClass" @selection-change="selection" @row-click="handleRowClick"
							row-key="goods_id" :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
							v-loading="loading" ref="multipleTable" border class="eltable" :data="list"
							style="width: 100%">
							<el-table-column align="center" type="selection" width="42"></el-table-column>
							<el-table-column align="center" type='' v-if="fieldList[0].checked" property="goods_id"
								label="编号" show-overflow-tooltip width="70">
							</el-table-column>
							<el-table-column align="left" v-if="fieldList[1].checked" property="goods_name" label="商品名称"
								show-overflow-tooltip width="">
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[2].checked" property="goodscata.class_name"
								label="分类名称" show-overflow-tooltip width="175">
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[3].checked"
								property="supplier.supplier_name" label="供应商名称" show-overflow-tooltip width="190">
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[4].checked" property="pic" label="封面图"
								show-overflow-tooltip width="80">
								<template slot-scope="scope">
									<div class="demo-image__preview">
										<el-image v-if="scope.row.pic" class="table_list_pic" :src="scope.row.pic"
											:preview-src-list="[scope.row.pic]"></el-image>
									</div>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[5].checked" property="sale_price"
								label="销售价" show-overflow-tooltip width="75">
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[6].checked" property="status" label="状态"
								show-overflow-tooltip width="80">
								<template slot-scope="scope">
									<el-switch @change="updateExt(scope.row,'status')" :active-value="1"
										:inactive-value="0" v-model="scope.row.status"></el-switch>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[7].checked" property="sortid" label="排序"
								show-overflow-tooltip width="80">
								<template class="sort" slot-scope="scope">
									<el-input @blur.stop="updateExt(scope.row,'sortid')" size="mini" placeholder="排序"
										v-model="scope.row.sortid"></el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="fieldList[8].checked" property="create_time"
								label="发布时间" show-overflow-tooltip width="100">
								<template slot-scope="scope">
									{{parseTime(scope.row.create_time,'{y}-{m}-{d}')}}
								</template>
							</el-table-column>
							<el-table-column :fixed="$store.getters.device !== 'mobile'?'right':false" label="操作"
								align="center" width="160">
								<template slot-scope="scope">
									<div v-if="scope.row.goods_id">
										<el-button size="mini" type="primary" @click="update(scope.row)"
											v-if="checkPermission('/admin/Goods/update.html')"><i
												class="el-icon-edit" />修改</el-button>
										<el-button size="mini" type="danger" @click="del(scope.row)"
											v-if="checkPermission('/admin/Goods/delete.html')"><i
												class="el-icon-delete" />删除</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>

					</div>
				</el-card>
			</el-col>
		</el-row>
		<!--添加-->
		<Add :show.sync="dialog.addDialogStatus" size="small" @refesh_list="index"></Add>

	</div>
</template>
<script>

	import Add from '@/views/spec/add.vue'

	export default {
		name: 'goods',
		components: {
			Add,
		},
		data() {
			return {
				dialog: {
					addDialogStatus: false,
					updateDialogStatus: false,
					detailDialogStatus: false,
				},
				fieldList: [{
						lable: '编号',
						checked: true
					},
					{
						lable: '商品名称',
						checked: true
					},
					{
						lable: '分类名称',
						checked: true
					},
					{
						lable: '供应商名称',
						checked: true
					},
					{
						lable: '封面图',
						checked: true
					},
					{
						lable: '销售价',
						checked: true
					},
					{
						lable: '状态',
						checked: true
					},
					{
						lable: '排序',
						checked: true
					},
					{
						lable: '发布时间',
						checked: true
					},
				],
				ids: [],
				single: true,
				multiple: true,
				list: [],
				updateInfo: {},
				detailInfo: {},
				loading: false,
				page_data: {
					limit: 20,
					page: 1,
					total: 20,
				},
				searchVisible: true,
				searchForm: [],
				searchData: {},
			}
		},
		methods: {
			index() {
				let param = {
					limit: this.page_data.limit,
					page: this.page_data.page
				}
				Object.assign(param, this.searchData)
				Object.assign(param, param2Obj(this.$route.fullPath))
				this.loading = true
				index(param).then(res => {
					this.list = res.data.data
					this.page_data.total = res.data.total
					this.loading = false
					if (this.page_data.page == 1) {
						this.searchForm = [{
								type: 'treeSelect',
								label: '所属分类',
								prop: 'class_id',
								data: res.sql_field_data.class_ids,
								width: '150px'
							},
							{
								type: 'Select',
								label: '供应商',
								prop: 'supplier_id',
								data: res.sql_field_data.supplier_ids,
								width: '150px'
							},
							{
								type: 'Select',
								label: '状态',
								prop: 'status',
								data: [{
									"key": "正常",
									"val": "1"
								}, {
									"key": "禁用",
									"val": "0"
								}],
								width: '150px'
							},
						]
					}
				})
			},
			updateExt(row, field) {
				if (row.goods_id) {
					updateExt({
						goods_id: row.goods_id,
						[field]: row[field]
					}).then(res => {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
					})
				}
			},
			add() {
				this.dialog.addDialogStatus = true
			},
			update(row) {
				let id = row.goods_id ? row.goods_id : this.ids.join(',')
				//接口封装
				getUpdateInfo({
					goods_id: id
				}).then(res => {
					if (res.status == 200) {
						this.dialog.updateDialogStatus = true
						this.updateInfo = res.data
					}
				})
			},
			del(row) {
				confirm({
					content: '确定要操作吗'
				}).then(() => {
					let ids = row.goods_id ? row.goods_id : this.ids.join(',')
					del({
						goods_id: ids
					}).then(res => {
						this.$message({
							message: res.msg,
							type: 'success'
						})
						this.index()
					})
				}).catch(() => {})
			},
			detail(row) {
				this.dialog.detailDialogStatus = true
				this.detailInfo = {
					goods_id: row.goods_id ? row.goods_id : this.ids.join(',')
				}
			},
			selection(selection) {
				this.ids = selection.map(item => item.goods_id)
				this.single = selection.length != 1
				this.multiple = !selection.length
			},
			handleRowClick(row, rowIndex, event) {
				if (event.target.className !== 'el-input__inner') {
					this.$refs.multipleTable.toggleRowSelection(row)
				}
			},
			rowClass({
				row,
				rowIndex
			}) {
				for (let i = 0; i < this.ids.length; i++) {
					if (row.goods_id === this.ids[i]) {
						return 'rowLight'
					}
				}
			},
		},
		mounted() {
			//this.index()
		}
	}
</script>
