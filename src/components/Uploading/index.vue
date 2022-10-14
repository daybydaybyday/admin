<template>
  <el-upload
    class="avatar-uploader pull-left"
    action="http://up-z2.qiniup.com"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { reactive , onMounted, watch } from "@vue/composition-api";
import { QiniuToken } from "@/api/news";
// 组件的过程要如何操作？  显示默认图片，选择图片后渲染图片
// 最终的结果是为了什么？  返回图片路径
export default {
  name: "uploading",
  props:{
    imageUrl:{
        type:String,
        default:""
    }
  },
  setup(props, { root }) {
    const data = reactive({
      imageUrl:"",
      uploadKey: {
        token: "",
        key: "",
      },
    });
    const handleAvatarSuccess = (res, file) => {
      root.imageUrl = URL.createObjectURL(file.raw);
      //emit("upload : imageUrl " , img)
    };
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }

      //文件名转码
      let sufix = file.name;
      let key = encodeURI(`${sufix}`);
      data.uploadKey.key = key;

      return isJPG && isLt2M;
    };
    const getQiniuToken = () => {
      let requestData = {
        ak: "AXs9_jiNK_Fy4HyYRzujTuxFSm3x6V7M",
        sk: "gUsR1ngTi08vf4f43p6A7U3B3wT3tvt-bVEW",
        buckety: "webjshtml",
      };
      QiniuToken(requestData)
        .then((response) => {
            console.log(response.data.data)
            data.uploadKey.token = response.data.data.token
        })
        .catch((err) => {});
    };

    onMounted(() => {
      getQiniuToken();
    });

    watch(()=> props.imageUrl , (value) =>{
        data.value = value
    })
    return {
      data,

      handleAvatarSuccess,
      beforeAvatarUpload,
      getQiniuToken
    };
  },
};
</script>
<style lang="less" scoped></style>
