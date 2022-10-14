<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="信息分类">
      <el-select v-model="form.categoryId" class="pull-left">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图">
        <Uploading :imageUrl.sync = "form.imageUrl"></Uploading>
    </el-form-item>

    <el-form-item label="发布日期" class="pull-left">
      <el-date-picker
        v-model="form.createDate"
        type="date"
        placeholder="选择日期"
        disabled
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容" class="pull-left">
      <quillEditor
        v-model="form.content"
        ref="myQuillEditor"
        :options="data.editorOption"
      />
    </el-form-item>

    <el-form-item class="pull-left">
      <el-button type="primary" @click="submit" :loading="data.submitLoading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { EditInfo, GetList } from "@/api/news";
import { timestampToTime } from "@/utils/common";


import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

//组件
import Uploading from "@/components/Uploading"

export default {
  name: "infoDetailed",
  components: { quillEditor ,Uploading },
  setup(props, { root }) {
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {},
      submitLoading: false,
    });

    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imageUrl: "",
    });

    // let id =
    //   root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // console.log(id);
    // let title =
    //   root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];
    // console.log(title);

    const getInfoCategory1 = () => {
      root.$store.dispatch("common/getInfoCategory").then((response) => {
        console.log(response);
        data.category = response.data.data.data;
      });
    };

    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id,
      };
      GetList(requestData)
        .then((response) => {
          let responseData = response.data.data.data[0];
          console.log(responseData);
          form.categoryId = responseData.categoryId;
          form.title = responseData.title;
          form.createDate = timestampToTime(responseData.createDate);
          form.content = responseData.content;
        })
        .catch((err) => {});
    };

    const submit = () => {
      let requestData = {
        id: data.id,
        category_id: form.categoryId,
        title: form.title,
        content: form.content,
      };
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
      data.submitLoading = true;
      EditInfo(requestData)
        .then((response) => {
          let data = response.data;
          console.log(response.data);
          root.$message({
            message: data.message,
            type: "success",
          });
          data.submitLoading = false; //关闭等待状态
          //root.$refs['form'].resetFields();
          //resetFrom();
        })
        .catch((err) => {
          data.submitLoading = false;
        });
    };

    


    onMounted(() => {
      getInfoCategory1();
      getInfo();
    });

    return {
      data,
      form,

      getInfo,
      submit,
    };
  },
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>
