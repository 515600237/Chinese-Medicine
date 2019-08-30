let base = process.env.userRoot1;
const base2=process.env.userRoot2;//基础数据 一龙
let base3 = process.env.userRoot3;//海博
let file = process.env.file;

const api = {
  // 用户
  login: `${base}/sys/login`, // 登录
  mysetInfo: `${base}/userinfo/myInfo`, // 我的设置页面
  suggestion:`${base}/suggestion`,  //意见反馈
  changePassword:`${base}/changePwd`,  //修改密码
  //首页
  swiper:`${base}/cms/swapper`,//首页轮播图
  swiperDetail:`${base}/cms/detail/`,//轮播图进入的新闻页
  homeStudentInfo:`${base2}/student/home`,//住院医师首页情况
  getNoRead:`${base}/push/noRead`,//首页未读消息数量
  getLogList:`${base}/push/logList`,//消息列表
  batchReadMsg:`${base}/push/batchReadMsg`,//消息列表
  //统计
  rotationProgress:`${base2}/student/statistic/rotationProgress`,
  medicalInfo:`${base2}/student/medicalInfo`,
  medicalInfoBySchedule:`${base2}/student/medicalInfoBySchedule`,

    //指导老师首页
    teacherHomeStatic:`${base2}/teacher/home`,//首页上部分统计
    getStudentRotation:`${base2}/teacher/studentRotation`,//首页下部分学生轮转
    checkUserDetail:`${base}/userinfo/checkUserDetail`, //判断是否完善信息
    homeAuditNum:`${base2}/teacher/home`, //指导老师首页待审核数量
    homeshChAuditNum:`${base3}/mentor/waitAudit/count`, //师承老师首页待审核数量

    //完善信息
    userDetailInfo:`${base}/userinfo/userDetailInfo`,//用户详情
    saveuserInfo:`${base}/userinfo/saveOrUpdate`,//保存
    getTypeList:`${base2}/api/getTypeList`,//技术职能
    getUserRelation:`${base}/userinfo/getUserRelation`,//获取老师多科室列表,选择身份
    getStandardList:`${base2}/standard/appList`,//标准科室 完善信息

    //统计
    showRotationProgress:`${base2}/teacher/showRotationProgress`,//统计首页
    report:`${base2}/teaching/student/report`,//教学活动统计详情
    /*师承统计*/
    detailsReport:`${base2}/mentor/student/report`,
    studentInfo:`${base2}/student/studentDataInfoForMentor`,

    //审核
    listAuditCollect:`${base2}/teacher/listAuditCollect`,//病种手术审核列表
    deaseAudit:`${base2}/teacher/audit`,//医疗上报信息审核
    studentInfoList:`${base2}/teacher/studentInfoList`,//医疗上报信息审核
    activeAuditList:`${base3}/teaching/teacher/list`,//教学活动审核列表
    teachActiveAudit:`${base3}/teaching/teacher/audit`,//教学活动审核
    //师承审核
    teacherAudit:`${base3}/mentor/teacher/audit`,


    //获取师承学生列表
    teaChstudList:`${base3}/mentor/teacher/studentList`,
    shChAuditList:`${base3}/mentor/teacher/list`,//师承审核列表
    shChAudit:`${base3}/mentor/teacher/audit`,//师承审核


//科室详情
  recordStatisticsOfSchedule:`${base2}/student/statistic/recordStatisticsOfSchedule`,//已选科室
  recordStatistics:`${base2}/student/statistic/recordStatistics`,//全部科室录入情况

  getCooridionList:`${base}/api/getCooridionList`, //获取协同单位
  getDepartmentTeacher:`${base}/userinfo/getDepartmentTeacher`, //获取指导老师
  

  // 基础数据
  getDepartments:`${base2}/api/getDepartments`, //获取科室
  getMajors:`${base2}/api/getMajors`, //获取专业

  // 轮转计划
  departAndMedicalBaseInfo:`${base2}/base/departAndMedicalBaseInfo`, //获取科室，病种，技能，手术
  scheAdd:`${base2}/schedule/save`, //新增轮转计划
  schelist:`${base2}/schedule/list`, //获取轮转计划
  scheModify:`${base2}/schedule/update`, //修改轮转计划
  scheDelete:`${base2}/schedule/delete`, //删除轮转计划
  medicalRule:`${base2}/student/medicalRuleBySchedule`, //培训要求
  scheduleCalendar:`${base2}/schedule/scheduleCalendar`, //轮转计划日历

  // 病种,手术,技能,操作
  medicalSave:`${base2}/student/medical/save`, //新增医疗信息
  deaseList:`${base2}/student/disease/list`, //病种列表
  deaseInfo:`${base2}/student/disease`, //病种详情

  // 获取服务器时间
  systemCurrentTime: `${base2}/base/systemCurrentTime`,
  
  diseaseModify:`${base2}/student/disease/update`, //修改病种
  diseaseDelete:`${base2}/student/disease/delete`, //删除病种

  operateList:`${base2}/student/operation/list`, //手术列表
  operateInfo:`${base2}/student/operation`, //手术详情

  operateModify:`${base2}/student/operation/update`, //修改手术
  operateDelete:`${base2}/student/operation/delete`, //删除手术

  /*师承*/
  mentorConstant:`${base3}/mentor/constant`,/*师承基本数据*/
  mergeSave:`${base3}/mentor/merge/save`,/*师承保存*/



  /*师承列表*/
  spliceList:`${base3}/mentor/student/list`,



  /*师承详情*/
  studyDetail:`${base3}/mentor/attendance/detail/`,/*跟师学习*/
  caseDetail:`${base3}/mentor/diagnostic/detail/`,/*临床医案*/
  noteDetail:`${base3}/mentor/notes/detail/`,/*跟师笔记*/
  /*师承修改*/
  studyUpdate:`${base3}/mentor/attendance/update/`,/*跟师学习*/
  caseUpdate:`${base3}/mentor/diagnostic/update/`,
  noteUpdate:`${base3}/mentor/notes/update/`,
  /*师承删除*/
  teachDel:`${base3}/mentor/remove/`,
  // 教学活动
  activityConstant:`${base3}/teaching/constant`,/*教学活动基本数据*/
  activitySave:`${base3}/teaching/save`,/*教学活动保存*/
  activityList: `${base3}/teaching/student/list`,/*教学活动列表*/
  activityDetail: `${base3}/teaching/detail`,/*教学活动详情*/
  activityUpdate: `${base3}/teaching/update`,/*教学活动修改*/
  activityRemove: `${base3}/teaching/remove`,/*教学活动删除*/


  
};
export default api;
