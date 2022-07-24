import { GetCategory, GetCategoryAll } from "./news";
import { reactive } from "@vue/composition-api";

export function common (){
    const categoryItem = reactive({
        item:[]
    })
    const getInfoCategory = () =>{
        GetCategory({})
        .then((response) => {
          console.log(response.data.data);
          categoryItem.item = response.data.data
        })
        .catch((err) => {});
    }

    const getInfoCategoryAll = () =>{
        GetCategoryAll({})
        .then((response) => {
          console.log(response.data.data);
          categoryItem.item = response.data.data
        })
        .catch((err) => {});
    }

    return {
        getInfoCategory,
        categoryItem,
        getInfoCategoryAll
    }
}