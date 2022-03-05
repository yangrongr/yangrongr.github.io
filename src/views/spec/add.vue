<template>
  <div>
    <el-dialog title="添加" width="800px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm"
      append-to-body>

      <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="备注" class="activeItem">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item prop="jzd" label="规格">

              <draggable v-model="form.jzd" v-bind="{group:'item'}" handle=".jzd-handle">
                <el-row v-for="(item,i) in form.jzd" :key="i">
                  <el-col :span="10">
                    <el-form-item class="activeItem">
                      <el-input v-model="item.key" placeholder="选项名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item class="activeItem">
                      <el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">


                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <el-button type="info" size="mini" style="position:relative;left:15px" icon="el-icon-upload">
                      </el-button>
                    </el-upload>

                    <el-button type="danger" size="mini" style="position:relative;left:15px" icon="el-icon-close"
                      @click="deleteItem('jzd',i)"></el-button>

                  </el-col>
                </el-row>
              </draggable>
              <div>
                <el-button type="info" icon="el-icon-plus" style="padding:5px 7px" size="mini" @click="addItem('jzd')">
                  追加</el-button>
                <el-button v-if="form.jzd.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px"
                  size="mini" @click="clearItem('jzd')">清空</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" :loading="loading" type="primary" @click="submit">
          <span v-if="!loading">确 定</span>
          <span v-else>提 交 中...</span>
        </el-button>
        <el-button :size="size" @click="closeForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import draggable from "vuedraggable"
  export default {
    name: 'otheradd',
    components: {
      draggable,
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      },
    },
    data() {
      return {
        imageUrl: '',
        labelWidth: '50px',
        form: {
          jzd: [{}],
        },
        rules: {},
        loading: false,
      };
    },
    methods: {
      open() {

      },
      submit() {
        console.log(this.form);
        return;
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        //this.loading = false;
        this.$emit('refesh_list')
        this.closeForm()
        /*this.$refs['form'].validate(valid => {
          if (valid) {
            this.loading = true
            this.$emit('refesh_list')
          }
        })*/
      },


      handleAvatarSuccess(res, file) {
        //this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },


      addItem(key) {
        this.form[key].push({})
      },
      deleteItem(key, index) {
        this.form[key].splice(index, 1)
      },
      clearItem(key) {
        this.form[key] = []
      },
      closeForm() {
        this.$emit('update:show', false)
        this.loading = false
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields()
        }
        this.form.hk = 0
        this.form.jzd = [{}]
      }
    }
  };
</script>
