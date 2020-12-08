<template>
  <el-card>
    <div slot="header" class="card-header">
      <el-button type="primary" size="small" @click="handleAdd">Add</el-button>
    </div>
    <el-table :data="tableData" border height="800px">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="borough" label="Borough" />
      <el-table-column prop="cuisine" label="Cuisine" />
      <el-table-column prop="photo" label="Photo">
        <template slot-scope="{ row }">
          <el-image
            style="height: 30px"
            :src="row.photo"
            fit="contain"
            v-if="row.photo != ''"
            :preview-src-list="[row.photo]"
          ></el-image>
          <div style="height: 30px" v-else>-</div>
        </template>
      </el-table-column>
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
      <el-table-column label="operate" width="260">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            :disabled="scope.row.user_id != userId"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.user_id != userId"
            @click="handleDelete(scope.row)"
            >Delete</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.play"
            @click="handleScore(scope.row)"
            >Score</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="type == 1 ? (add ? 'cerate' : 'edit') : 'scoring'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      @close="handleClose"
    >
      <el-form
        ref="dynamicValidateForm"
        :model="form"
        v-if="type == 1"
        label-width="100px"
      >
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
            <img
              v-if="form.photo"
              width="400"
              :src="form.photo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <el-rate
        v-model="score"
        show-score
        text-color="#ff9900"
        score-template="{value}"
        v-else
        :max="10"
      >
      </el-rate>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">cancel</el-button>
        <el-button type="primary" @click="submitForm">ok</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getInfo, add, upd, del, addScore, getScore } from "@/api/user";
import { getUserId } from "@/utils/auth";
export default {
  name: "Dashboard",
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      add: true,
      userId: getUserId(),
      type: 1,
      score: 0,
      form: {
        name: "",
        borough: "",
        cuisine: "",
        photo: "",
        zipcode: "",
        building: "",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleAdd() {
      this.type = 1;
      this.dialogTableVisible = true;
      this.add = true;
    },
    submitForm() {
      if (this.type == 1) {
        this.$refs["dynamicValidateForm"].validate((valid) => {
          if (valid) {
            if (this.add) {
              add(this.form).then((res) => {
                if (res.status == "ok") {
                  this.$notify({
                    message: "add successfully",
                    type: "success",
                  });
                  this.getData();
                  this.dialogTableVisible = false;
                } else {
                  this.$notify.error({
                    message: "add failed",
                  });
                }
              });
            } else {
              upd(this.form).then((res) => {
                if (res.status == "ok") {
                  this.$notify({
                    message: "update successfully",
                    type: "success",
                  });
                  this.getData();
                  this.dialogTableVisible = false;
                } else {
                  this.$notify.error({
                    message: "update failed",
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      } else {
        this.$emit("addScoe");
      }
    },
    handleScore(row) {
      this.type = 2;
      this.dialogTableVisible = true;
      this.$on("addScoe", () => {
        addScore({
          rest_id: row._id,
          score: this.score,
        }).then((res) => {
          if (res.status == "ok") {
            this.$notify({
              message: "Scored successfully",
              type: "success",
            });
            this.getData();
            this.dialogTableVisible = false;
          } else {
            this.$notify.error({
              message: "Scoring failed",
            });
          }
        });
      });
    },
    handleClose() {
      this.score = 0;
      this.$refs["dynamicValidateForm"].resetFields();
    },
    httpRequest(a) {
      return new Promise((resolve, reject) => {
        resolve(a);
      });
    },
    handleAvatarSuccess(res, file) {
      const self = this;
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file.raw);
      fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        self.form.photo = srcData;
      };
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Upload pictures can only be in JPG format");
      }
      if (!isLt2M) {
        this.$message.error("Picture size cannot exceed 2 MB");
      }
      return isJPG && isLt2M;
    },
    getScore() {
      return new Promise((resolve) => {
        getScore().then((res) => {
          if (res.status == "ok") {
            resolve(res.data);
          } else {
            resolve([]);
          }
        });
      });
    },
    getData() {
      this.getScore().then((data) => {
        getInfo().then((res) => {
          if (res.status == "ok") {
            this.tableData = res.data.map((item) => {
              let find = data.filter(
                (its) => its.rest_id == item._id && its.user_id == getUserId()
              );
              let findAll = data.filter((its) => its.rest_id == item._id);
              let fraction = 0;
              findAll.forEach((element) => {
                fraction = fraction + element.score;
              });
              item.grades = fraction / findAll.length;
              if (find.length == 0) {
                item.play = false;
              } else {
                item.play = true;
              }
              return item;
            });
          } else {
            this.tableData = [];
          }
        });
      });
    },
    handleEdit(row) {
      this.type = 1;
      this.add = false;
      const copy = Object.assign({}, row);
      this.form = copy;
      this.dialogTableVisible = true;
    },
    handleDelete(row) {
      this.$confirm(
        "This operation will permanently delete the file, do you want to continue",
        "prompt",
        {
          confirmButtonText: "ok",
          cancelButtonText: "cancel",
          type: "warning",
        }
      )
        .then(() => {
          del(row._id).then((res) => {
            if (res.status == "ok") {
              this.$notify({
                message: "delete successfully",
                type: "success",
              });
              this.getData();
            } else {
              this.$notify.error({
                message: "delete failed",
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
