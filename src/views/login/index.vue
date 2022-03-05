<template>
	<!-- class="bg" :style="{'background-image':'url('+bg+')'}" -->
	<!-- class="login_container" -->
	<!-- <div class="bg" :style="{'background-image':'url('+bg+')'}" > -->
	<div class="login_container">
		<!-- 粒子背景 -->

		<vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4"
			linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
			:hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi" style="height:100%">
		</vue-particles>

		<div class="FontSet">
			<span>
				商城管理系统
			</span>
		</div>

		<div class="login_main">
			<!-- 	<div class="avatar_box">
			<img class="img1" src="../../../static/mi.jpg" alt=" " />
		</div>
		 -->
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
				class="demo-ruleForm">
				<!-- <el-form-item>
          <span >管理系统</span>
        </el-form-item> -->


				<el-form-item label="" prop="name" style="padding-top: 20px;">
					<el-input prefix-icon="el-icon-user-solid" placeholder="用户名 (admin)" v-model="ruleForm.name"
						autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="" prop="pass">
					<el-input type="password" prefix-icon="el-icon-s-check" placeholder="密码(123456)" v-model="ruleForm.pass"
						autocomplete="off"></el-input>
				</el-form-item>


				<el-form-item label="" prop="code">
					<el-row :span="24">
						<el-col :span="12">
							<el-input auto-complete="off" placeholder="请输入验证码" v-model="ruleForm.code"></el-input>
						</el-col>
						<el-col :span="12">
							<div>
								<s-identify :identifyCode="identifyCode"></s-identify>
							</div>
						</el-col>
					</el-row>
				</el-form-item>

				<el-form-item label="" style="margin-bottom: 0px;">
					<el-checkbox v-model="ruleForm.checkd">记录密码1天</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')" class="bt_login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<style>
	
	/* 商城字体设置 */
	.FontSet {
		position: absolute;
		font-size: 3.4375rem;
		margin-left: 37.5rem;
		margin-top: 5.375rem;
		/* margin-bottom: 1.25rem; */
		color: #2F4050;
		/* margin: 250px auto; */
	}

	.avatar_box {
		margin-bottom: 80px;
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
	}

	.img1 {
		height: 80%;
		width: 80%;
		border-radius: 50%;
		background-color: #eee;
	}

	/* #979eff */
	.login_container {
		background-image: linear-gradient(-180deg, #ffffff 0%, #4e3fa5 100%);
		/* background-image: linear-gradient(-180deg, #1a1454 0%, #0e81a5 100%); */
		/*background-image: url("../images/bg_login.png");*/
		/*  background-repeat: no-repeat;
  background-size: 100%;
  min-height: 100vh;
  display: flex; */

		background-repeat: no-repeat;
		background-size: cover;
		height: 100%;
		width: 100%;
		position: absolute;
	}

	#particles-js {
		width: 100%;
		height: calc(100% - 100px);
		position: absolute;
	}

	.login_main {
		border-radius: 3px;
		/* transform: translate(50%,50%); */
		padding: 20px;
		background: #fff;
		box-shadow: 0 3px 6px -1px rgb(0 0 0 / 19%);
		box-sizing: border-box;
		width: 400px;
		height: 320px;
		margin: 250px auto;
		/* position: relative; */
	}

	.bt_login {
		width: 100%;
	}

	.login_main .el-form-item__content {
		margin-left: 0px !important;
	}
</style>
<script>
	import {
		login
	} from '../../comoon/api/admin.js'
	import SIdentify from './sidentify'
	export default {
		components: {
			SIdentify
		},
		data() {
			const validateCode = (rule, value, callback) => {
				if (this.identifyCode !== value) {
					this.loginForm.code = ''
					this.refreshCode()
					callback(new Error('请输入正确的验证码'))
				} else {
					callback()
				}
			}
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			return {
				bgdata: [
					'../../static/bg/1.jpg',
					'../../static/bg/2.png',
					'../../static/bg/3.jpg',
				],
				bg: '',
				isDebugLogin: false,

				ruleForm: {
					code: '',
					name: '',
					pass: '',

					checkd: false,
				},
				identifyCodes: '1234567890',
				identifyCode: '',
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					name: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: 'blur'
						}

					],
				}
			};
		},
		watch: {
			isDebugLogin(v) {
				if (v) {
					this.loginForm.password = '123'
					this.refreshCode()
				}
			},
			identifyCode(v) {
				this.isDebugLogin && (this.loginForm.code = v)
			}
		},
		methods: {
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min)
			},
			refreshCode() {
				this.identifyCode = ''
				this.makeCode(this.identifyCodes, 4)
			},

			makeCode(o, l) {
				for (let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					]
				}
			},
			showPassword() {
				this.passwordType === '' ?
					(this.passwordType = 'password') :
					(this.passwordType = '')
			},
			submitForm(formName) {
				console.log(this.ruleForm.code, this.identifyCode);
				if (this.ruleForm.code === this.identifyCode) {
					console.log("ok");
					//验证
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.subLogin(); //调用登录方法
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				} else {
					alert("用户/密码	/验证码错误");
				}


			},
			//登录
			subLogin() {


				let that = this;
				//请求登录接口
				let params = {
					name: this.ruleForm['name'],
					password: this.ruleForm['pass']
				}


				//登录接口
				login(params).then(function(response) {
					if (response.code == 200) {
						that.$message({
							type: 'success',
							message: '登录成功'
						})

						//保存记录
						//判定是否记录密码
						if (that.ruleForm.checkd == true) {
							var time = 3600;
						} else {
							var time = 360;
						}
						that.$cookie.set('uid', response.data.uid, time); //登录获取UID状态
						that.$cookie.set('token', response.data.token, time); //登录后生成token
						//localStorage.setItem('token',response.data.token);
						that.$cookie.set('name', response.data.manager, time); //登录时间一小时
						localStorage.setItem('menuList', '');
						that.$router.push({
							path: '/index'
						}); //跳转到框架首页

					} else {
						that.$message.error(response.msg);
					}
				});
				return;

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		},
		mounted: function() {
			console.log(Math.floor(Math.random() * 3));
			this.bg = this.bgdata[Math.floor(Math.random() * 3)];
		},
		created() {
			this.refreshCode()
		}
	}
</script>
