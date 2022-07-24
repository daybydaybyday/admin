<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="4">
        <div class="label-warp category">
          <label for="">类型：</label>
          <div class="warp-content">
            <el-select
              v-model="categoryValue"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="label-warp date">
          <label>日期：</label>
          <div class="warp-content">
            <el-date-picker
              style="width: 100%"
              v-model="dateValue"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="label-warp key-word">
          <label for="">关键字：</label>
          <div class="warp-content">
            <el-select
              v-model="searchKey"
              placeholder="请选择"
              style="width: 100px"
            >
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="searchKeyWork"
          placeholder="请输入内容"
          style="width: 100%"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width: 100%" size="small" @click="search"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%"
          size="small"
          @click="add"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!-- 占位 -->
    <div class="black-space-30"></div>

    <!-- 表格 -->
    <el-table :data="tableData.item" border style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column prop="title" label="标题" width="350"> </el-table-column>
      <el-table-column prop="categoryId" label="类别" width="130" :formatter="toCategory">
      </el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toData"> </el-table-column>
      <el-table-column prop="user" label="管理员" width="115">
      </el-table-column>
      <el-table-column prop="操作" label="操作">
        <!-- 表格中加标签，要用template，数据在scope中 -->
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 占位 -->
    <div class="black-space-30"></div>

    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button
          type="danger"
          size="small"
          style="float: left"
          @click="deleteAll"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-pagination
          background
          layout="total, sizes,  pager, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          class="pull-right"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!--新增弹窗 -->
    <DialogInfo
      :flag.sync="dialogInfo"
      @close="closeDialog"
      :category="options.category"
    ></DialogInfo>
    <!-- 修改弹窗 -->
    <DialogInfoEdit
      :flag.sync="dialogInfoEdit"
      @close="closeDialog"
      :category="options.category"
      :id="infoId"
    ></DialogInfoEdit>
  </div>
</template>

<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import DialogInfo from "./dialog/info.vue";
import DialogInfoEdit from "./dialog/edit.vue";
import { confirm } from "@/utils/global_V3.0";
import { common } from "@/api/common";
import { GetList, DeleteInfo } from "@/api/news";
import { timestampToTime } from '@/utils/common'
export default {
  name: "",
  components: {
    DialogInfo,
    DialogInfoEdit
  },
  setup(props, { root }) {
    //声明  confirm直接调用  confirm()
    //const {str :aaa,confirm} = global();
    //watch(()=>{console.log(str.value)})
    //可以监听组件中值的变化
    //该用法的亮点在于可以重命名  避免多次应用时的冲突

    const { getInfoCategory, categoryItem } = common();

    const dialogInfo = ref(false);
    const dialogInfoEdit = ref(false)
    const categoryValue = ref("");
    const dateValue = ref("");
    const searchKey = ref("ID"); //默认值为ID
    const searchKeyWork = ref("");
    const total = ref(0)
    const loading = ref(true)
    const deleteInfoId = ref('')
    const infoId = ref('')

    const options = reactive({
      category: [],
    });

    const searchOptions = reactive([
      {
        value: "id",
        label: "ID",
      },
      {
        value: "title",
        label: "标题",
      },
    ]);

    const page =reactive({
      pageNumber:1,
      pageSize:10
    })

    //表格数据
  const tableData = reactive({
    item:[]
  });

    const handleSizeChange = (val) => {
      console.log(`每页 ${val} 条`);
      page.pageSize = val
      getList()
    };
    const handleCurrentChange = (val) => {
      console.log(`当前页: ${val}`);
      page.pageNumber = val
      getList()
    };
    const closeDialog = () => {
      dialogInfo.value = false; //vue3中访问值＋.value
      dialogInfoEdit.value = false;
    };
    //element-ui
    const deleteItem = (id) => {
      deleteInfoId.value = [id]
      confirm({
        //注册的全局方法
        content: "此操作将永久删除该文件, 是否继续?",
        tip: "警告",
        fn: confirmDelete, //传入相应的函数
        catchFn:()=>{}
      });
    };
    const deleteAll = () => {
      if(!deleteInfoId.value||deleteInfoId.value.length == 0){
        root.$message({
          message:'请选择要删除的数据！！',
          type:'error'
        })
        return false;
      }
      confirm({
        content: "此操作将删除所有文件, 是否继续?",
        type: "success",
        fn: confirmDelete, //传入相应的函数
        catchFn:()=>{}
      });
    };
    const confirmDelete = () => {
      DeleteInfo({id: deleteInfoId.value}).then(response=>{
        deleteInfoId.value = ''
        getList()
      }).catch(err=>{

      })
    };
    const getInfoCategory1 = () => {
      root.$store.dispatch("common/getInfoCategory").then((response) => {
        console.log(response);
        options.category = response.data.data.data;
      });
    };
    const getList = () => {
      let requestData = formatData()
      loading.value = true;
      GetList(requestData).then((response) => {
        let data = response.data.data
        tableData.item = data.data
        console.log(data)
        total.value = data.total
        loading.value=false
      }).catch((err) => {

      });
    };

    const toData =(row, column, cellValue, index)=>{
      console.log(row.createDate)
      return timestampToTime(row.createDate)
    }
    const toCategory =(row, column, cellValue, index)=>{
      console.log(row.categoryId)
      let categoryId = row.categoryId
      let categoryData = options.category.filter(item => item.id == categoryId)[0]
      return categoryData.category_name
    }
    const handleSelectionChange = (val)=>{
       let id = val.map(item => item.id)
       deleteInfoId.value = id
    }
    const search = ()=>{
      console.log(categoryValue)
      console.log(dateValue.value)
      console.log(searchKey)
      console.log(searchKeyWork)
      let requestData = formatData()
      console.log(requestData)
      getList()
    }
    const formatData = ()=>{
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
      };
      console.log(categoryValue.value)
      if(categoryValue.value){ requestData.categoryId = categoryValue.value}
      if(dateValue.value.length>0){
        requestData.startTime =dateValue.value[0]
        requestData.endTime =dateValue.value[1]
      }
      if(searchKeyWork.value){requestData[searchKey.value] = searchKeyWork.value}
      return requestData
    }
    const editInfo = ( id )=>{
      console.log(id)
      infoId.value = id
      dialogInfoEdit.value = true
    }
    const add = ()=>{
      dialogInfo.value = true
    }

    //生命周期
    onMounted(() => {
      //法1
      //getInfoCategory()

      //法二
      getInfoCategory1();

      getList()
    });

    //监听
    watch(
      () => categoryItem.item,
      (value) => {
        options.category = value;
      }
    );
    return {
      //ref
      dialogInfo,
      dialogInfoEdit,
      categoryValue,
      dateValue,
      searchKey,
      searchKeyWork,
      total,
      loading,
      deleteInfoId,
      infoId,

      //reactive
      options,
      searchOptions,
      tableData,
      page,

      //method
      handleSizeChange,
      handleCurrentChange,
      closeDialog,
      deleteItem,
      deleteAll,
      confirmDelete,
      getInfoCategory1,
      getList,
      toData,
      toCategory,
      handleSelectionChange,
      search,
      formatData,
      editInfo,
      add,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.label-warp {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 53, 40);
  }
  &.key-word {
    @include labelDom(right, 63, 40);
  }
}
</style>
