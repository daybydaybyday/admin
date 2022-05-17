//过滤特殊字符
export function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

//如果有多个方法，引入的时候{}加：,方法名


//如果多处需要验证，我们有必要把他抽离出来
export function validateEmail(value) {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return !reg.test(value) ? true : false
    //没有通过验证时，才会出现下边的反应，所以！
}

export function validatePass(value) {
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    return !reg.test(value) ? true : false
    //没有通过验证时，才会出现下边的反应，所以！
}

export function validateVCode(value) {
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(value) ? true : false
    //没有通过验证时，才会出现下边的反应，所以！
}