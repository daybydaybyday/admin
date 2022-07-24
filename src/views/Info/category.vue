<template>
  <div id="category">
    <el-row>
      <el-button
        type="danger"
        style="float: left"
        @click="addFirst({ type: 'category_first_add' })"
        >添加一级分类</el-button
      >
    </el-row>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="12">
          <div
            class="category category-wrap"
            v-for="firstItem in category.item"
            :key="firstItem.id"
          >
            <h4 style="text-align: left">
              <svg-icon icon-class="plus"></svg-icon>
              {{ firstItem.category_name }}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  round
                  @click="
                    editCategory({
                      data: firstItem,
                      type: 'category_first_edit',
                    })
                  "
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="
                    handleAddChildren({
                      data: firstItem,
                      type: 'category_children_add',
                    })
                  "
                  round
                  >添加子级</el-button
                >
                <el-button
                  size="mini"
                  round
                  @click="deleteCategoryConfirm(firstItem.id)"
                  >删除</el-button
                >
              </div>
            </h4>
            <ul style="text-align: left" v-if="firstItem.children">
              <li
                v-for="childrenItem in firstItem.children"
                :key="childrenItem.id"
              >
                {{ childrenItem.category_name }}
                <div class="button-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" type="success" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <h4 class="menu-title" style="text-align: left">一级分类编辑</h4>
          <el-form label-width="142px" class="form-wrap">
            <el-form-item label="一级分类名称" v-if="category_first_input">
              <el-input
                v-model="form.categoryName"
                :disabled="category_first_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称" v-if="category_children_input">
              <el-input
                v-model="form.secCategoryName"
                :disabled="category_children_disabled"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import { confirm } from "@/utils/global_V3.0";
import { common } from "@/api/common";
import {
  AddFirstCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory,
} from "@/api/news";
export default {
  name: "category",
  setup(props, { root }) {
    const { getInfoCategory, categoryItem ,getInfoCategoryAll } = common();

    //ref
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false); //为true时为等待状态
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref("");
    const submit_button_type = ref("");

    const form = reactive({
      categoryName: "",
      secCategoryName: "",
    });

    const category = reactive({
      item: [],
      current: [],
    });

    //调用接口
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      }
    };

    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message({
          message: "不能为空",
          type: "error",
        });
        return false;
      }
      submit_button_loading.value = true;
      AddFirstCategory({ categoryName: form.categoryName })
        .then((response) => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success",
            });
            /*
            这里有两种处理方法
            1调用获取分类的接口（缺点：浪费资源时间，每次更新都要重新加载所有分类）
            2如下直接push进去
            */
            category.item.push(response.data.data);
          }
          submit_button_loading.value = false;
          form.categoryName = "";
          form.secCategoryName = "";
        })
        .catch((error) => {
          submit_button_loading.value = false;
          form.categoryName = "";
          form.secCategoryName = "";
        });
    };

    const addFirst = (params) => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
    };

    const deleteCategoryConfirm = (categoryID) => {
      deleteId.value = categoryID;
      confirm({
        content: "此操作将永久删除该文件, 是否继续?",
        tip: "警告",
        fn: deleteCategory, //确定时触发的方法
        catchFn: () => {
          deleteId.value = "";
        },
      });
    };
    const editCategory = (params) => {
      submit_button_type.value = params.type;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      form.categoryName = params.data.category_name;
      category.current = params.data;
    };

    const editFirstCategory = () => {
      if (category.current.length == 0) {
        root.$message({
          message: "未选择分类",
          type: "error",
        });
      }
      EditCategory({
        categoryName: form.categoryName,
        id: category.current.id,
      })
        .then((response) => {
          root.$message({
            message: response.data.message,
            type: "success",
          });
          // let index = category.item.findIndex(item => item.id == category.current.id)
          // category.item[index].category_name = response.data.data.categoryName
          category.current.category_name = form.categoryName;
          form.categoryName = "";
          category.current = [];
        })
        .catch((err) => {});
    };
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then((response) => {
          //操作数组
          ya; //1 es6方法  ：查找所在位置 findIndex
          // let index = category.item.findIndex(item => item.id == deleteId.value)
          // category.item.splice(index,1)//两个参数是删除 三个参数是替换

          //法2  适合于数据量不大的项目 ，不然要不断循环遍历大数组
          let newData = category.item.filter(
            (item) => item.id !== deleteId.value
          );
          category.item = newData;
        })
        .catch((err) => {});
    };
    const handleAddChildren = (params) => {
      submit_button_type.value = params.type;
      //存储数据
      category.current = params.data;
      //启用 禁用
      category_first_disabled.value = true;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      //是否显示
      category_children_input.value = true;
      form.categoryName = params.data.category_name;

    };
    const addChildrenCategory = () => {
      if(!form.secCategoryName){
      root.$message({
            message: '子级分类名称不能为空',
            type: "error",
          });
      return false
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id,
      };
      AddChildrenCategory(requestData)
        .then((response) => {
          root.$message({
            message: "添加成功！",
            type: "success",
          });
          getInfoCategoryAll()
          form.secCategoryName=''
        })
        .catch((err) => {});
    };

    //生命周期
    //元素挂载完成后(页面dom元素完成时)
    onMounted(() => {
      getInfoCategoryAll();
    });

    //监听
    watch(
      () => categoryItem.item,
      (value) => {
        category.item = value;
      }
    );

    return {
      //ref
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      deleteId,
      submit_button_type,
      //reactive
      form,
      category,
      //method
      submit,
      addFirst,
      deleteCategoryConfirm,
      deleteCategory,
      editCategory,
      addFirstCategory,
      editFirstCategory,
      handleAddChildren,
      addChildrenCategory,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 15px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  z-index: 2;
  right: 11px;
  top: -1px;
  button {
    font-size: 12px;
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}

.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.hr-e9e9e9 {
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
</style>
