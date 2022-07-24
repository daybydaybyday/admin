import {
    MessageBox
} from 'element-ui';
import {
    ref
} from "@vue/composition-api";



export function confirm(params) {
    const str = ref('')
    MessageBox.confirm(params.content, params.tip || "提示", { //若传入参数  展示参数 否则展示提示
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: params.type || "warning", //此运算方便传入参数
        center: true,
    }).then(() => {
        str.value = params.id || ''
        params.fn && params.fn(params.id || '')
    }).catch(() => {
        params.catchFn || params.catchFn()
    });
};