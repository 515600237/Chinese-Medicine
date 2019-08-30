import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state={//要设置的全局访问的state对象
    showFooter: true,
    activeTabNum:0, //底部标签当前活动值
    token:"",
    imei:"",
    project:"east",
    diseaseCategory:null, // =0,中医，=1中医，西医
    stateStatic: '',//控制底栏
    rotationShType: 1,//轮转日历显示类型
    teachActiveId: 0, //教学活动id,
    deaseModifyJson: {},//病种修改
    teachModifyJson:{},//师承活动修改
    auditType: 1, // 病种1，教学活动2，师承3
    teachAuditStudentId:0,//师承 学生ID
    allNoticeNum:0,//指导老师首页小红点数量;
    waitAuditShch:0,//师承老师首页数量；
    deaseListPagePre: 1, //病种,技能手术的前一个页面 1，首页，2轮转计划页面
      month:null,
      status:0,//住院首页跳转病种和手术的状态,
      teachStatus:0,//指导医师首页跳转统计详情的状态

};
// 获取值
const getters = {
    isShow(state) {
       return state.showFooter
    },
    getActiveNum(state){
       return state.activeTabNum
    },
    getToken(state){
        return state.token
    },
    getImei(state){
        return state.imei;
    },
    getTeachActiveId(state){
       return state.teachActiveId
    },
    getdeaseModifyJson(state){
       return state.deaseModifyJson;
    },
    getteachModifyJson(state){
        return state.teachModifyJson;
    },
    getauditType(state){
        return state.auditType;
    },
    getRotationShType(state){
        return state.rotationShType;
    },
    getTeachAuditStudentId(state){
        return state.teachAuditStudentId;
    },


};
// 改变值
const mutations = {
    show(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.showFooter = true;
    },
    hide(state) {  //同上
        state.showFooter = false;
    },
    setNum(state,number){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.activeTabNum=number;
    },
    setToken(state,token){
        state.token = token;
    },
    setImei(state,imei){
        state.imei = imei;
    },
    setTeachActiveId(state,teachActiveId){
        state.teachActiveId = teachActiveId;
    },
    setdeaseModifyJson(state,deaseModifyJson){
        state.deaseModifyJson = deaseModifyJson;
    },
    setteachModifyJson(state,teachModifyJson){
        state.teachModifyJson = teachModifyJson
    },
    setAuditType(state,auditType){
          state.auditType = auditType;
    },
    setRotationShType(state,rotationShType){//设置轮转计划显示
        state.rotationShType = rotationShType;
    },
    setTeachAuditStudentId(state,teachAuditStudentId){
         state.teachAuditStudentId = teachAuditStudentId
    },

};
// 异步操作
const actions = {
    hideFooter(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('hide');
    },
    showFooter(context) {  //同上注释
        context.commit('show');
    },
    setNewNum(context,num){   //同上注释，num为要变化的形参
        context.commit('setNum',num)
    },
    setNewToken(context,token){
        context.commit('setToken',token)
    },
    setNewImei(context,imei){
        context.commit("setImei",imei);
    },
    setNewTeachActiveId(context,teachActiveId){
        context.commit('setTeachActiveId',teachActiveId)
    },
    setNewDeaseModifyJson(context,deaseModifyJson){
        context.commit('setdeaseModifyJson',deaseModifyJson)
    },
    setNewteachModifyJson(context,teachModifyJson){
        context.commit('setteachModifyJson',teachModifyJson)
    },
    setNewAuditType(context,auditType){
        context.commit('setAuditType',auditType)
    },
    setNewRotationShType(context,rotationShType){//设置轮转计划显示
        context.commit("setRotationShType",rotationShType);
    },
    setNewTeachAuditStudentId(context,teachAuditStudentId){
        context.commit("setTeachAuditStudentId",teachAuditStudentId)
    },

};

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;



