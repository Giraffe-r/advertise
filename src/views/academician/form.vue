<template>
  <div class="app-container">
    <el-form ref="academician" :model="academician" :rules="validateRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">

          <el-form-item label="院士名" prop="name">
            <el-input v-model="academician.name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="院士类型" prop="type">
            <el-select v-model="academician.type" placeholder="请选择">
              <el-option key="中国工程院院士" label="中国工程院院士" :value="1">
              </el-option>
              <el-option key="中国科学院院士" label="中国科学院院士" :value="2">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="评选日期" prop="selectionDate">
            <el-date-picker v-model="academician.selectionDate" value-format="yyyy-MM-dd" placeholder="评选日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学部" prop="research">
            <el-select v-model="academician.research" placeholder="学部">
              <el-option v-for="item in researchPart" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="请输入简介" prop="description">
        <el-input type="textarea" :rows="15" placeholder="请输入简介" v-model="academician.description" style="width: 100%;">
        </el-input>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="上传图片" prop="imgSrc">
            <!-- <el-upload class="avatar-uploader" :action="env + '/template/academician/upload'" :show-file-list="false" -->
            <el-upload class="avatar-uploader" :action="BASE_API+'/template/academician/uploadImg'"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="academician.imgSrc" :src="BASE_API+'/img/' + academician.imgSrc + '.jpg'"
                class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上传视频" prop="videoSrc">
            <el-upload class="upload-demo" :action="BASE_API+'/template/academician/uploadVideo'"
              :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1"
              :on-exceed="handleExceed" :file-list="fileList" :on-success="handleVideoSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="外墙是否存在" prop="isOuter">
            <el-select v-model="academician.isOuter" placeholder="请选择">
              <!-- <el-option key="永不上墙" label="永不上墙" :value="-1">
              </el-option> -->
              <el-option key="是" label="是" :value="1">
              </el-option>
              <el-option key="否" label="否" :value="0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否上墙" prop="onWall">
            <el-select v-model="academician.onWall" placeholder="请选择">
              <!-- <el-option key="永不上墙" label="永不上墙" :value="-1">
              </el-option> -->
              <el-option key="是" label="是" :value="1">
              </el-option>
              <el-option key="否" label="否" :value="0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="padding-top: 0%; text-align: center;">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>

// import userApi from '@/api/acl/user'

const defaultForm = {
  name: '',
  type: '',
  selectionDate: '',
  research: '',
  description: '',
  imgSrc: '',
  videoSrc: '',
  osWall: '',
}

const validatePass = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码不能小于6位'))
  } else {
    callback()
  }
}
import researchPartApi from '@/api/researchPart/researchPart'
import academicianApi from '@/api/academician/academician'

export default {
  data() {
    return {
      BASE_API: null,
      academician: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      validateRules: {
        name: [{ required: true, trigger: 'blur', message: '院士名必须输入' }],
        type: [{ required: true, trigger: 'blur', message: '院士类型必须选择' }],
        selectionDate: [{ required: true, trigger: 'blur', message: '评选日期必须选择' }],
        research: [{ required: true, trigger: 'blur', message: '学部必须选择' }],
        description: [{ required: true, trigger: 'blur', message: '简介必须输入' }],
        imgSrc: [{ required: true, trigger: 'blur', message: '图片必须上传' }],
        videoSrc: [{ required: true, trigger: 'blur', message: '视频必须上传' }],
        onWall: [{ required: true, trigger: 'blur', message: '是否上墙必须选择' }],
      },
      researchPart: {},//研究部门
      env: null,
      fileList: []
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      console.log('路由变化......')
      console.log(to)
      console.log(from)
      this.init()
    }
  },

  // 生命周期方法（在路由切换，组件不变的情况下不会被调用）
  created() {
    this.BASE_API = process.env.BASE_API
    // console.log(process.env.BASE_API)
    console.log('form created ......')
    this.init()
  },

  methods: {

    // 表单初始化
    init() {
      // debugger
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        console.log(id)
        this.fetchDataById(id)
      } else {
        // 对象拓展运算符：拷贝对象，而不是赋值对象的引用
        this.academician = { ...defaultForm }
      }

      //获取研究部门
      researchPartApi.getList().then(response => {
        this.researchPart = response.data.list;
        console.log(this.researchPart)
      })
    },

    saveOrUpdate() {
      this.$refs.academician.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.academician.id) {
            this.saveData()
          } else {
            this.updateData()
          }
        }
      })
    },

    // 新增院士
    saveData() {
      console.log(this.academician)
      academicianApi.save(this.academician).then(response => {
        // debugger
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.$router.push({ path: '/academician/list' })
        }
      })
    },

    // 根据id更新记录
    updateData() {
      // teacher数据的获取
      academicianApi.updateById(this.academician).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.$router.push({ path: '/academician/list' })
        }
      })
    },

    // 根据id查询记录
    fetchDataById(id) {
      academicianApi.getById(id).then(response => {
        console.log(response)
        this.academician = response.data.academician
      })
    },
    handleAvatarSuccess(res, file) {
      // console.log(res)
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.academician.imgSrc = "new/" + res
    },
    beforeAvatarUpload(file) {
      // console.log(file.type)
      const isJPG = file.type === 'image/jpeg';
      const isLt1000M = file.size / 1024 / 1024 < 1000;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt1000M) {
        this.$message.error('上传头像图片大小不能超过 1000MB!');
      }
      return isJPG && isLt1000M;
    },

    handleVideoSuccess(res, file) {
      this.academician.videoSrc = "new/" + res
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }

}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>