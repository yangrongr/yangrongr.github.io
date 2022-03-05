<template>
	<div>
		 
		<el-button type="text" @click="outerVisible = true">模拟聊天</el-button>

		<el-dialog title="在线聊天" :visible.sync="outerVisible">
			<div>
				 
				<PullRefresh v-model="isLoading" class="pull-s" :pulling-text="pullText" :loosing-text="loosText"
					@refresh="onRefresh">
					<div id="chat_content" class="chat-content" @click="() => {showMore = false}">
						<!-- recordContent 聊天记录数组-->
						<div v-for="(itemc, indexc) in recordContent" :key="indexc">
							<!-- 对方 -->
							<div v-if="itemc.MsgType === '2'" class="word">
								<img :src="itemc.headUrl">
								<div class="info">
									<p class="time">{{ itemc.nickName }} </p>
									<div v-if="itemc.contentType === '1'" class="info-content p-10">
										{{ itemc.contactText }}</div>
									<div v-if="itemc.contentType === '2'" class="info-content p-10">
										<VanImage width="100" height="100" :src="itemc.contactImage"
											@click="imageClick" />
									</div>
									<div v-if="itemc.contentType === '3'" class="info-content">
										<div class="w-200">
											<div class="d-guess">猜你想问</div>
											<Cell v-for="(itemq, indexq) in itemc.contactList" :key="indexq" border
												:value="itemq.content" :is-link="true" />
											<Cell border :center="true">
												<div class="d-more">更多问题</div>
											</Cell>
										</div>
									</div>
								</div>
							</div>
							<!-- 我的 -->
							<div v-if="itemc.MsgType === '1'" class="word-my">
								<div class="info">
									<p class="time">{{ itemc.nickName }} </p>
									<div v-if="itemc.contentType === '1'" class="info-content p-10">
										{{ itemc.contactText }}</div>
									<div v-if="itemc.contentType === '2'" class="info-content p-10">
										<VanImage width="100" height="100" fit="contain" :src="itemc.contactImage"
											@click="imageClick" />
									</div>
									<div v-if="itemc.contentType === '3'" class="info-content">{{ itemc.contactText }}
									</div>
								</div>
								<img :src="itemc.headUrl">
							</div>
							<!--时间戳-->
							<div v-if="itemc.MsgType === '3'" class="d-stamp">
								<span v-if="itemc.lastPartTimeStamp !== ''" class="s-stamp">
									{{ itemc.lastPartTimeStamp }}
								</span>
								<span v-else class="s-close">
									您很长时间没说话，会话已结束
								</span>
							</div>
						</div>
					</div>
				</PullRefresh>
				<Search v-model="searchWords" show-action left-icon="" shape="square" background="#E2E3E5"
					placeholder="请输入" @search="onSearch">
					<div slot="action" class="d-add" @click="() => {showMore = !showMore}">
						<Icon name="add-o" size="20" />
					</div>
				</Search>
				<div v-show="showMore" class="d-showMore">
					<div v-for="(conL, indexL) in iconList" :key="indexL" class="d-more-container">
						<Uploader>
							<div class="upload-div">
								<div class="d-more-box">
									<Icon :name="conL.icon" size="20" />
								</div>
								<span class="s-more-name">{{ conL.name }}</span>
							</div>
						</Uploader>
					</div>
				
					<div class="d-grow"/>
				</div>
			</div>
		</el-dialog>
	
		
		<iframe v-if="peoplname" src="http://localhost:8081/#/imServer" id="mobsf" scrolling="yes" frameborder="0" height="500px"></iframe>
		<iframe v-if="!peoplname" src="http://localhost:8081/#/imclient" id="mobsf" scrolling="no" frameborder="0" style="position:absolute;top:64px;left: 400px;right:0px;bottom:100px;"></iframe>
		
		 
	
	</div>
</template>

<script>
	import {
		PullRefresh,
		Search,
		NavBar,
		Image as VanImage,
		ImagePreview,
		Cell,
		Icon,
		Uploader
	} from 'vant'
	export default {
		components: {
			PullRefresh,
			Search,
			NavBar,
			VanImage,
			Cell,
			Icon,
			Uploader
		},
		data() {
			return {
				peoplname:true,
				 
				
				outerVisible: true,
				innerVisible: false,


				isLoading: false,
				pullText: '下拉查看历史记录',
				loosText: '加载历史会话',
				leftArrow: false,
				showMore: false,
				searchWords: '',
				iconList: [{
						icon: 'photo',
						name: '发送图片'
					},
					{
						icon: 'printer',
						name: '发送文件'
					},
					{
						icon: 'more',
						name: '留言'
					}
				],
				recordContent: [{
						MsgType: '1',  
						headUrl: 'https://img0.baidu.com/it/u=1548644059,481321664&fm=15&fmt=auto',  
						nickName: '我',  
						timestamp: '2020-11-19 12:12:12', 
						contentType: '1',  
						contactText: '这件商品有满减吗？',
						contactImage: '', // 图片地址
						contactList: [], // 提供选项列表
						lastPartTimeStamp: '' // 上一次会话时间戳
					},
					{
						MsgType: '2',
						headUrl: 'https://img1.baidu.com/it/u=1181423937,1755942631&fm=15&fmt=auto',
						nickName: '小米客服',
						timestamp: '2020-11-19 12:13:14',
						contentType: '1',
						contactText: '抱歉，这件商品没有。',
						contactImage: '',
						contactList: [],
						lastPartTimeStamp: ''
					},
					{ // 结束会话
						MsgType: '3',
						headUrl: '',
						nickName: '',
						timestamp: '',
						contentType: '',
						contactText: '',
						contactImage: '',
						contactList: [],
						lastPartTimeStamp: ''
					}
				],
				historyContent: [{
						MsgType: '1',
						headUrl: 'https://img0.baidu.com/it/u=1548644059,481321664&fm=15&fmt=auto',
						nickName: '我',
						timestamp: '2020-11-18 08:12:12',
						contentType: '1',
						contactText: '故人西辞黄鹤楼',
						contactImage: '',
						contactList: [],
						lastPartTimeStamp: ''
					},
					{
						MsgType: '2',
						headUrl: 'https://img1.baidu.com/it/u=1181423937,1755942631&fm=15&fmt=auto',
						nickName: '小米客服',
						timestamp: '2020-11-18 09:13:14',
						contentType: '3',
						contactText: '烟花三月下扬州',
						contactImage: '',
						contactList: [{
								content: '你想问这个吗',
								id: '1'
							},
							{
								content: '你想问那个吗',
								id: '2'
							},
							{
								content: '你到底想问什么呀',
								id: '3'
							}
						],
						lastPartTimeStamp: '20/11/20 14:19:58'
					},
					{ // 上一次会话时间戳 看lastPartTimeStamp是否为空
						MsgType: '3',
						headUrl: '',
						nickName: '',
						timestamp: '',
						contentType: '',
						contactText: '',
						contactImage: '',
						contactList: [],
						lastPartTimeStamp: '20/11/20 14:19:58'
					}
				],
				sessionInput: {}
			}
		},
		mounted(){
					
		            /**
		            * iframe-宽高自适应显示   
		            */
		            function changeMobsfIframe(){
		                const mobsf = document.getElementById('mobsf');
		                const deviceWidth = document.body.clientWidth+300;
		                const deviceHeight = document.body.clientHeight+300;
		                mobsf.style.width = (Number(deviceWidth)-600) + 'px'; //数字是页面布局宽度差值
		                mobsf.style.height = (Number(deviceHeight)-700) + 'px'; //数字是页面布局高度差
		            }
		
		            changeMobsfIframe()
		
		            window.onresize = function(){
		                changeMobsfIframe()
		            }
		        },
		created() {
			this.loadComments()
		},
		
		methods: {
			
			loadComments() {
			      var testName = this.$cookie.get('name');
				  if(testName!="admin"){
					this.peoplname =false;
				  }
				  console.log(this.peoplname)
			    },
			onRefresh() {
				 
				setTimeout(() => {
					this.isLoading = false
					let len = this.historyContent.length
					for (let i = len - 1; i >= 0; i--) {
						this.recordContent.unshift(this.historyContent[i])
					}
				}, 1000)
			},
			helloworld() {
				console.log('11')
			},
			onSearch(value) {
				if (value !== '') {
					this.sessionInput = {
						MsgType: '1',
						headUrl: 'https://img0.baidu.com/it/u=1548644059,481321664&fm=15&fmt=auto',
						nickName: '我',
						timestamp: this.getCurrentTimeStamp(),
						contentType: '1',
						contactText: value,
						contactList: [],
						lastPartTimeStamp: ''
					}
					this.searchWords = ''
					this.recordContent.push(this.sessionInput)
					this.sessionInput = {}
					this.scrollToBottom()
				}
			},
			getCurrentTimeStamp() {
				let myDate = new Date()
				let month = myDate.getMonth() + 1
				let day = myDate.getDate()
				let hour = myDate.getHours()
				let minute = myDate.getMinutes()
				let second = myDate.getSeconds()
				month = month.toString().length === 1 ? '0' + month : month
				day = day.toString().length === 1 ? '0' + day : day
				hour = hour.toString().length === 1 ? '0' + hour : hour
				minute = minute.toString().length === 1 ? '0' + minute : minute
				second = second.toString().length === 1 ? '0' + second : second
				let result =
					myDate.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
				return result
			},
			scrollToBottom() {
				this.$nextTick(() => {
					let container = this.$el.querySelector('#chat_content')
					container.scrollTop = container.scrollHeight
				})
			},
			imageClick(e) {
				console.log(e)
				let imgArr = []
				imgArr.push(e.target.currentSrc)
				ImagePreview(imgArr)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.container-box {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.chat-content {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding: 20px;

		.word {
			display: flex;
			margin-bottom: 20px;

			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			.info {
				margin-left: 10px;

				.time {
					font-size: 12px;
					color: rgba(51, 51, 51, 0.8);
					margin: 0;
					height: 20px;
					line-height: 20px;
					margin-top: -5px;
				}

				.info-content {
					// padding: 10px;
					font-size: 14px;
					// background: rgb(66, 171, 219);
					border: 1px solid lightgray;
					border-radius: 5px;
					position: relative;
					margin-top: 8px;
					color: #333333;
				}

				 
			}
		}

		.word-my {
			display: flex;
			justify-content: flex-end;
			margin-bottom: 20px;

			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			.info {
				// margin-left: 10px;
				text-align: right;

				.time {
					font-size: 12px;
					color: rgba(51, 51, 51, 0.8);
					margin: 0;
					height: 20px;
					line-height: 20px;
					margin-top: -5px;
					margin-right: 10px;
				}

				.info-content {
					max-width: 90%;
					// padding: 10px;
					font-size: 14px;
					float: right;
					margin-right: 10px;
					position: relative;
					margin-top: 8px;
					background: #E6F0FB;
					text-align: left;
					color: #5D6878;
					border: 1px solid lightgray;
					border-radius: 5px;
				}

				 
			}
		}
	}

	.van-cell-group__title {
		padding: 8px 8px 4px;
		color: black;
	}

	.van-cell {
		padding: 5px 8px;
	}

	.upload-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.nav-color {
		background-color: #F7F8FA
	}

	.pull-s {
		flex-grow: 1;
		margin-top: 46px;
	}

	.p-10 {
		padding: 10px;
	}

	.w-200 {
		width: 180px;
	}

	.d-guess {
		text-align: left;
		padding: 8px 8px;
		background-color: #F6F6F9;
	}

	.d-more {
		text-align: center;
		color: #4DA9FF;
	}

	.d-stamp {
		text-align: center;
		margin-bottom: 10px;
	}

	.s-stamp {
		background-color: #E2E3E5;
		padding: 4px 20px;
		font-size: 10px;
		border-radius: 4px;
		color: #fff;
	}

	.s-close {
		background-color: #E2E3E5;
		padding: 4px 20px;
		font-size: 10px;
		border-radius: 4px;
		color: #fff;
	}

	.d-add {
		display: flex;
		flex-direction: column;
	}

	.d-showMore {
		height: 60px;
		background-color: #E2E3E5;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding-left: 10px;
	}

	.d-more-container {
		width: 60px;
		height: 100%;
		margin-right: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.d-more-box {
		width: 40px;
		height: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F7F8FA;
		margin-bottom: 5px;
	}

	.s-more-name {
		font-size: 9px;
		margin-bottom: 5px;
		color: #333333;
	}

	.d-grow {
		flex-grow: 1;
	}
</style>
