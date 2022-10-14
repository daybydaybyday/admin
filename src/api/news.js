import service from "@/utils/request"
//列表
export function GetList(data) {
    return service.request({
        method: "post",
        url: "/news/getList/",
        data //data:data
    })
}

//新增信息
export function AddInfo(data) {
    return service.request({
        method: "post",
        url: "/news/add/",
        data //data:data
    })
}

//编辑信息
export function EditInfo(data) {
    return service.request({
        method: "post",
        url: "/news/editInfo/",
        data //data:data
    })
}

//删除信息
export function DeleteInfo(data) {
    return service.request({
        method: "post",
        url: "/news/deleteInfo/",
        data //data:data
    })
}

//一级分类添加
export function AddFirstCategory(data) {
    return service.request({
        method: "post",
        url: "/news/addFirstCategory/",
        data //data:data
    })
}

//子级分类添加
export function AddChildrenCategory(data) {
    return service.request({
        method: "post",
        url: "/news/addChildrenCategory/",
        data //data:data
    })
}

//获取分类
export function GetCategory(data) {
    return service.request({
        method: "post",
        url: "/news/getCategory/ ",
        data
    })
}

//获取分类(包含子级)
export function GetCategoryAll(data) {
    return service.request({
        method: "post",
        url: "/news/getCategoryAll/ ",
        data
    })
}

//删除分类
export function DeleteCategory(data) {
    return service.request({
        method: "post",
        url: "/news/deleteCategory/",
        data
    })
}

//修改分类
export function EditCategory(data) {
    return service.request({
        method: "post",
        url: "/news/editCategory/ ",
        data
    })
}

//获取七牛云Token
export function QiniuToken(data) {
    return service.request({
        method: "post",
        url: "/uploadImgToken/",
        data
    })
}

