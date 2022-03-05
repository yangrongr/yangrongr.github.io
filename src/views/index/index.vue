<template>
	<div>
		
			<el-card class="box-card" float:>
				<div v-for="o in 1" :key="o" class="text item"  >
					 
					<div id="myChart" :style="{width: '300px', height: '200px' }"></div>
					<div id="my" :style="{width: '300px', height: '200px'   }"></div>
					 
				</div>
				 
			</el-card>
		
		
		<el-card class="box-card">
			<div v-for="o in 1" :key="o" class="text item">
				<el-card class="box-card">
					<div id="myChartZ" :style="{width: '500px', height: '400px'}"></div>
				</el-card>
			</div>
		</el-card>

	</div>
</template>
<script>
	export default {
		name: 'hello',
		data() {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		},
		mounted() {
			this.drawLine();
			this.drawLineM();
			this.drawLineZ();
		},
		methods: {
			drawLine() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'))
				// 绘制图表
				myChart.setOption({
					title: {
						text: '物流使用统计',
						subtext: '动态数据',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						show: true,
						orient: 'vertical',
						left: 'left',
						data: ['京东物流', '百事物流', '顺丰物流', '菜鸟物流', '搜索访问']
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: [{
								value: 335,
								name: '京东物流'
							},
							{
								value: 310,
								name: '百事物流'
							},
							{
								value: 234,
								name: '顺丰物流'
							},
							{
								value: 135,
								name: '菜鸟物流'
							},
							{
								value: 1548,
								name: '搜索访问'
							}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				});
			},


			drawLineM() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('my'))
				// 绘制图表
				myChart.setOption({
					title: {
						text: '订单统计'
					},
					tooltip: {},
					xAxis: {
						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				});
			},
		
			drawLineZ() {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChartZ'))
				// 绘制图表
				myChart.setOption( 
					{
					                    title: {
					                        text: '销售统计',
					                        subtext: ''
					                    },
					                    tooltip: {
					                        trigger: 'axis'
					                    },
					                    legend: {
					                        data:['最高','最低']
					                    },
					                    toolbox: {
					                        show: true,
					                        feature: {
					                            dataZoom: {
					                                yAxisIndex: 'none'
					                            },
					                            dataView: {readOnly: false},
					                            magicType: {type: ['line', 'bar']},
					                            restore: {},
					                            saveAsImage: {}
					                        }
					                    },
					                    xAxis:  {
					                        type: 'category',
					                        boundaryGap: false,
					                        data: ['2019-02-25','2019-03-04','2019-03-18','2019-03-26','2019-04-16','2019-04-26','2019-05-04']
					                    },
					                    yAxis: {
					                        type: 'value',
					                        axisLabel: {
					                            formatter: '{value}'
					                        }
					                    },
					                    series: [
					                        {
					                            name:'最高',
					                            type:'line',
					                            data:[11, 11, 15, 13, 12, 13, 10],
					                            markPoint: {
					                                data: [
					                                    {type: 'max', name: '最大值'},
					                                    {type: 'min', name: '最小值'}
					                                ]
					                            },
					                            markLine: {
					                                data: [
					                                    {type: 'average', name: '平均值'}
					                                ]
					                            }
					                        },
					                        {
					                            name:'最低',
					                            type:'line',
					                            data:[1, -2, 2, 5, 3, 2, 0],
					                            markPoint: {
					                                data: [
					                                    {name: '周最低', value: 2, xAxis: 1, yAxis: 1.5}
					                                ]
					                            },
					                            markLine: {
					                                data: [
					                                    {type: 'average', name: '平均值'},
					                                    [{
					                                        symbol: 'none',
					                                        x: '90%',
					                                        yAxis: 'max'
					                                    }, {
					                                        symbol: 'circle',
					                                        label: {
					                                            normal: {
					                                                position: 'start',
					                                                formatter: '最大值'
					                                            }
					                                        },
					                                        type: 'max',
					                                        name: '最高点'
					                                    }]
					                                ]
					                            }
					                        }
					]
				});
			},
			
		}
	}
</script>
