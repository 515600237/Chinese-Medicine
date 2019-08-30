<template>
  <div class="wrapper">
    <!--header-->
    <van-nav-bar :title="headTitle"
                 class="greenLg"
                 @click-right="onClickRight"
                 left-arrow
                 @click-left="onClickLeft"
    >
      <van-icon name="exchange" slot="right" v-if="Global.copyUserType == 7" />
    </van-nav-bar>
    <!--弹出框-->
    <!-- 角色选择弹出框 -->
    <van-dialog
      v-model="isRoleDialog"
      title
      :show-confirm-button="false"
      :show-cancel-button="false"
    >
      <ul class="dialog-content-box">
        <li
          class="dialog-content-text"
          v-for="(item,index) of roleList"
          :class="{'active':getActiveShow(item,index)}"
          @click="headGoPage(item,index)"
          :key="index"
        >{{item}}</li>
      </ul>
    </van-dialog>

    <!-- 选择科室 -->
    <van-dialog v-model="deptDialog" title :show-confirm-button="false" :show-cancel-button="false">
      <ul class="dialog-content-box">
        <li
          class="dialog-content-text"
          v-for="(item,index) of officeList"
          :class="{'active': checkActive(item)}"
          @click.stop="selectDepartId(item,index)"
          :key="index"
        >
          {{item.departmentName}}
          <span class="iconCheck" v-if="roleActive　==　index"></span>
        </li>
      </ul>
    </van-dialog>

    <!--轮转情况内容区-->
    <div class="audit-content">
      <!--师承审核  图标区-->
      <div
        class="iconAllList"
        v-if="Global.userType == 5"
        style="{display: flex;justify-content: center; align-items: center}"
      >
        <div class="icon1" @click="goAuditPage('师承审核',3)">
          <div class="icon-img">
            <van-icon name="passed" class="iconlike" />
            <div class="iconAuditNum" v-if="waitAuditShch">{{waitAuditShch}}</div>
          </div>
          <div class="icon-text">师承审核</div>
        </div>
      </div>

      <!-- 指导老师审核  页面入口 -->
      <div class="iconAllList" v-if="Global.userType == 3 || Global.userType == 7">
        <div class="icon1">
          <div @click="goAuditPage('病种/手术或技术操作审核',1)" class="icon-box">
            <div class="icon-img">
              <van-icon name="todo-list-o" class="iconlike" />
              <div
                class="iconAuditNum"
                v-if="auditNumRes.waitingAuditNum"
              >{{auditNumRes.waitingAuditNum}}</div>
            </div>
            <div class="icon-text">病种/手术或技术操作审核</div>
          </div>
        </div>
        <div class="icon1">
          <div @click="goAuditPage('教学活动审核',2)" class="icon-box">
            <div class="icon-img">
              <van-icon name="passed" class="iconlike" />
              <div
                class="iconAuditNum"
                v-if="auditNumRes.teachingActivitesWaitingAuditNum"
              >{{auditNumRes.teachingActivitesWaitingAuditNum}}</div>
            </div>
            <div class="icon-text">教学活动审核</div>
          </div>
        </div>
      </div>
      <section>
        <div class="section-title">我的科室学员轮转情况</div>
        <!--缺省图-->
        <div v-if="!homeDetails || !homeDetails.length " class="miss disFlex">
          <div class="lack disFlex">
            <img :src="imgUrl" alt />
            暂无学员信息
          </div>
        </div>
        <div v-if="homeDetails && homeDetails.length" class="miss">
          <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败"
            :finished="finished"
            finished-text
            @load="onLoad"
          >
            <div class="sectionBox flex1">
              <div
                class="section-content"
                v-for="(item,index) of homeDetails"
                :key="index"
                @click="goStaticDetail(item)"
              >
                <!--右侧内容区-->
                <div class="section-content-right">
                  <!--姓名信息-->
                  <div class="name info">
                    <ul class="name-audit info-flex">
                      <p class="frist-name">{{item.studentName}}</p>
                      <li>
                        【 已通过：
                        <span v-if="Global.userType == 3">{{item.allPassAuditNum}}</span>
                        <span v-if="Global.userType == 5">{{item.auditedNum}}</span>
                      </li>
                      <li class="vertical">|</li>
                      <li>
                        待审核：
                        <span
                          class="mark"
                          v-if="Global.userType == 3"
                        >{{item.allWaitingAuditNum}}</span>
                        <span class="mark" v-if="Global.userType == 5">{{item.waitAuditNum}}</span> 】
                      </li>
                    </ul>
                  </div>
                  <!--参培时间-->
                  <div class="time info">
                    <ul class="timestart info-flex">
                      <li>参培时间：</li>
                      <li>
                        <span v-if="Global.userType == 3">{{ item.trainStartTime}}</span>
                        <span v-if="Global.userType == 5">{{ item.startTime}}</span>
                      </li>
                      <li class="space">|</li>
                    </ul>
                    <ol class="major info-flex">
                      <li>专业:</li>
                      <li>{{item.majorName}}</li>
                    </ol>
                  </div>
                  <!--手术病种技能-->
                  <div class="entity info" v-if="Global.userType==3">
                    <ul class="entity-skill">
                      <li :class="{'activeTab':!item.diseasePassNum}" @click.stop="goStaticDetail(item,0)">
                        病种：
                        <span>{{item.diseasePassNum}}</span>
                      </li>
                      <li class="operation" :class="{'activeTab':!item.operationPassNum}" @click.stop="goStaticDetail(item,1)">
                        {{skill}}：
                        <span>{{item.operationPassNum}}/{{item.operationRequireNum}}</span>
                      </li>
                      <li :class="{'activeTab':!item.teachingActivitiesPassNum}" @click.stop="goStaticDetail(item,2)">
                        教学活动：
                        <span>{{item.teachingActivitiesPassNum}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "teacherHomeindex",
  data() {
    return {
      /*头部标题*/
      headTitle: "住培过程管理系统(中医)",
      copyUserType: 3,
      /*图标*/
      teachJson: {
        name: "teacherAudit",
        auditType: 3
      },
      iconList: [
        {
          id: 2,
          icon: "todo-list-o",
          imgUrl: require("../../../../assets/image/iconPortrait.jpg"),
          text: "病种/手术或技术操作审核",
          flag: true,
          name: "teacherAudit",
          auditType: 1
        },
        {
          id: 3,
          icon: "passed",
          imgUrl: require("../../../../assets/image/iconPortrait.jpg"),
          text: "教学活动审核",
          flag: true,
          name: "teacherAudit",
          auditType: 2
        }
      ],
      imgUrl: require("../../../../assets/image/defaultStudent.png"),
      homeDetails: [],

      slash: "/" /*手术病种技能的/ 示例  8/10*/,
      line: "-" /*手术技能为空时 表示为  "-"*/,
      disease: "病种",
      skill: "手术或技术操作",
      teaching: "教学活动",
      /*弹出框*/
      officeList: [],
      roleList: ["指导医师", "师承老师"],
      isRoleDialog: false,
      deptDialog: false,
      roleActive: "指导医师",
      auditNumRes: {}, //审核数量结果
      waitAuditShch: 0,
      test: false,
      isActive: false,
      perfectFlag: true, //完善信息标志,
      loading: false, //分页加载学员列表
      refesh: false,
      finished: false,
      error: false,
      pageIndex: 1 //当前页码
    };
  },
  computed: {},
  methods: {
      onClickLeft(){
          this.$dialog
              .confirm({
                  message: "确定要退出过程管理吗"
              })
              .then(() => {
                  if(this.isInApp()){
                      this.webApp.WebCallApp("TabbarShow", {}, (res) => {});
                      this.webApp.WebCallApp("CmdGoBack", {}, (res) => {});
                  }
              })
              .catch(() => {

              });
      },
    // 指导老师查询待审核数量
    teacherHmAudit() {
      let url = this.api.homeAuditNum;
      const postJson = {
        standardDepartmentId: this.Global.userInfo.standardDepartmentId
      };
      this.utils.ajax({
        method: "POST",
        data: postJson,
        url: url,
        success: res => {
          console.log(res);
          if (res.code == 0) {
            this.auditNumRes = res.data;
            this.$store.state.allNoticeNum = this.auditNumRes.allNoticeNum;
          }
        }
      });
    },
    // 师承老师查询待审核数量
    teachershChAudit() {
      let url = this.api.homeshChAuditNum;
      const postJson = {};

      this.utils.ajax({
        method: "POST",
        data: postJson,
        url: url,
        success: res => {
          if (res.code == 0) {
            this.waitAuditShch = res.data;
            console.log(this.waitAuditShch, "待审核----");
            this.$store.state.waitAuditShch = this.waitAuditShch;
          }
        }
      });
    },
    /*师承跳转*/
    goStaticDetail(item,status) {
      if(status===0 || status){
          this.$store.state.teachStatus = status;
      }
      if (this.Global.userType == 3) {
        this.$router.push({
          name: "staticdetail2",
          params: { itemData: item }
        });
      }
      if (this.Global.userType == 5) {
        this.$router.push({
          name: "teacherStaticDetails",
          params: { itemData: item }
        });
      }

      this.$store.dispatch("setNewTeachAuditStudentId", item);
    },
    onClickRight() {
      this.isRoleDialog = true;
    },
    goAuditPage(text, auditType) {
      this.$store.dispatch("setNewAuditType", auditType);
      this.Global.auditNameText = text;
      this.$router.push({ name: "teacherAudit" });
    },
    cancel() {
      this.isDialog = false;
      this.deptDialog = false;
    },
    selectDepartId(item, index) {
      this.Global.userInfo.standardDepartmentId = item.departmentId;
      // 指导老师获取学员
      this.getStudentRotation();
      this.cancel();
    },
    checkActive(item) {
      let deptId = this.Global.userInfo.standardDepartmentId;
      if (deptId) {
        return deptId == item.departmentId;
      }
    },
    getActiveShow(item,index){
       let roleType;
       //3 指导老师， 5师承老师
       if(item == "师承老师" ){
          roleType = 5;
       }else{
          roleType = 3;
       }
       return roleType == this.Global.userType;
    },
    headGoPage(item, index) {
      this.roleActive = item;
      //  roleList: ["指导医师", "师承老师"],
      if (index == 0) {
        this.Global.userType = 3;
        this.$store.state.stateStatic = 3;
      } else {
        this.Global.userType = 5;
        this.$store.state.stateStatic = 5;
      }
      this.isRoleDialog = false;
      this.pageInit();
    },
    // 待审核 0,审核通过 1
    goAwaitPage() {
      this.$router.push({ name: "teacherAudit", params: { type: 0 } });
    },
    goAlreadyPage() {
      this.$router.push({ name: "teacherAudit", params: { type: 1 } });
    },
    // 先完善信息
    checkUserDetail() {
      const url = this.api.checkUserDetail;
      let promise = new Promise((resolve, reject) => {
        this.utils.ajax({
          url: url,
          method: "POST",
          success: res => {
            if (res.code == 0) {
              this.perfectFlag = res.result;
              resolve(res.result);
            } else {
              this.$toast(res.msg);
              reject(res.result);
            }
          }
        });
      });
      return promise;
    },
    selectDeparmentS() {
      const url = this.api.getUserRelation;
      return new Promise((resolve, reject) => {
        this.utils.ajax({
          url: url,
          method: "POST",
          success: res => {
            console.log(res);
            if (res.code == 0 && res.result) {
              // 获取默认科室id
              if (res.result.id) {
                this.Global.userInfo.standardDepartmentId = res.result.id;
              }
              this.officeList = res.result.relationList;
              // 多科室时才弹窗
              if (this.officeList && this.officeList.length >= 2) {
                resolve(true);
              } else {
                this.Global.userInfo.standardDepartmentId = this.officeList[0].departmentId;
                resolve(false);
              }
            }
          }
        });
      });
    },
    onLoad() {
      // 查询列表
      this.getStudentList();
    },
    getStudentList() {
      // 指导老师
      if (this.Global.userType == 3) {
        this.getStudentRotation();
      }
      //  师承老师
      if (this.Global.userType == 5) {
        this.teaChList();
      }
    },
    // 指导老师获取学生轮转科室列表
    getStudentRotation() {
      this.loading = true;
      const url = this.api.getStudentRotation;
      const postJson = {
        standardDepartmentId: this.Global.userInfo.standardDepartmentId,
        pageIndex: this.pageIndex,
        pageSize: 5
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          this.loading = false;
          this.pageIndex = res.data.page + 1;
          console.log(res);
          if (res.code == 0 && res.data) {
            this.homeDetails = this.homeDetails.concat(res.data.result);
          } else {
            this.error = true;
            this.$toast(res.msg);
          }
          if (
            res.data.page === res.data.totalPage ||
            res.data.totalPage === 0
          ) {
            this.finished = true;
          }
        }
      });
    },
    // 获取师承学生列表
    teaChList() {
      const url = this.api.teaChstudList;
      const postJson = {};
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          console.log(res);
          if (res.code == 0 && res.data) {
            this.homeDetails = res.data;
          } else {
            this.$toast(res.msg);
          }
          this.loading = false;
          this.finished = true;
        }
      });
    },
    wanShanDialog() {
      this.$dialog
        .alert({
          title: "请您先完善个人信息",
          message: '完善个人信息后可进行其他操作,\n请点击下方"去完善"',
          confirmButtonText: "去完善",
          className: "perfect"
        })
        .then(() => {
          this.$router.push({ name: "teacherPerfecInfo" });
        });
    },
    async pageInit() {
      //userType =3,指导老师 5 师承老师  7多身份
      //指导老师登录，完善信息，选择科室，查询学员
      //师承老师登录，完善信息，查询学员
      //多身份登录，默认指导老师页面，完善信息，选择身份弹窗，
      // 共同点 都完善信息，完善后，
      let checkFlag = true;
      this.pageIndex = 1;
      this.homeDetails = [];
      // let userType = this.Global.userType;

      checkFlag = await this.checkUserDetail(); //是否完善信息
      console.log(checkFlag);
      if (checkFlag) {
        //需要完善信息,跳转页面
        this.wanShanDialog();
        return;
      }
      if (this.Global.userType == 7) {
        this.isRoleDialog = true;
        return;
      }

      // 指导老师
      if (this.Global.userType == 3) {
        checkFlag = await this.selectDeparmentS(); //多科室选择，查询学生 多个时才选择 true弹窗
        if (checkFlag) {
          this.deptDialog = true; //多科室弹窗选择
          return;
        }
        // 获取待审核数量
        this.teacherHmAudit();
        this.getStudentRotation();
      }

      // 师承老师
      if (this.Global.userType == 5) {
        this.teachershChAudit();
        this.teaChList();
      }
    }
  },
  created() {
    this.$store.dispatch("setNewNum", 0);
    this.pageInit();
      let url =  window.location.href;
      this.$store.state.urlObj = this.utils.urlObj(url);
      if( this.$store.state.urlObj){
          this.$store.state.token = this.$store.state.urlObj.token;
          this.$store.state.imei = this.$store.state.urlObj.imei
          this.$store.state.project = this.$store.state.urlObj.project
          this.$store.dispatch("setNewToken", this.$store.state.token);
          this.$store.dispatch("setNewImei",  this.$store.state.imei);
          this.$store.dispatch("setNewProject",this.$store.state.project)
          console.log(this.$store.state.token,"token存在", this.$store.state.imei,this.$store.state.project )
      }


  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to th
;';is component only -->
<style scoped>
.wrapper /deep/ .van-nav-bar .van-icon-exchange {
  color: #a083e0;
  font-size: 18px;
}
/*整个页面*/
.wrapper {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
/*图标区*/
.iconAllList {
  width: 100%;
  height: 150px;
  display: flex;
  background: #fff;
  padding-top: 15px;
  box-sizing: border-box;
}
.icon1 {
  width: 50%;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-img {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #a083e0;
  margin-bottom: 5px;
  font-size: 40px;
  color: #fff;
  border-radius: 50%;
}
.iconAuditNum {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 10px;
  background: red;
  font-size: 12px;
}
/*师承审核图标*/
.audit-content {
  /*  padding:0 0.9375rem;*/
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.audit-content .icon-img {
  width: 66px;
  height: 66px;
  margin: 0 auto 5px;
}
/*内容区标题  我的科室学员轮转情况*/
/*section*/
section {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #f2f2f2;
}
/*内容区主干*/
.sectionBox {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.section-title {
  width: 100%;
  padding: 0 0.9375rem;
  box-sizing: border-box;
  text-align: left;
  font-size: 14px;
  color: #666;
  height: 40px;
  line-height: 40px;
  background: #f2f2f2;
}
.section-content {
  width: 100%;
  height: 123px;
  background: #fff;
  margin-bottom: 12px;
  padding: 20px 0.9375rem;
  box-sizing: border-box;
}

.section-content-right {
  padding-top: 10px;
  box-sizing: border-box;
}

/*手术病种技能*/
.entity-skill {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.entity-skill li {
  min-width: 76px;
  height: 20px;
  border-radius: 10px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  /* background: #a083e0; */
  background: #58a3f7;
  padding: 0 5px;
}

.operation {
  flex: 1;
  margin: 0 7px;
}

.entity-skill .activeTab {
  background: #ccc;
}

/*提取公共样式 */
.info {
  display: flex;
  font-size: 12px;
}

.info-flex {
  display: flex;
}
.name {
}
/*姓名信息*/
.frist-name {
  font-size: 18px;
  color: #333;
}

.name-audit {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.name-audit span {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.name-audit .mark {
  color: #ed5e4c;
}

.name-audit .vertical {
  padding: 0 0.9rem;
}

/*参培时间*/
.time {
  width: 100%;
  margin: 10px 0 15px;
}

.timestart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  color: #666;
}

.space {
  margin: 0 10px;
}
/*缺省图片*/
.miss {
  width: 100%;
  height: calc(100% - 40px);
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.lack {
  width: 220px;
  height: 180px;
  flex-direction: column;
  font-size: 18px;
  color: #999;
}

.lack img {
  width: 100%;
}

/*弹出框*/
.shade {
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dialog {
  width: 182px;
  height: 124px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  position: absolute;
  top: -182px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  opacity: 1;
  z-index: 2000;
}
.dialog-content-box {
  display: flex;
  width: 100%;
  height: 124px;
  background: #fff;
  flex-direction: column;
  align-items: flex-start;

  justify-content: space-evenly;
  padding: 0 10px;
  font-size: 13px;
  box-sizing: border-box;
}

.dialog-content-text {
  width: 100%;
  text-align: center;
}

.dialog-content-text:nth-of-type(1) {
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
  box-sizing: border-box;
}

.dialog-content-text:nth-of-type(2) {
  box-sizing: border-box;
  padding-bottom: 6px;
  border-bottom: 1px solid #ccc;
}

.active {
  color: #a083e0;
}
</style>
