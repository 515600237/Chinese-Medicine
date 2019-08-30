<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar :title="headerTitle"
                 left-arrow
                 left-text="返回"
                 @click-left="onClickLeft"
    >
      <van-button
        plain
        hairline
        slot="right"
        size="small"
        @click="batchAudit()"
        v-if="auditStatus==0"
        :disabled="auditResList.length==0"
        :class="{'active':auditResList.length==0}"
        class="batchBtn"
      >
        <van-icon name="checked"
                  :color="'auditResList.length == 0'?'#fff':'#A083E0'"
                  :class="{ 'disabled':'auditResList.length == 0'}"
        />批量审核
      </van-button>
    </van-nav-bar>

    <!--查询条件-->
    <div class="queryBox bgGray borderGray disFlex fontColor3">
      <!--待审核-->
      <div class="flex1 stateBox">
        <span @click="selectAuditState()"
              class="currentYear"
        >
          {{curAuditState}}
          <i class="icon_more"></i>
        </span>
      </div>
      <!--年度列表-->
      <div class="flex1 yearBox text-center">
        <span @click="selectYear()"
              class="currentYear"
        >
          {{currentYear}}年
          <i class="icon_more"></i>
        </span>
      </div>
      <!--全部住院医师-->
      <div class="flex1 yearBox text-center">
        <span
                @click="selectResidents()"
                class="currentYear">
          {{currentStudentName}}
          <i class="icon_more"></i>
        </span>
      </div>
    </div>

    <!--审核弹窗-->
    <SelectListPop v-if="showAuditStatePop"
                   :list= "AuditList"
                   :isShow  = "auditListShow"
                   :oRadio = "radio1"
                   @hideOverlay="hideYearPop"
                   @chooseItem="chooseAuditData">
    </SelectListPop>
    <!--年度弹窗-->
    <SelectListPop v-if="showYearPop"
                   :list= "yearList"
                   :isShow  = "auditListShow"
                   :oRadio = "radio2"
                   @hideOverlay="hideYearPop"
                   @chooseItem="chooseItemYear">
    </SelectListPop>

    <!--全部住院医师-->
    <SelectListPop v-if="showStudentListPop"
                   :list= "studentListCopy"
                   :isShow  = "auditListShow"
                   :oRadio = "radio3"
                   @hideOverlay="hideYearPop"
                   @chooseItem="chooseItemStudent">
    </SelectListPop>

    <section class="section">
      <!--缺省图-->
      <div v-if="!auditResList||!auditResList.length" class="miss disFlex">
        <div class="lack disFlex">
          <img :src="imgUrl" alt="">
          暂无相关信息
        </div>
      </div>

      <!--待审核列表   审核操作-->
      <van-pull-refresh v-model="refesh" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :error.sync="error"
          error-text="请求失败"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <v-waitaudit :auditList="auditResList"
                      @auditOperate="auditSure"
          >
          </v-waitaudit>
        </van-list>
      </van-pull-refresh>

      <!--单次审核弹出框-->
      <v-dialogt
        ref="showOneAudit"
        :studentNameList="studentNameList"
        @checkAudit="submitAudit"
      ></v-dialogt>
      <!-- 批量审核 -->
    <v-dialogt ref="headBatchAudit"
               :studentNameList="studentNameList"
               @checkAudit="submitBatchAudit"
    >
    </v-dialogt>

    </section>
  </div>
</template>

<script>
// 审核组件
import waitAudit from "@/components/audit/waitAudit.vue";

import selectYear from "@/components/selectListPop.vue";
import selectState from "@/components/selectListPop.vue";
import selectAudit from "@/components/selectListPop.vue";
import diglog from "@/components/dialog/dialog.vue";
import selectListPop  from "@/components/selectListPop/selectListPop";
export default {
  name: "awaitAudit",
  components: {
    // 审核列表
    vWaitaudit: waitAudit,
    // 查询条件
    vSelectyear: selectYear,
    vSelectstate: selectState,
    vSelectaudit: selectAudit,
    vDialogt: diglog,
    /*测试弹窗*/
    SelectListPop:selectListPop
  },
  data() {
    return {
      auditType: 1,
      imgUrl:require('../../../../assets/image/defaultStudent.png'),
      radio:0,
      radio1:0,//当前对勾索引
      radio2:0,
      radio3:0,
      headerTitle:'审核',
      loading: false,
      refesh: false,
      finished: false,
      error: false,
      pageIndex: 1,
      auditListShow:true,
      //审核状态
      auditStatus: 0,
      //当前年
      currentYear: 2019,
      currentStudentId: null,
      //全部住院医师
      studentList: [
        {studentId: null,
        studentName: "全部住院医师"}
       ],
       studentListCopy:[],
      currentStudentName: "全部住院医师",
      showStudentListPop: false,
      //审核弹窗
      studentNameList: "",
      //审核列表
      curAuditState: "待审核",
      showAuditStatePop: false,
      //  待审核 0，已通过1，未通过2
      AuditList: ["待审核", "已通过", "未通过"],
      auditItem:{}, //单次审核 item数据
      //年度列表
      yearList: [],
      showYearPop: false,
      list: [],
      //列表数据
      auditResList: [],
      auditTextArea: "",
      auditPostState: 1,
      //测试数据
      activityAttachments:["https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg","https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg","https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg"]
    };
  },
  methods: {
    auditTypety(){
        this.headerTitle = this.Global.auditNameText;
    },
    onClickLeft(){
      this.$router.go(-1);
    },
    //批量审核
    batchAudit() {
      let nameList= this.auditResList.map((item) =>{
        return item.studentName;
      })
      this.studentNameList = nameList;
      this.$refs.headBatchAudit.isShowHidePopUp();
    },
    //审核状态选择
    selectAuditState() {
      this.showAuditStatePop = true;
    },
    //待审核下拉栏选择项
    chooseAuditData(item = "", index) {
      this.radio1 =index;
      this.curAuditState = item;
      this.showAuditStatePop = false;
      this.auditStatus = index;
      this.searchList(true);
    },
    //全部住院医师
    chooseItemStudent(item = "",index) {
      this.radio3 =index;
      this.currentStudentId = this.studentList[index].studentId;
      this.currentStudentName = this.studentList[index].studentName;
      // 关闭弹窗，再次查询
      this.showStudentListPop = false;
      this.searchList(true);
    },
    //年代
    getYearList() {
      const date = new Date();
      let currentYear = date.getFullYear();
      for (let i = 0; i < 3; i++) {
        this.yearList.push(currentYear + "年");
        currentYear++;
      }
    },
    // 单个审核
    auditSure(item,index) {
      this.auditItem =item;
      this.studentNameList = [item.studentName];
      this.$refs.showOneAudit.isShowHidePopUp();
    },
    selectYear() {
      this.showYearPop = true;
    },
    selectResidents() {//选择学生
      this.showStudentListPop = true;
    },
    //下拉菜单关闭
    hideYearPop() {
      this.showAuditStatePop = false;
      this.showYearPop = false;
      this.showStudentListPop = false;
    },
    // 批量审核
    submitBatchAudit(textarea, Status){
        this.auditTextArea = textarea;
        this.auditPostState = Status;
        // 批量审核病种
        if(this.auditType ==1){
            let array = [];
            this.auditResList.forEach(item => {
              array.push(item.auditCollectId);
            });
            this.deaseAuditPost(array);
        }
        if(this.auditType ==2){
          let array = [];
          this.auditResList.forEach((item)=>{
            let json={
            "auditOpinion": this.auditTextArea,
            "auditResult": this.auditPostState,
            "id": item.id,
            "type":item.type
            };
              array.push(json);
          })
          this.teachActivePost(array);
       }
        if(this.auditType ==3){
          let array = [];
          this.auditResList.forEach((item)=>{
            let json={
            "auditOpinion": this.auditTextArea,
            "auditResult": this.auditPostState,
            "id": item.id,
            "type":item.type
            };
            array.push(json);
          })
          this.shChPost(array);
       }

    },
    /**********提交审核数据请求***********/
    // 单个审核   单个审核与批量审核区分开
    submitAudit(textarea, Status) {
        this.auditTextArea = textarea;
        this.auditPostState = Status;

        console.log(this.auditItem);
      // 病种
       if(this.auditType ==1){
          let array = [];
          array.push(this.auditItem.auditCollectId);
          this.deaseAuditPost(array);
       }
      //  教学活动
       if(this.auditType ==2){
          let array = [];
          let json={
          "auditOpinion": this.auditTextArea,
          "auditResult": this.auditPostState,
          "id": this.auditItem.id,
          "type": 0
          };
          array.push(json);
          this.teachActivePost(array);
       }
      //  师承
       if(this.auditType ==3){
          let array = [];
          let json={
          "auditOpinion": this.auditTextArea,
          "auditResult": this.auditPostState,
          "id": this.auditItem.id,
          "type":this.auditItem.type
          };
          array.push(json);
          this.shChPost(array);
       }
    },
    // 师承审核
    shChPost(postJson){
      const url = this.api.shChAudit;

      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.$toast("师承审核成功");
            this.searchList(true);
          }else{
             this.$toast("师承审核失败");
          }
        }
      });
    },
    // 教学活动审核
    teachActivePost(postJson){
      const url = this.api.teachActiveAudit;
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.$toast("教学活动审核成功");
            this.searchList(true);
          }else{
             this.$toast("教学活动审核失败");
          }
        }
      });
    },
    // 病种手术审核
    deaseAuditPost(idList){
      const url = this.api.deaseAudit;
      const postJson = {
        idList: idList,
        auditState: this.auditPostState,
        auditReason: this.auditTextArea,
        teacherId: this.Global.userInfo.userId
      };
      console.log(postJson);

      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.$toast("审核成功");
            this.searchList(true);
          }else{
             this.$toast("审核失败");
          }
        }
      });
    },

    /*************数据请求******************/
    // 病种技能列表
    listAuditCollect() {
      this.loading = true;
      const url = this.api.listAuditCollect;
      const postJson = {
        studentId: this.currentStudentId || -1,//病种列表传-1 查全部
        standardDepartmentId: this.Global.userInfo.standardDepartmentId,
        auditState: this.auditStatus,
        year: this.currentYear,
        pageIndex: this.pageIndex,
        pageSize: 10,
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          this.loading = false;
          this.refesh = false;
          this.pageIndex = res.data.page + 1;
          if(res.code == 0){
            this.auditResList = this.auditResList.concat(res.data.result);
          } else {
            this.error = true;
            this.$toast(res.msg);
          }
          if (res.data.page === res.data.totalPage || res.data.totalPage === 0) {
            this.finished = true;
          }
        }
      });
    },
    // 教学活动审核列表
    teacherAuditlist(){
      this.loading = true;
      const url = this.api.activeAuditList;
      const postJson = {
        year: this.currentYear,
        auditState: this.auditStatus,
        studentId: this.currentStudentId,
        departmentId: null,
        pageIndex: this.pageIndex,
        pageSize: 10,
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          this.loading = false;
          this.refesh = false;
          this.pageIndex = res.data.page + 1;
          if(res.code == 0){
            this.auditResList = this.auditResList.concat(res.data.result);
          }else {
            this.error = true;
            this.$toast(res.msg);
          }
          if (res.data.page === res.data.totalPage || res.data.totalPage === 0) {
            this.finished = true;
          }
        }
      });
    },
    // 师承审核列表
    teaShChlist(){
      const url = this.api.shChAuditList;
      const postJson = {
        year: this.currentYear,
        auditState: this.auditStatus,
        studentId:this.currentStudentId,
        departmentId: null,
        pageIndex: this.pageIndex,
        pageSize: 10,
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          this.loading = false;
          this.refesh = false;
          this.pageIndex = res.data.page + 1;
          if(res.code == 0){
               this.auditResList = this.auditResList.concat(res.data.result);
          }else {
            this.error = true;
            this.$toast(res.msg);
          }
          if (res.data.page === res.data.totalPage || res.data.totalPage === 0) {
            this.finished = true;
          }

        }
      });
    },
    // 获取科室下全部住院医师
    getStudentList() {
      const url = this.api.studentInfoList;
      const postJson = {
        standardDepartmentId: this.Global.userInfo.standardDepartmentId
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0 && res.data) {
            this.studentList = res.data;
            this.studentList.unshift({
              studentId: null,
              studentName: "全部住院医师"
            });
            this.studentListCopy = this.studentList.map((item) =>{
               return item.studentName;
            })
          }
        }
      });
    },
    /*获取师承老师下的全部住院医师*/
    teaChstudList() {
      const url = this.api.teaChstudList;
      this.utils.ajax({
        url: url,
        method: "POST",
        success: res => {
          if (res.code == 0 && res.data) {
            this.studentList = res.data;
            this.studentList.unshift({
              studentId: null,
              studentName: "全部住院医师"
            });
            this.studentListCopy = this.studentList.map((item) =>{
               return item.studentName;
            })
          }
        }
      });
    },
    chooseItemYear(item = "",index) {
      this.radio2 = index;
      this.currentYear = parseInt(item);
      this.showYearPop = false;
      this.searchList(true);
    },
    chooseStateData(item = "") {
      this.state = item;
      this.index = this.list.push(this.state) - 2;
      return this.index;
    },
    goPage() {},
    // 下拉刷新
    onRefresh() {
      this.onLoad(true);
    },
    onLoad(flag) {
      // 查询列表
      this.searchList(flag);
    },
    searchList(flag){ //是否下拉刷新
      if (flag) {
        this.pageIndex = 1;
        this.auditResList = [];
      }
      //病种技能审核列表
      if(this.auditType == 1){
        this.listAuditCollect();
      }
      //教学活动审核列表
      if(this.auditType == 2){
        this.teacherAuditlist();
      }

      //师承审核列表
      if(this.auditType == 3){
        this.teaShChlist();
      }
    },
  },
  created() {
    this.auditType = this.$store.state.auditType;
    this.curAuditState = this.AuditList[this.auditStatus];
    this.getYearList();
  },

  mounted() {
    if(this.Global.userType==5){
      this.teaChstudList();
    }
    if(this.Global.userType==3){
      //获取住院医师列表
      this.getStudentList();
    }
    this.auditTypety();
  }
};
</script>

<style scoped>
/*box*/
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
}

/*导航栏*/
nav {
  display: flex;
  height: 38px;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background: #f2f2f2;
  position: absolute;
  top: 45px;
  left: 0;
  bottom: 0;
  right: 0;
}

.nav-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 38px;
  height: 38px;
  font-size: 12px;
  /*   border: 1px solid blueviolet;*/
}

.nav-box span {
  margin: 5px 0 0 5px;
  border: 5px solid transparent;
  border-top-color: #333;
}
.wrapper .batchBtn{
  width:80px;
  color:#A083E0;
  border: #A083E0;
}
.wrapper .batchBtn >>> .van-icon .disabled{
  top: -1px;
}
/*主干*/
section {
  width: 100%;
  position: absolute;
  top: 5.5rem;
 /* bottom: 50px;*/
  bottom:0;
  left: 0;
  right: 0;
  padding: 0 10px;
  box-sizing: border-box;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.office-message {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #f3f1f1;
  font-size: 12px;
  color: #666;
}

.office-message li {
  width: 30%;
  height: 40px;
  border: 1px solid #f3f1f1;
  text-align: left;
  text-indent: 20px;
  line-height: 40px;
}

.office-message span {
  width: 70%;
  text-indent: 20px;
  text-align: left;
  height: 40px;
  line-height: 40px;
  border: 1px solid #f3f1f1;
}

.office-message-tag {
  display: flex;
  background: #fff;
}

.office-tag-left {
  width: 30%;
  height: 52px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.office-tag-left .tag {
  width: 55px;
  height: 24px;
  line-height: 20px;
  text-align: center;
  background: #A083E0;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}

.office-tag-left .name {
  font-weight: bold;
  font-size: 13px;
}

.office-tag-right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  font-size: 12px;
  color: #666;
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
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 35px 35px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  position: absolute;
  -moz-transform: rotate(-315deg);
  -webkit-transform: rotate(-315deg);
  -o-transform: rotate(-315deg);
  -ms-transform: rotate(-315deg);
  right: -50px;
  top: 16px;
  width: 60px;
}

/* 弹窗 */
.queryBox {
  width: 100%;
  height: 38px;
  line-height: 38px;
  border-left: none;
  border-right: none;
}
.queryBox i {
  font-style: normal;
}
.yearBox {
  border-right: 1px solid #e4e4e4;
}
.disabled {
  background-color:#A083E0;
  color: #fff;
  margin-right: 2px;
  top: -1px;
}
.active {
  border: 0;
  color: #fff;
  background: #ccc;
}
/* 全部住院医师弹窗 */
.yearSeList {
  text-align: left;
  text-indent: 20px;
}
.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}
/*缺省图*/
.miss{
  width:100%;
  height:calc(100% - 90px);
  justify-content: center;
  align-items: center;
}
.lack{
  width:220px;
  height:180px;
  flex-direction: column;
  font-size:18px;
  color:#999;
}
.lack img{
  width:100%;
}
</style>
