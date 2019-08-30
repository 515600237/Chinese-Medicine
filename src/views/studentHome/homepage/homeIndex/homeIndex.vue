<template>
  <div class="wrapper">
    <!--头部-->
    <van-nav-bar
            title="住培过程管理系统(中医)"
            class="studentHeader"
            left-arrow
            @click-left="onClickLeft"
    >
         <!-- 未读消息数量 -->
        <van-icon name="bell" slot="left" :info="noReadNum" @click.native="goNewsList()" v-if="false"></van-icon>
        <p slot="right" class="headRight">入培第<span class="headDay">{{stuResult.enterTrainingDayNum}}</span>天</p>
    </van-nav-bar>

    <!--****************当前轮转科室*****************-->
    <div class="homeCtBox disFlex" :class="{'hasSwiper':swiperList&&swiperList.length}">
      <!--*************图标区*******************-->
      <div class="iconAll">
        <div class="icon1"
             v-for="(item,index) of iconList"
             @click="toPage(item,index)" :key="index">
          <div class="icon-img">
            <van-icon :name="item.icon" class="iconlike"/>
          </div>
              <div class="icon-text">{{item.text}}</div>
        </div>
      </div>

      <van-tabs type="card" color class="listContentBox flex1 disFlex" van-hairline--surround>
        <!--当前轮转科室-->
        <van-tab title="当前轮转科室" >
          <div style="padding-top:8px" v-if="stuResult.currentRotationScheduleId">
                <!--第一阶段-->
              <van-row type="flex"
                   justify="space-between"
                   align="bottom"
                   class="absence"
                   >
                <van-col class="textColor" v-if="stuResult.currentStage">
                  {{stuResult.currentStage}}
                </van-col>
              </van-row>
          <!--日期-->
          <van-row type="flex" class="startDay">
          <van-col >
            <van-icon
                    name="calender-o"
            />
            {{stuResult.currDepartStartTime}}----{{stuResult.currDepartEndTime}}
          </van-col>
          </van-row>
          <!--中医科室-->
          <div class="title_large ">
            <van-row class="title-text">
              <van-col span="16" >
                {{stuResult.currentDepartName}}
              </van-col>
            </van-row>
          </div>

          <!--当前科室-->
          <!--***********病种完成情况***************-->
          <div class="Disease" ref="disease" @click="goCurrentDep(1,0)">
            <h5 class="title_small textColor">病种完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6" @click.native="goCurrentDep(1,0)">
                <p>
                  <span>{{stuResult.currDepartDiseaseCompleteCase}}</span>
                </p>
                <p>录入例数</p>
              </van-col>
            </van-row>
          </div>

          <!--***************手术和技术操作******************-->
          <div class="Disease" @click="goCurrentDep(1,1)">
            <h5 class="title_small textColor ">手术或技术操作完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6" @click.native="goCurrentDep(1)">
                <p>
                  <span>{{stuResult.currDepartOperationCompleteCase}}</span>/
                  {{stuResult.currDepartOperationRequireCase}}
                </p>录入例数
              </van-col>
              <van-col span="6" @click.native="goCurrentDep(1,1)">
                <p>
                  <span>{{stuResult.currDepartOperationCompleteCaseRate>=0?stuResult.currDepartOperationCompleteCaseRate:'-'}}%</span>
                </p>
                <p>完成率</p>
              </van-col>
              <van-col span="6"></van-col>
            </van-row>
          </div>
          <!--******************教学活动完成情况********************-->
          <div class="Disease" @click="goTeachActive(1)">
            <h5 class="title_small textColor ">教学活动完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.currDiscussionNum>=0 ?stuResult.currDiscussionNum:'-'}}</span>
                </p>病历讨论
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.currTeachingNum>=0?stuResult.currTeachingNum:"-"}}</span>
                </p>教学查房
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.currSeminarNum>=0?stuResult.currSeminarNum:'-'}}</span>
                </p>培训讲座
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.currTrainNum>=0?stuResult.currTrainNum:'-'}}</span>
                </p>技能训练
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.currSimulationNum>=0?stuResult.currSimulationNum:'-'}}</span>
                </p>模拟教学
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.currPracticeNum>=0?stuResult.currPracticeNum:'-'}}</span>
                </p>院外实践
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.allOtherNum>=0?stuResult.allOtherNum:'-'}}</span>
                </p>其他
              </van-col>
            </van-row>
          </div>
        </div>
          <div class="currentBox" v-if="!stuResult.currentRotationScheduleId">
             <div class="img-box">
                <img :src="imgUrl" alt>
                <p>当前无轮转计划</p>
             </div>
          </div>
        </van-tab>

        <!--*****************全部科室内容***************-->
        <van-tab title="全部轮转科室" >
          <van-row type="flex" justify="space-between" class="absence">
            <h2 class="title_large title-sec">
              已轮转科室
              <b>{{stuResult.completeRotatedDepartNum}}</b>
            </h2>
            <van-col span="8" v-if="false">
              缺勤天数:
              <span>{{stuResult.allDepartAbsenceDaysNum}}天</span>
            </van-col>
          </van-row>

          <!--内容区-->
          <div class="Disease" @click="goPage('masterList')">
            <h5 class="title_small">师承完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.mentorAttendanceRecordNum>=0?stuResult.mentorAttendanceRecordNum:'-'}}</span>
                </p>跟师考勤
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.mentorDiagnosticRecordNum>=0?stuResult.mentorDiagnosticRecordNum:'-'}}</span>
                </p>临床医案
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.mentorStudyRecordNum>=0?stuResult.mentorStudyRecordNum:'-'}}</span>
                </p>跟师笔记
              </van-col>
            </van-row>
          </div>
          <div class="Disease" @click="goCurrentDep(2)">
            <h5 class="title_small">病种完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6" >
                <p>
                  <span>{{stuResult.allDepartDiseaseCompleteCase}}</span>
                </p>
                录入例数
              </van-col>
            </van-row>
          </div>
          <!-- 手术和技术操作 -->
          <div class="Disease" @click="goCurrentDep(2)">
            <h5 class="title_small">手术或技术操作完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.allDepartOperationCompleteCase}}</span>/
                  {{stuResult.allDepartOperationRequireCase}}
                </p>录入例数
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.allDepartOperationCompleteCaseRate}}%</span>
                </p>完成率
              </van-col>
              <van-col span="6">
                <p>
                  <span></span>
                </p>
              </van-col>
            </van-row>
          </div>

          <div class="Disease" @click="goTeachActive(2)">
            <h5 class="title_small textColor ">教学活动完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.allDiscussionNum>=0?stuResult.allDiscussionNum:'-'}}</span>
                </p>病历讨论
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.allTeachingNum>=0?stuResult.allTeachingNum:"-"}}</span>
                </p>教学查房
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.allSeminarNum>=0?stuResult.allSeminarNum:'-'}}</span>
                </p>培训讲座
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.allTrainNum>=0?stuResult.allTrainNum:'-'}}</span>
                </p>技能训练
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.allSimulationNum>=0?stuResult.allSimulationNum:'-'}}</span>
                </p>模拟教学
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{stuResult.allPracticeNum>=0?stuResult.allPracticeNum:'-'}}</span>
                </p>院外实践
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{stuResult.allOtherNum>=0?stuResult.allOtherNum:'-'}}</span>
                </p>其他
              </van-col>
            </van-row>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: "homeindex",
  data() {
    return {
      day:135,
      imgUrl:require('../../../../assets/image/defaulTentering.png'),
      stuResult:{
        currDepartStartTime:'',/*开始时间*/
        currDepartEndTime:"",/*结束时间*/
        currDepartSkillCompleteCase:0,/*技能录入例数*/
        currDepartSkillRequireCase:0,/*技能最低例数*/
        currDepartDiseaseCompleteCase:0,/*病种例数*/
        currDepartDiseaseRequireCase:0,/*病种例数*/
        currDepartDiseaseCompleteCaseRate:"0",/*完成率*/
        currentDepartName:"",/*科室*/
        currDepartOperationCompleteCaseRate:"0",/*教学查房和模拟教学*/
        currDepartOperationCompleteCase:0,//病历讨论、技能训练 复制的所以一样
        completeRotatedDepartNum:"0",/*全部科室*/
        allDepartDiseaseCompleteCase:"0",
        allDepartSkillCompleteCase:"0",
        allDepartSkillRequireCase:0,
        allDepartSkillCompleteCaseRate: "0",
        allDepartOperationCompleteCaseRate:0,
        allDepartOperationCompleteCase: 0,
      },

      iconList:[
        {
          id:1,
          icon:"todo-list-o",
          imgUrl:require('../../../../assets/image/iconPortrait.jpg'),
          text:"查看轮转计划"
        },
        {
          id:2,
          icon:"records",
          imgUrl:require('../../../../assets/image/iconPortrait.jpg'),
          text:"录入病种/手术或技术操作"
        },
        {
          id:3,
          icon:"edit",
          imgUrl:require('../../../../assets/image/iconPortrait.jpg'),
          text:"录入教学活动"
        },
        {
          id:4,
          icon:'friends-o',
          imgUrl:require('../../../../assets/image/iconPortrait.jpg'),
          text:"录入师承"
        }
      ],
      textList:["电子轮转手册","年度业务水平测试","医学电子书包"],
      isActive:0,
      active: 0,
      list: [],
      loading: false,
      finished: false,
      myInfo:"",
      swiperList:[],
      isDialog:false,
      isShade:false,
      iconActive:'电子轮转手册',
      noReadNum: 0,
    };
  },
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
    toPage(item,index){
        this.Global.currentItem.depDetailType = 2;
        this.Global.currentItem.currentDepartId = null;
        if ((index == 1 || index == 2) && this.Global.scheduleId == 0) {
          this.$toast('当前无轮转计划');
          return;
        }
        switch(index){
          case 0:
            /*查看轮转计划跳转页面*/
            this.$router.push({name:"rotation"});
            this.Global.currentItem.depDetailType = 1;
            break;
          case 1:
            /*录入技能手术跳转页面*/
            this.$router.push({name:"CaseOper"});
            break;
          case 2:
            /*录入教学活动跳转页面*/
            this.$router.push({name:"teachingActiveIndex"});
            break;
          case 3:
            /*录入师承跳转页面*/
            this.$router.push({name:"teachingEntry"});
            break;
          default:
            return;
        }
    },
    // 跳转消息列表页面
    goNewsList(){
        this.$router.push({ name: "newsList"});
    },
    shadeEvent(){
      this.isShade = false;
      this.isDialog = !this.isDialog;
    },
    headIconEvent(){
      this.isDialog = !this.isDialog;
      this.isShade = !this.isShade;
    },
    headGoPage(item,index){
      this.iconActive = item;
      if(index==0){
        /*电子轮转手册跳转页面*/
      /*  this.$router.push({name:''})*/
      }
      if(index==1){
        /*年度业务水平跳转页面*/
      /*  this.$router.push({path:''})*/
      }
      if(index==2){
        /*医学电子书包跳转页面*/
       /* this.$router.push({path:''})*/
      }
    },
    ...mapMutations({ setNum : "setNum"}),
    setActiveFooter(){
      const num= Math.floor(Math.random()*3);
      this.setNum(num);
    },
    goPage(result) {
      this.$router.push({name:result})
    },
    // 跳转教学活动
    goTeachActive(type) {
      this.Global.currentItem.depDetailType = type;
      this.$router.push({
       name:"teacherActiveList"
      })
    },
    // 当前科室,全部科室
    goCurrentDep(type,status) {
      this.$store.state.status = status;
      this.Global.currentItem.depDetailType = type;


      if(type == 2){
          this.Global.currentItem.currentDepartId = null;
      }
      this.$store.state.deaseListPagePre = 1;
      this.$router.push(
          {name:"deaseOperList",query:{
              status:status,
              }},

      );
    },
    // 获取用户信息
    getDetailInfo() {
      const url = this.api.userDetailInfo;
      const postJson = {
        userId: this.Global.userId,
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if(res.code == 0){
              this.myInfo = res.result;
          }
        }
      });
    },

    /****************数据请求*********************/
    //获取首页数据
    homeStudentInfo(){
      const url = this.api.homeStudentInfo;

      this.utils.ajax({
        url:url,
        method:"post",
        success:res=>{
          if(res.code == 0 && res.data){
            this.stuResult = res.data;

            // 获取当前轮转id，科室id
            let SelectRotationEndTime;
            this.Global.scheduleId = res.data.currentRotationScheduleId;
            if( new Date(this.stuResult.currDepartEndTime).getTime() > new Date().getTime()){

              SelectRotationEndTime = new Date();
            }else{
              SelectRotationEndTime = new Date(this.stuResult.currDepartEndTime);
            }
            let departmentName = this.stuResult.currentDepartName;
            let currentBaseDepartName = this.stuResult.currentBaseDepartName;
            if(currentBaseDepartName){
                departmentName = departmentName +"【"+currentBaseDepartName+"】";
            }
            this.stuResult.currentDepartName = departmentName;

            this.Global.currentItem = {
                currentDepartId: this.stuResult.currentDepartId,
                departmentName: this.stuResult.currentDepartName,
                currentScheduleId: this.stuResult.currentRotationScheduleId,
                currentRotationStartTime:this.stuResult.currDepartStartTime,
                currentRotationEndTime:this.stuResult.currDepartEndTime,
                SelectRotationEndTime:SelectRotationEndTime
            };
          }else{
            this.$toast( res.msg );
          }
        }
      })
    },
    getNoRead(){
      const url = this.api.getNoRead;
      const postJson = {
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if(res.code == 0){
             this.noReadNum = res.data;
          }
        }
      });
    }
  },
  created() {
    this.getNoRead();
      let url =  window.location.href;
      this.$store.state.urlObj = this.utils.urlObj(url);
      if( this.$store.state.urlObj){
          this.$store.state.token = this.$store.state.urlObj.token
          this.$store.state.imei = this.$store.state.urlObj.imei
          this.$store.state.project = this.$store.state.urlObj.project
          this.$store.dispatch("setNewToken", this.$store.state.token);
          this.$store.dispatch("setNewImei",  this.$store.state.imei);
          this.$store.dispatch("setNewProject",this.$store.state.project)
          console.log(this.$store.state.token,"token存在", this.$store.state.imei,this.$store.state.project )
      }

  },
  mounted(){
    this.homeStudentInfo();
    this.$store.dispatch("setNewNum",0);

    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .currentBox{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 45px;
  }
  .wrapper  /deep/ .van-tab__pane{
     overflow-y: scroll;
     -webkit-overflow-scrolling: touch;
  }
  /*头部*/
  .studentHeader /deep/ .van-nav-bar__title{
    font-size: 14px;
  }
  .studentHeader .van-icon{
    font-size: 20px;
  }
    .headRight{
      font-size:12px;
      color:#ccc;
      text-align: right;
    }
    .headDay{
      font-size:18px;
      color:#666;
    }
  /*主容器*/
  .homeCtBox{
    position: absolute;
    top: 2.875rem;
    left: 0;
    right: 0;
    bottom: 50px;
    width: 100%;
    padding: 0 12px 0;
    flex-direction: column;
  }
  /*图标区*/
  .iconAll{
    width:100%;
    height:115px;
    display: flex;
    margin: 6px 0;
    box-sizing: border-box;
  }
  .icon1{
    width:25%;
    font-size:0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;

  }
  .icon-img{
      width:66px;
      height:66px;
      display: flex;
      justify-content: center;
      align-items: center;
      background:#A083E0;
      margin-bottom:5px;
      font-size:40px;
       color:#fff;
      border-radius: 50%;
  }
  .icon-text{
      min-width:56px;
  }
  /*底部内容栏容器*/
  /*第一阶段*/
  .absence {
    margin-top: 10px;
    text-align: center;
    color:#333;
  }
  /*日期*/
  .startDay{
    margin:10px 0;
  }
  /*中医科室名称*/
  .title_large  /deep/ .title-text .van-col--16 {
    text-align: left;
    font-size:1.125rem;
    font-weight: bold;
  }

  .wrapper /deep/ .van-tabs__content {
    flex: 1;
    -webkit-flex: 1;
    -moz-flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  /*内容区所有文字*/
  .Disease span{
    color:#A083E0;
    font-size: 24px;
  }
    /*病种、教学活动、手术或技能操作*/
  .title_small {
    font-size: 12px;
    text-align: left;
    color: #333;
    margin-top: 10px;
  }

  .title_large{
    font-weight: bold;
  }
  .wrapper /deep/ .van-col--6 {
    text-align: left;
    color:#999;
  }
  /*全部科室*/
  .absence .title-sec b{
    font-size: 21px;
  }
  .absence .title-sec{
    margin: 6px 0;
    font-size: 18px;
  }
/*修改过的*/
.wrapper /deep/ .van-col {
  font-size: 12px;
}
.wrapper /deep/ .van-col--12 {
  text-align: left;
}
.wrapper /deep/ .van-tabs__wrap .van-tabs__nav {
  width: 100%;
  margin: 0;
}
/*上面内容是修改过的*/
.wrapper /deep/ .van-cell__title span {
  font-weight: 900;
  font-size: 18px;
}
.wrapper /deep/ .van-cell__label {
  margin: 10px 0;
}
.desk {
  text-align: left;
}

.writeInBox {
  height: 80px;
  margin-bottom: 14px;
}
.writeInBtn {
  width: 170px;
  background: #006754;
  color: #fff;
  border-radius: 6px;
}
.listContentBox {
  flex-direction: column;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}
.Disease {
  width: 100%;
  border-bottom: 1px solid #ccc;
}
/*病种完成情况*/

.Disease .van-row {
  margin: 10px 0;
}
.absence .title-sec span {
  font-size: 12px;
}
.box100 {
  display: flex;
}
.enter_icon {
  width: 65px;
  height: 100%;
  padding-top: 22px;
  font-size: 40px;
  box-sizing: border-box;
  text-align: right;
}
.enter_text{
    padding-top: 22px;
    padding-left: 10px;
    text-align: left;
}
.enter_text span {
  font-size: 18px;
  font-weight: bold;
}

</style>
