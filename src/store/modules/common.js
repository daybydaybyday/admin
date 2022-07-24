import {GetCategory} from '@/api/news'
const actions = {
    getInfoCategory(content, requestData) {
        return new Promise((resolve, reject) => {
            //接口  
            GetCategory({}).then((response) => {
                resolve(response) //注意要返回信息
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    actions
}