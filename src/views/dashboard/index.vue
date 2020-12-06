<template>
  <el-card>
    <div slot="header" class="card-header">
      <el-button type="primary" size="small" @click="dialogTableVisible = true"
        >Add</el-button
      >
    </div>
    <el-table :data="tableData" border height="800px">
      <el-table-column prop="name" label="name"> </el-table-column>
      <el-table-column prop="borough" label="borough"> </el-table-column>
      <el-table-column prop="photo" label="photo"> </el-table-column>
      <el-table-column label="address">
        <el-table-column prop="street" label="street"> </el-table-column>
        <el-table-column prop="building" label="building"> </el-table-column>
        <el-table-column prop="zipcode" label="zipcode"> </el-table-column>
      </el-table-column>
      <el-table-column prop="grades" label="grades"> </el-table-column>
      <el-table-column label="grades" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="add ? 'cerate' : 'edit'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getInfo } from "@/api/user";
export default {
  name: "Dashboard",
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      add: true,
      form: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getInfo().then((res) => {
        if (res.status == "ok") {
          this.tableData = res.data;
        }
      });
    },
    handleEdit() {},
    handleDelete() {},
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
