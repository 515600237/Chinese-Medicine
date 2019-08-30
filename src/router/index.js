import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path:"/author",
      name:'author',
      component:resolve => require(['@/views/login/author'],resolve)
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: resolve => require(["@/views/login/login"], resolve)
    },
    // 住院医师
    {
      path: '/studentHome',
      name: 'studentHome',
      component: resolve => require(["@/views/studentHome/home"], resolve),
      children: [
        //学生首页
        {
          path: 'homeindex',
          name: 'homeindex',
          component: resolve => require(["@/views/studentHome/homepage/homeIndex/homeIndex"], resolve)
        },
        //学生首页统计
        {
          path: 'staticindex',
          name: 'staticindex',
          component: resolve => require(["@/views/studentHome/statictable/staticIndex/staticIndex"], resolve)
        },
        //学生首页新闻
        {
          path: 'newInformation',
          name: 'newInformation',
          component: resolve => require(["@/views/studentHome/homepage/other/newInformation/newInformation"], resolve)
        },
        //学生消息列表
        {
          path: 'newsList',
          name: 'newsList',
          component: resolve => require(["@/views/studentHome/homepage/other/newsList"], resolve)
        },
        // 录入轮转计划
        {
          path: 'rotation',
          name: 'rotation',
          component: resolve => require(["@/views/studentHome/homepage/input/rotation/rotation"], resolve)
        },
        // 轮转计划详情
        {
          path: 'relationDetail', name: 'relationDetail', component:
            resolve => require(["@/views/studentHome/homepage/input/rotation/relationDetail"], resolve)
        },
        //培训要求
        {
          path: 'trainingRequires',
          name: 'trainingRequires',
          component: resolve => require(["@/views/studentHome/homepage/input/rotation/trainingRequires"], resolve)
        },
        //录入教学活动
        {
          path: 'teachingActiveIndex',
          name: 'teachingActiveIndex',
          component: resolve => require(["@/views/studentHome/homePage/teachingActivities/teachingActiveIndex"], resolve)
        },
        // 教学活动修改页面
        {
          path:"teachingActiveModify",
          name:"teachingActiveModify",
          component: resolve => require(["@/views/studentHome/homePage/teachingActivities/teachingActiveModify"], resolve)
        },
        // 教学活动列表
        {
          path:"teacherActiveList",
          name:"teacherActiveList",
          component: resolve => require(["@/views/studentHome/homePage/showList/teacherActiveList"], resolve)
        },
        //录入师承
        {
          path: 'teachingEntry',
          name: 'teachingEntry',
          component: resolve => require(["@/views/studentHome/homePage/teachingEntry/teachingEntry"], resolve)
        },
        //列表
        {
          path:"masterList",
          name:"masterList",
          component: resolve => require(["@/views/studentHome/homePage/showList/masterList"], resolve)
        },
        /*修改*/
        {
          path: 'teachingModify',
          name: 'teachingModify',
          component: resolve => require(["@/views/studentHome/homepage/teachingEntry/teachingModify"], resolve)
        },
        //录入病种技能手术
        {
          path: 'CaseOper',
          name: 'CaseOper',
          component: resolve => require(["@/views/studentHome/homepage/input/caseOperation/CaseOper"], resolve)
        },
        //病种技能手术修改
        {
          path: 'CaseOperModify',
          name: 'CaseOperModify',
          component: resolve => require(["@/views/studentHome/homepage/input/caseOperation/CaseOperModify"], resolve)
        },
        //病种技能手术列表
        {
          path: 'deaseOperList',
          name: 'deaseOperList',
          component: resolve => require(["@/views/studentHome/homePage/showList/deaseOperList"], resolve)
        },
        // 统计详情
        {
          path: 'staticdetail',
          name: "staticdetail",
          component: resolve => require(["@/views/studentHome/statictable/staticDetail/staticDetail"], resolve)
        },
        /*我的设置*/
        // 修改密码
        {
          path: "changepassword",
          name: "changepassword",
          component: resolve => require(["@/views/studentHome/myset/changePassword/changePassword"], resolve)
        },
        {
          path: "operating",
          name: "operating",
          component: resolve => require(["@/views/studentHome/myset/operating/operating"], resolve)
        },//操作说明
        {
          path: "feedback",
          name: "feedback",
          component: resolve => require(["@/views/studentHome/myset/feedback/feedback"], resolve)
        },//意见反馈
        {
          path: "mySet",
          name: "mySet",
          component: resolve => require(["@/views/studentHome/myset/mysetIndex/mySet"], resolve)
        },
      ]
    },
    // 指导医师
    {
      path: '/teacherPage',
      name: 'teacherPage',
      component:
        resolve => require(["@/views/teacherPage/teacherPage"], resolve),
      children: [
        // 老师首页
        {
          path: 'teacherHomeindex',
          name: 'teacherHomeindex',
          component: resolve => require(["@/views/teacherPage/teacherHome/homeIndex/teacherHomeindex"], resolve)
        },
        // 老师统计
        {
          path: 'teacherStatic',
          name: 'teacherStatic',
          component: resolve => require(["@/views/teacherPage/teacherStatic/teacherStatic"], resolve)
        },
        // 老师设计
        {
          path: "teacherSet",
          name: "teacherSet",
          component: resolve => require(["@/views/teacherPage/teacherSet/teacherSet"], resolve)
        },
        // 完善信息
        {
          path: 'teacherPerfecInfo',
          name: 'teacherPerfecInfo',
          component: resolve => require(["@/views/teacherPage/teacherHome/perfect/teacherPerfectInfo"], resolve)
        },
        //审核页面
        {
          path: 'teacherAudit',
          name: 'teacherAudit',
          component: resolve => require(["@/views/teacherPage/teacherHome/audit/audit"], resolve)
        },//审核主页面
        //师承统计
        {
          path: 'teacherStaticDetails',
          name: 'teacherStaticDetails',
          component: resolve => require(["@/views/teacherPage/teacherStatic/teacherStaticDetails"], resolve)
        },
        // 统计详情
        {
          path: 'staticdetail2',
          name: "staticdetail2",
          component: resolve => require(["@/views/studentHome/statictable/staticDetail/staticDetail"], resolve)
        },
        // 修改密码
        {
          path: "changepassword2",
          name: "changepassword2",
          component: resolve => require(["@/views/studentHome/myset/changePassword/changePassword"], resolve)
        },
        //意见反馈
        {
          path: "feedbackTeacher",
          name: "feedbackTeacher",
          component: resolve => require(["@/views/studentHome/myset/feedback/feedback"], resolve)
        },
        //操作说明
        {
          path: "operatingTeacher",
          name: "operatingTeacher",
          component: resolve => require(["@/views/studentHome/myset/operating/operating"], resolve)
        },
      ]
    },


  ]
})
