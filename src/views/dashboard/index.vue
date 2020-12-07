<template>
  <el-card>
    <div slot="header" class="card-header">
      <el-button
        type="primary"
        size="small"
        @click="dialogTableVisible = true"
      >Add</el-button>
    </div>
    <el-table :data="tableData" border height="800px">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="borough" label="Borough" />
      <el-table-column prop="cuisine" label="Cuisine" />
      <el-table-column prop="photo" label="Photo" />
      <el-table-column label="Score">
        <template slot-scope="{ row }">
          <el-rate
            v-model="row.grades"
            :max="10"
            disabled
            show-score
            text-color="#ff9900"
          />
        </template>
      </el-table-column>
      <el-table-column label="operate" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="add ? 'cerate' : 'edit'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      @close="handleClose"
    >
      <el-form ref="dynamicValidateForm" :model="form" label-width="100px">
        <el-form-item
          label="Name:"
          prop="name"
          :rules="[{ required: true, message: 'required', trigger: 'blur' }]"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Borough:">
          <el-input v-model="form.borough" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Cuisine:">
          <el-input v-model="form.cuisine" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Building:">
          <el-input v-model="form.building" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Zipcode:">
          <el-input v-model="form.zipcode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Photo:">
          <el-upload
            action="String"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :http-request="httpRequest"
          >
            <img v-if="imageUrl" width="400" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitForm">ok</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getInfo } from '@/api/user'
export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      add: true,
      imageUrl: '',
      form: {
        name: '',
        borough: '',
        cuisine: '',
        photo: '',
        zipcode: '',
        building: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    submitForm() {
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs['dynamicValidateForm'].resetFields()
    },
    httpRequest(a) {
      return new Promise((resolve, reject) => {
        resolve(a)
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('Upload pictures can only be in JPG format')
      }
      if (!isLt2M) {
        this.$message.error('Picture size cannot exceed 2 MB')
      }
      return isJPG && isLt2M
    },
    getData() {
      getInfo().then((res) => {
        if (res.status == 'ok') {
          this.tableData = res.data
        }
      })
    },
    handleEdit(row) {
      const copy = Object.assign({}, row)
      this.form = copy
      this.dialogTableVisible = true
    },
    handleDelete() {}
  }
}
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
