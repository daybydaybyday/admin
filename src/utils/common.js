export function timestampToTime(timer){
    let curDate = new Date(timer * 1000);
    let Y = curDate.getFullYear();
    let M = curDate.getMonth() + 1 < 10 ? `0${curDate.getMonth() + 1}` : `${curDate.getMonth() + 1}`;
    let D = curDate.getDate() < 10 ? `0${curDate.getDate() + 1}` : `${curDate.getDate() + 1}`;
    let H = curDate.getHours() < 10 ? `0${curDate.getHours() + 1}` : `${curDate.getHours() + 1}`;
    let Min = curDate.getMinutes() < 10 ? `0${curDate.getMinutes() + 1}` : `${curDate.getMinutes() + 1}`;
    let S = curDate.getSeconds() < 10 ? `0${curDate.getSeconds() + 1}` : `${curDate.getSeconds() + 1}`;
  
    return `${Y}-${M}-${D} ${H}:${Min}:${S}`
  }
  
