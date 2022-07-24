import {MessageBox} from 'element-ui';
export default {
    install(Vue, options) {
        Vue.prototype.confirm =  (params) => {
            MessageBox.confirm(params.content, params.tip || "提示", {//若传入参数  展示参数 否则展示提示
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: params.type || "warning",//此运算方便传入参数
                    center: true,
                })
                .then(() => {
                    if(params.fn){params.fn}

                    root.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    root.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        }

        //可以继续定义全局方法
    }
}
//这是拆分出的关于删除的一个方法  通过传参内容的不同  显示不同的提示  方法中的内容为element-ui中的内容


//vue插件
//暴露出默认的方法  进行安装  在vue的原型上添加新的方法

//要去全局引入 注册