import request from '../config/request' //引用接口

export function rulesList(params){
   return request({ url: '/manage/rulesList',method: 'post',data: params})
}

export function rulesSave(params){
   return request({ url: '/manage/rulesSave',method: 'post',data: params})
}


export function rulesDel(params){
   return request({ url: '/manage/rulesDel',method: 'post',data: params})
}
