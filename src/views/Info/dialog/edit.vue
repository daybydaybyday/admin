<template>
  <el-dialog
    title="修改"
    :visible.sync="dialogTableVisible"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form ref="form" :model="form" v-loading="loading">
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-select
          v-model="form.category"
          placeholder="请选择活动区域"
          style="float: left"
        >
          <el-option
            v-for="item in categoryOptions.items"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题:" :label-width="formLabelWidth">
        <el-input
          v-model="form.title"
          autocomplete="off"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="概况:" :label-width="formLabelWidth">
        <el-input
          v-model="form.content"
          autocomplete="off"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" :loading="submitLoading" @click="submit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, watchEffect } from "@vue/composition-api";
import { EditInfo, GetList } from "@/api/news";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Array,
      default: () => [], //数组
    },
    id: {
      type: String,
      default: "", //数组
    },
  },
  setup(props, { emit, root }) {
    const dialogTableVisible = ref(false);
    const formLabelWidth = ref("70px");
    const submitLoading = ref(false);
    const loading = ref(true);

    const form = reactive({
      category: "",
      title: "",
      content: "",
    });

    const categoryOptions = reactive({
      items: [],
    });

    const resetFrom = () => {
      form.category = "";
      form.content = "";
      form.title = "";
    };

    const close = () => {
      resetFrom();
      dialogTableVisible.value = false;
      //this.$emit('update:flag',false)//使用修饰器sync的用法  使用更便捷  父组件无需定义回调函数  直接修改其值  此处只有一个显示关闭的功能，可用修饰器
      emit("close", false); //回调父组件的方法,哪个方法呢 父组件中close事件中的方法  false为参数
      //回调时需要做逻辑处理时，不能使用修饰器，反之，可以
    };

    const submit = () => {
      let id = parseInt(props.id)
      let category =parseInt(form.category)
      console.log(typeof id)
      let requestData = {
        id: id,
        category_id: category,
        title: form.title,
        content: form.content,
      };
      if (!form.category) {
        root.$message({
          message: "分类不能为空！",
          type: "error",
        });
        return false;
      }
      if (!form.title) {
        root.$message({
          message: "标题不能为空！",
          type: "error",
        });
        return false;
      }
      if (!form.content) {
        root.$message({
          message: "内容不能为空！",
          type: "error",
        });
        return false;
      }
      submitLoading.value = true;
      EditInfo(requestData)
        .then((response) => {
          let data = response.data;
          console.log(response.data);
          root.$message({
            message: data.message,
            type: "success",
          });
          submitLoading.value = false; //关闭等待状态
          //root.$refs['form'].resetFields();
          //resetFrom();
        })
        .catch((err) => {
          submitLoading.value = false;
        });
    };

    const openDialog = () => {
      categoryOptions.items = props.category;
      getInfo();
    };

    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id,
      };
      loading.value = true;
      GetList(requestData)
        .then((response) => {
          let responseData = response.data.data.data[0];
          console.log(responseData);
          form.category = responseData.categoryId;
          form.title = responseData.title;
          form.content = responseData.content;
          loading.value = false;
        })
        .catch((err) => {});
    };

    watchEffect(() => {
      dialogTableVisible.value = props.flag;
    });

    return {
      //ref
      dialogTableVisible,
      formLabelWidth,
      submitLoading,
      loading,

      //reactive
      form,
      categoryOptions,
      //methods
      close,
      openDialog,
      submit,
      resetFrom,
      getInfo,
    };
  },
  //单向数据流，父=》子；不能反向修改 当我们单击关闭按钮时，修改了flag的值 而flag的值时父组件传进来的  不能对其进行修改
  //那么  我们需要用别的办法  我们用watch监听flag的变化  我们不能修改flag  但是我们可以修改自身组件的值  但是父组件的值仍未改变  仍需要调优  只能打开一次
  //所以父组件的值必须改变  使用emit方法  回调父组件中的方法   去修改父组件中的值

  // watch: {
  //     flag:{
  //         handler: function (newValue,oldValue){
  //             this.dialogTableVisible = newValue
  //         }
  //     }
  // },
};
</script>
<style scoped></style>
