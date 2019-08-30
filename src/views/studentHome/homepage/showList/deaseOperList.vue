<template>
  <div class="wrapper">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="goPage(1)"
    >
      <van-button @click="goPage(2)" v-if="isShowSaveBtn" size="small" slot="right" class="btnSave">录入</van-button>
    </van-nav-bar>
    <div class="DetailsContent">
      <!-- 轮转时间 -->
      <div
        style="font-size: 14px;color: #666;line-height: 25px;"
        v-if="deptType == 1"
      >{{currentItem.currentRotationStartTime}}——{{currentItem.currentRotationEndTime}}</div>
      <!--  三个标签页-->
      <van-tabs type="card" class="header-nav" v-model="activeTab" @change="changeTab">
        <!-- 标签标题-->
        <van-tab :title="item" v-for="(item,index) in tabsTitle" :key="index"></van-tab>
      </van-tabs>
      <div class="contentBox" :class="{'contentBoxAll':deptType == 2}">
        <!-- 标签页内容区-->
        <!--缺省图-->
        <div
          v-if="(activeTab==0&&!deaseList.length)||(activeTab==1&&!operateList.length)"
          class="lose-img-box"
        >
          <div class="img-box">
            <img src="../../../../assets/image/defalutRotate.png" alt>
          </div>
          <p class="img-text">暂无信息</p>
        </div>

        <div class="nav-content" v-show="activeTab==0">
          <div>
            <div class="noPassBox" v-if="deaseAttach && deaseAttach>0">
              <span>
                有{{deaseAttach}}例 [病种] 未通过,
                <i @click.once="lookNopass()">点击查看</i>
              </span>
              <van-icon name="clear" class="fr closeNopass" @click="closeNopass()"/>
            </div>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="deaseList.length != 0 ? '没有更多了' : ''"
            :error.sync="error"
            error-text=""
            @load="onLoad"
          >
            <div v-for="(item,index) in deaseList" :key="index">
              <div class="submit-time">
                <div class="submit-time-all time-second">
                  <ul class="submit-time-left">
                    <van-icon name="todo-list-o" size="16"/>
                    <li>提交时间：</li>
                    <li>{{item.createTime}}</li>
                    <li>|</li>
                  </ul>
                  <ol class="time-second-right">
                    <li class="fl">
                      <span style="color:#FE9400;" v-if="item.auditState == 0">【待审核】</span>
                      <span style="color:#3CC16C;" v-if="item.auditState == 1">【已通过】</span>
                      <span v-if="item.auditState == 2">【未通过】</span>
                    </li>
                    <li class="modifyBtn_li fr">
                      <van-button
                        v-if="item.auditState == 0"
                        @click="goModify(item)"
                        class="btnSave"
                      >修改</van-button>
                    </li>
                    <!-- 是否属实 -->
                    <li class="nottrue" v-if="item.auditState ==2"></li>
                  </ol>
                </div>
              </div>
              <ul class="office-message">
                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditState !=0">
                  <div>审核人:</div>
                  <p>{{item.auditByName}}</p>
                </li>

                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditState !=0">
                  <div>审核时间:</div>
                  <p>{{item.auditTime}}</p>
                </li>

                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditState !=0 && item.auditReason">
                  <div>审核意见:</div>
                  <p>{{item.auditReason}}</p>
                </li>

                <li>
                  <div>科室:</div>
                  <p>{{item.departmentName}}</p>
                </li>

                <li>
                  <div>类型:</div>
                  <p>{{item.accessModeTitle}}</p>
                </li>

                <!-- <li>
                    <div>病种:</div>
                    <p>{{item.mainDiseaseName}}</p>
                </li>-->

                <li v-if="item.accessModeTitle != '急诊' && item.accessModeTitle != '门诊' ">
                  <div>书写大病历:</div>
                  <p>{{item.writeMajorMedicalRecordTitle}}</p>
                </li>

                <li v-if="item.accessModeTitle != '急诊' && item.accessModeTitle != '门诊' ">
                  <div>是否全程管理:</div>
                  <p>{{item.manageWholeProcessTitle}}</p>
                </li>

                <li>
                  <div>{{item.accessModeTitle != '急诊' && item.accessModeTitle != '门诊'? '入院时间':'就诊时间'}}:</div>
                  <p>{{item.accessMode == 3 ? item.inHospitalTime:item.visitTime}}</p>
                </li>
                <li>
                  <div>病历号:</div>
                  <p>{{item.medicalRecordNo}}</p>
                </li>
                <li>
                  <div>病人姓名:</div>
                  <p>{{item.patientName}}</p>
                </li>
                <li>
                  <div>主要诊断:</div>
                  <p>{{item.mainDiseaseName == '其他' ? item.mainOtherDiseaseName : item.mainDiseaseName}}</p>
                </li>
                <li v-for="(i,index1) in item.secondaryDiseaseList" :key="index1">
                  <div>次要诊断{{index1+1}}:</div>
                  <p>{{i.secondaryDiseaseName == '其他' ? i.secondaryOtherDiseaseName : i.secondaryDiseaseName}}</p>
                </li>
              </ul>
            </div>
          </van-list>
        </div>
        <div class="nav-content" v-show="activeTab==1">
          <div>
            <div class="noPassBox" v-if="operationAttach && operationAttach>0">
              <span>
                有{{operationAttach}}例 [手术] 未通过,
                <i @click.once="lookNopass()">点击查看</i>
              </span>
              <van-icon name="clear" class="fr closeNopass" @click="closeNopass()"/>
            </div>
          </div>
          <van-list
            v-model="loading1"
            :finished="finished1"
            :finished-text="operateList.length != 0?'没有更多了': ''"
            :error.sync="error1"
            error-text=""
            @load="onLoad1"
          >
            <div v-for="(item,index) in operateList" :key="index">
              <div class="submit-time">
                <div class="submit-time-all time-second">
                  <ul class="submit-time-left">
                    <van-icon name="todo-list-o"/>
                    <li>提交时间：</li>
                    <li>{{item.createTime}}</li>
                    <li>|</li>
                  </ul>
                  <ol class="time-second-right">
                    <li class="audit-li">
                      <span style="color:#FE9400;" v-if="item.auditState == 0">【待审核】</span>
                      <span style="color:#3CC16C;" v-if="item.auditState == 1">【已通过】</span>
                      <span v-if="item.auditState == 2">【未通过】</span>
                    </li>
                    <li class="modifyBtn_li">
                      <van-button
                        v-if="item.auditState == 0"
                        @click="goModify(item)"
                        class="btnSave"
                      >修改</van-button>
                    </li>
                    <!-- 是否属实 -->
                    <li class="nottrue" v-if="item.auditState ==2"></li>
                  </ol>
                </div>
              </div>
              <ul class="office-message1">
                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditByName">
                  <div>审核人:</div>
                  <p>{{item.auditByName}}</p>
                </li>
                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditTime">
                  <div>审核时间:</div>
                  <p>{{item.auditTime}}</p>
                </li>
                <li :class="item.auditState ==2? 'nottrue-li': ''" v-if="item.auditReason">
                  <div>审核意见:</div>
                  <p>{{item.auditReason}}</p>
                </li>

                <li>
                  <div>科室:</div>
                  <p>{{item.departmentName}}</p>
                </li>

                <!-- <li>
                    <div>手术名称:</div>
                    <p>{{item.operationName}}</p>
                </li>-->

                <li>
                  <div>手术角色:</div>
                  <p>
                    <i v-if="item.operationRole ==1">主刀</i>
                    <i v-if="item.operationRole ==2">助手</i>
                  </p>
                </li>
                <li>
                  <div>手术/操作时间:</div>
                  <p>{{item.operationTime}}</p>
                </li>
                <li>
                  <div>病历号:</div>
                  <p>{{item.medicalRecordNo}}</p>
                </li>
                <li>
                  <div>病人姓名:</div>
                  <p>{{item.patientName}}</p>
                </li>
                <li>
                  <div>主要手术或技术操作:</div>
                  <p>{{item.operationName=="其他"?item.otherOperationName:item.operationName}}</p>
                </li>
                <li v-for="(item,index1) in item.secondaryOperationList" :key="index1">
                  <div>次要手术或技术操作{{index1+1}}:</div>
                  <p>{{item.secondaryOperationName=='其他'?item.secondaryOtherOperationName:item.secondaryOperationName}}</p>
                </li>
              </ul>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "deaseOperList",
  data() {
    return {
      deaseAuditState: -1,
      operationState: -1,
      hasLoadJson: {
        0: true,
        1: false,
      },
      finished: false,
      finished1: false,
      loading: false,
      loading1: false,
      error: false,
      error1: false,
      activeTab: 0,
      page: 1,
      page1: 1,
      title: "病种/手术或技术操作",
      // 当前科室1，全部科室2,默认为2，查询全部
      deptType: 2,
      currentDepartId: null,
      time: "",
      tabsTitle: ["病种", "手术或技术操作"],
      allDeptStatic: [
        {
          dataTypeName: "病种",
          showNum: "(0/0)"
        },
        {
          dataTypeName: "手术或技术操作",
          showNum: "(0/0)"
        }
      ],
      deaseAttach: 0,
      skillAttach: 0,
      operationAttach: 0,
      // 病种
      deaseList: [],
      skillList: [],
      operateList: [],
      currentItem: this.Global.currentItem,
      isShowSaveBtn: false,
      deaseListPagePre: 1,
    };
  },
  created() {
      this.activeTab = this.$store.state.status;
    this.currentItem = this.Global.currentItem;
    this.deptType = this.Global.currentItem.depDetailType;
    // 当前科室1，全部科室2
    if (this.deptType == 1) {
      this.title = this.Global.currentItem.departmentName;
      this.currentStatistics();
    } else {
      this.title = "病种/手术或技术操作";
      this.recordStatistics();
    }
    //获取前一个页面
    this.deaseListPagePre = this.$store.state.deaseListPagePre;

    this.isShowSave();
  },
  mounted(){
    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;
  },
  computed: {
    getDate() {
      let mydate = new Date();
      let onedate = mydate.toLocaleString("chinese", { hour12: false });
      let reg = /\/+/g;
      this.time = onedate.replace(reg, "-");
    },
  },
  methods: {
    isShowSave() {
      let url = this.api.systemCurrentTime;
      const that = this;
      this.utils.ajax({
        url: url,
        method: "POST",
        success: res => {
          if (res.code == 0) {
            const currentTime = res.data;
            // 获取当前轮转计划开始时间，结束时间
            let startTime = that.currentItem.currentRotationStartTime;
            let endTime = that.currentItem.currentRotationEndTime;
            if (currentTime && startTime && endTime) {
              startTime =new Date(startTime.replace(/-/g, '/'));
              endTime =new Date(endTime.replace(/-/g, '/'));
              endTime.setHours(23,59,59);
              if (startTime.getTime() <= currentTime && endTime.getTime() >= currentTime) {
                that.isShowSaveBtn = true;
              } else {
                that.isShowSaveBtn = false;
              }
            } else {
              that.isShowSaveBtn = false;
            }
          } else {
            this.$toast(res.msg);
          }
        }
      });
    },
    closeNopass() {
      if (this.activeTab == 0) {
        this.deaseAttach = 0;
      }
      if (this.activeTab == 1) {
        this.operationAttach = 0;
      }
    },
    goPage(type) {
      if (type == 1) {
        // deaseListPagePre==1 首页进入 ==2 轮转计划进入
        if(this.deaseListPagePre == 2){
           this.$router.push({ path: "/studentHome/relationDetail" });
        }else{
           this.$router.push({ path: "/studentHome/homeindex" });
        }
      }
      // 录入
      if (type == 2) {
        this.$router.push({ path: "/studentHome/CaseOper" });
      }
    },
    goModify(item) {
      let modifyJson = {
        type: this.activeTab,
        id: item.id
      };
      this.$store.dispatch("setNewDeaseModifyJson", modifyJson);
      this.$router.push({
        name: "CaseOperModify"
      });
    },
    // 当前科室录入统计
    currentStatistics() {
      //直接取首页的轮转id
      let currentId = this.Global.currentItem.currentScheduleId || 0;
      if (!currentId) {
        this.$toast("当前无轮转计划");
        return;
      }
      let url = this.api.recordStatisticsOfSchedule + "/" + currentId;
      const postJson = {};
      console.log(url);
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            if (!res.data || !res.data.studentRecordStatisticsPerTypeVOList) {
              this.$toast(res.msg);
              return;
            }
            this.showTabStatic(res.data.studentRecordStatisticsPerTypeVOList);
          } else {
            this.$toast(res.msg);
          }
        }
      });
    },
    // 全部科室录入统计
    recordStatistics() {
      const url = this.api.recordStatistics;
      const postJson = {};
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.showTabStatic(res.data);
          } else {
            this.$toast(res.msg);
          }
        }
      });
    },

    showTabStatic(staticResult) {
      if (!staticResult) return;
      this.allDeptStatic = staticResult;
      let titles = ["病种", "手术或技术操作"];
      this.allDeptStatic = this.allDeptStatic.map(item => {
        let arrIndex = 0;
        let indexJson = { 1: 0, 3: 1 };
        arrIndex = indexJson[item.dataType];
        titles[arrIndex] +=
          " (" +
          (item.passNum || 0) +
          "/" +
          (item.requireRecordNum || "-") +
          ")";
      });
      this.$nextTick(() =>{
          this.tabsTitle = titles;
      })
    },
    lookNopass() {
      //查看未通过的
      //1,首先查询全部，点击未通过的,auditState传2，再点击还传2
      //点击未通过的，finished1 = true,再点击，finished1= false,触发 onload1方法。
      if (this.activeTab == 0 && this.deaseAuditState == -1) {
        this.deaseList =[];
        this.deaseAuditState = 2; //审核状态

        this.page = 1;
        this.error = false;
        this.finished = true;//防止立即出发onload事件
        this.getDeaseList();
      }
      if (this.activeTab == 1 && this.operationState == -1) {
        this.operateList = [];
        this.operationState =2;//审核状态

        this.page1 = 1;
        this.error1 = false;
        this.finished1 = true; //防止立即出发onload事件
        this.getOperateList();
      }
    },
    onLoad() {
      this.getDeaseList();
    },
    // 获取病种录入列表
    getDeaseList() {
      const url = this.api.deaseList;
      const postJson = {
        departmentId: this.Global.currentItem.currentDepartId,
        auditState: this.deaseAuditState,//-1 全部，2 未通过
        showUnPassedNumFlag: 1,
        pageIndex: this.page,
        pageSize: 10
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          this.loading= false;
          if (res.code == 0) {
            this.page = res.data.page + 1;
            if (res.data.result) {
              this.deaseAttach = res.data.attach;
              this.deaseList = this.deaseList.concat(res.data.result);
            }
            if(res.data.page == res.data.totalPage || res.data.totalPage === 0){
              this.finished = true;
            }else{
              this.finished = false;
            }
          } else {
            this.finished1 = true;
            this.error = true;
          }
        }
      });
    },
    changeTab(index, title) {
      console.log(index, title);
      if (index == 1 && !this.hasLoadJson[1] ) {
        this.hasLoadJson[1] = true;
        this.getOperateList();
      }
    },
    onLoad1() {
      console.log(this.finished1);
      this.getOperateList();
    },
    // 获取手术录入列表, flag = true,查询未通过的
    getOperateList() {
      const url = this.api.operateList;
      const postJson = {
        departmentId: this.Global.currentItem.currentDepartId,
        auditState: this.operationState,
        showUnPassedNumFlag: 1,
        pageIndex: this.page1,
        pageSize: 10
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          console.log(res);
          this.loading1= false;
          if (res.code == 0) {
            this.page1 = res.data.page + 1;
            this.operateList = this.operateList.concat(res.data.result);
            this.operationAttach = res.data.attach;
            if(res.data.page == res.data.totalPage || res.data.totalPage === 0){
              this.finished1 = true;
            }else{
              this.finished1 = false;
            }
          } else {
            this.finished1 = true;
            this.error1 = true;
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
i {
  font-style: normal;
}
.van-icon-todo-list-o {
  font-size: 18px;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #f2f2f2;
}
.contentBox {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.contentBoxAll{
  top: 42px;
}
.wrapper /deep/ .van-cell {
  text-align: left;
}
.wrapper /deep/ .van-cell span {
  font-size: 14px;
}
.wrapper /deep/ .van-hairline--surround {
  height: 0;
}
.wrapper /deep/.van-password-input {
  margin: 0 auto;
}
.noPassBox {
  width: 100%;
  height: 35px;
  line-height: 35px;
  margin-top: 8px;
  background-color: #fff5e6;
  font-size: 14px;
  text-align: left;
  padding-left: 20px;
  color: red;
}
.noPassBox i {
  display: inline-block;
  text-decoration: underline;
}
.closeNopass {
  margin-right: 6px;
  margin-top: 8px;
  font-size: 15px;
  color: #adaba8;
}
.DetailsContent {
  position: absolute;
  width: 100%;
  top: 46px;
  bottom: 0;
  box-sizing: border-box;
  background: #f2f2f2;
  padding: 10px 10px;
  z-index: 1;
}

.submit-time {
  display: flex;
  margin-top: 12px;
  background: #666;
  opacity: 1;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.submit-time-all {
  width: 100%;
  font-size: 12px;
  display: flex;
  padding: 5px 0;
  box-sizing: border-box;
}
.submit-time-left {
  width: 60%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
}
.submit-time-left li:nth-of-type(3) {
  color: #afc5c5;
}
.audit-li {
}
.modifyBtn_li button {
  min-width: 50px;
  height: 30px;
  line-height: 28px;
}
.header-nav {
  height: 100%;
  z-index: 5;
}
.DetailsContent .nav-content {
  width: 100%;
  height: 100%;
  padding: 0 8px 30px;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
/* tab 内容区域 */
.DetailsContent /deep/ .van-tabs__content {
  position: absolute;
  top: 30px;
  bottom: 0;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.office-message {
  width: 100%;
  background: #fff;
  color: #666;
}
.office-message li {
  display: table;
  width: 100%;
  border: 1px solid #ccc;
  border-bottom: none;
  font-size: 12px;
  min-height: 36px;
}
.office-message li:last-of-type {
  border-bottom: 1px solid #ccc;
}
.office-message li div {
  width: 40%;
  display: table-cell;
  vertical-align: middle;
}
.office-message li p {
  width: 60%;
  display: table-cell;
  vertical-align: middle;
  border-left: 1px solid #ccc;
}
/*手术或技术操作*/
.office-message1 {
  width: 100%;
  background: #fff;
  color: #666;
}
.office-message1 li {
  display: table;
  width: 100%;
  border: 1px solid #ccc;
  border-bottom: none;
  font-size: 12px;
  min-height: 36px;
}
.office-message1 li:last-of-type {
  border-bottom: 1px solid #ccc;
}
.office-message1 li div {
  width: 40%;

  display: table-cell;
  vertical-align: middle;
}
.office-message1 li p {
  width: 40%;
  display: table-cell;
  vertical-align: middle;
  border-left: 1px solid #ccc;
}

.nottrue {
  line-height: 1.875rem;
  font-size: 14px;
  text-align: left;
  height: 1.875rem;
  text-indent: -3px;
}
.nottrue::before {
  content: "不属实";
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 40px 40px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  position: absolute;
  transform: rotate(-315deg) scale(0.8);
  right: -42px;
  top: 8px;
  width: 60px;
}
.nottrue-li {
  background-color: #fff5e6;
}
.nottrue-li>p{
  color: #ff0000;
}
.nottrue-font {
  color: #ff0000;
}
.time-second {
  position: relative;
}
.time-second-right {
  display: flex;
  width: 40%;
  line-height: 30px;
  color: #fff;
}
.time-second-right .fl {
  width: 50%;
  color: #fff;
}
.modifyBtn_li {
  width: 50%;
}
.notice {
  font-size: 12px;
  height: 2rem;
  justify-content: center;
  margin-top: 10px;
  color: #ff0000;
}
.audit {
  color: #a083e0;
}

/*缺省图*/
.lose-img-box {
  position: absolute;
  top: 25%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  color: #ccc;
}
</style>
