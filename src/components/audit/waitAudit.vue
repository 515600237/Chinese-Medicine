<template>
  <div>
    <div class="awaitItem" v-for="(item,index) of auditList" :key="index">
      <!--提交时间-->
      <div class="submit-time">
        <div class="submit-time-all">
          <ul class="submit-time-left">
            <li>
              <van-icon name="todo-list-o" class="titleIcon"/>
            </li>
            <li>提交时间：<span class="colorLgGreen">{{item.createTime}}</span></li>
          </ul>
          <div class="submit-time-right">
            <van-button
              v-if="item.auditState == 0"
              plain
              hairline
              type="primary"
              slot="right"
              size="small"
              class="auditBtn"
              @click="auditPop(item,index)"
            >
              <van-icon name="checked" color="#fff"/>审核
            </van-button>
            <span v-if="item.auditState == 1">已通过</span>
            <ol class="noPass" v-if="item.auditState == 2">
              <li style="padding-top: 5px">|【未通过】</li>
            </ol>
          </div>
        </div>
      </div>

      <!--病种技能手术  列表-->
      <div v-if="auditType == 1">
        <div class="office-message-tag">
          <p class="office-tag-left">
            <i class="greenLBcgBtn tagBg">{{item.dataTypeName}}</i>
            <b class="name">{{item.studentName}}</b>
          </p>
          <!-- {{getTimeStr(item, "s")}}——{{getTimeStr(item, "e")}} -->
          <p class="office-tag-right">培训时间: {{item.startTime || ''}}——{{item.endTime || ''}}</p>
        </div>
        <!-- 病种 -->
        <div class="messageTbody" v-if="item.dataType==1">
          <ul v-if="item.medicalRecord">
            <li v-if="item.medicalRecord &&item.medicalRecord.departmentName">
              <i>科室:</i>
              <span >{{item.medicalRecord.departmentName}}</span>
            </li>
            <li>
              <i>类型:</i>
              <span>{{item.medicalRecord["accessModeTitle"]}}</span>
            </li>
            <li>
              <i>病种:</i>
              <span>{{item.medicalRecord["mainDiseaseName"]}}</span>
            </li>
            <li>
              <i>{{item.medicalRecord.accessMode == 3?'住院时间':'就诊时间'}}:</i>
              <span>{{item.medicalRecord.accessMode != 3 ?item.medicalRecord["visitTime"]:item.medicalRecord["inHospitalTime"]}}</span>
            </li>
            <li v-if="item.medicalRecord.accessMode == 3">
              <i>是否全程管理:</i>
              <span>{{item.medicalRecord["manageWholeProcessTitle"]}}</span>
            </li>
            <li v-if="item.medicalRecord.accessMode == 3">
              <i>书写大病历:</i>
              <span>{{item.medicalRecord.writeMajorMedicalRecordTitle}}</span>
            </li>
            <li>
              <i>病历号:</i>
              <span>{{item.medicalRecord["medicalRecordNo"]}}</span>
            </li>
            <li>
              <i>病人姓名:</i>
              <span>{{item.medicalRecord["patientName"]}}</span>
            </li>

            <li>
              <i>主要诊断:</i>
              <span>{{item.medicalRecord.mainDiseaseName == '其他' ? item.medicalRecord.mainOtherDiseaseName : item.medicalRecord.mainDiseaseName}}</span>
            </li>
            <template v-if="item.medicalRecord.secondaryDiseaseList">
              <li v-for="(i,index1) in item.medicalRecord.secondaryDiseaseList" :key="index1">
                <i>次要诊断{{index1+1}}:</i>
                <span>{{i.secondaryDiseaseName == '其他' ? i.secondaryOtherDiseaseName : i.secondaryDiseaseName}}</span>
              </li>
            </template>
          </ul>
        </div>
        <div class="messageTbody" v-if="item.dataType==3">
          <ul v-if="item.medicalRecord">
            <li v-if="item.medicalRecord &&item.medicalRecord.departmentName">
              <i>科室:</i>
              <span >{{item.medicalRecord.departmentName}}</span>
            </li>
            <li>
              <i>主要手术/技术:</i>
              <span>{{item.medicalRecord["operationName"]}}</span>
            </li>

            <li v-for="(item,index1) in item.medicalRecord.secondaryOperationList" :key="index1">
              <i>次要手术/技术{{index1+1}}:</i>
              <span>{{item.secondaryOperationName=='其他'?item.secondaryOtherOperationName:item.secondaryOperationName}}</span>
            </li>
            <li>
              <i>手术角色:</i>
              <span>{{item.medicalRecord["operationRoleTitle"]}}</span>
            </li>
            <li>
              <i>手术/操作时间:</i>
              <span>{{item.medicalRecord["operationTime"]}}</span>
            </li>
            <li>
              <i>病历号:</i>
              <span>{{item.medicalRecord["medicalRecordNo"]}}</span>
            </li>
            <li>
              <i>病人姓名:</i>
              <span>{{item.medicalRecord["patientName"]}}</span>
            </li>
          </ul>
        </div>
      </div>

      <!--教学活动  列表-->
      <div v-if="auditType == 2">
        <div class="office-message-tag">
          <p class="office-tag-left">
            <i class="greenLBcgBtn tagBg" v-if="item.data && item.data.activityType">
              {{getActivityType[item.data.activityType]}}</i>
            <b class="name" v-if="item.studentInfo">{{item.studentInfo.studentName}}</b>
          </p>
          <!-- {{getTimeStr(item, "s")}}——{{getTimeStr(item, "e")}} -->
          <p class="office-tag-right">培训时间: <span v-if="item.departmentInfoVO && item.departmentInfoVO.startDate">{{item.departmentInfoVO.startDate || ''}}——{{item.departmentInfoVO.endDate || ''}}</span></p>
        </div>
        <div class="messageTbody">
          <ul v-if="item.data">
            <li v-if="item.departmentInfoVO &&item.departmentInfoVO.departmentName">
              <i>科室:</i>
              <span >{{item.departmentInfoVO.departmentName}}</span>
            </li>
            <li>
              <i>日期:</i>
              <span>{{item.data["activityDate"]}}</span>
            </li>
            <li v-if="item.data['activityType']">
              <i>活动形式:</i>
              <span>
                {{item.data.activityType | activityTypeFilter}}
              </span>
            </li>
            <li v-if="item.data['activityLevel']">
              <i>教学层次:</i>
              <span>
                {{item.data["activityLevel"] | activityLevelFilter}}
              </span>
            </li>
            <li>
              <i>活动内容:</i>
              <span>{{item.data["activityContent"]}}</span>
            </li>
            <li>
              <i>学时:</i>
              <span>{{item.data["activityDuration"]}}小时</span>
            </li>
            <li>
              <i>主讲人:</i>
              <span>{{item.data["keynoteSpeaker"]}}</span>
            </li>
            <li>
              <i>附件:</i>
              <span>
                <imgShowList :activityAttachments="item.data.activityAttachments" v-if="item.data.activityAttachments"></imgShowList>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!--师承  列表-->
      <div v-if="auditType == 3">
        <div class="office-message-tag">
          <p class="office-tag-left">
            <span class="greenLBcgBtn tagBg">
              <i v-if="item.type == 1">跟师学习</i>
              <i v-if="item.type == 2">跟师笔记</i>
              <i v-if="item.type == 3">临床医案</i>
            </span>
            <b class="name" v-if="item.studentInfo">{{item.studentInfo.studentName}}</b>
          </p>
          <!-- {{getTimeStr(item, "s")}}——{{getTimeStr(item, "e")}} -->
          <div class="office-tag-right" style="display: block;line-height: 1rem;">
            <div style="width: 100%; text-align: left;margin-top: 0.7rem;">参培时间: <span>{{getTimes(item)}}</span></div>
            <div style="width: 100%; text-align: left">专业: <span>{{item.studentInfo.majorName}}</span></div>
          </div>
        </div>
        <!-- 学习 -->
        <div class="messageTbody" v-if="item.type == 1">
          <ul v-if="item.data">
            <li>
              <i>类型:</i>
              <span>跟师学习</span>
            </li>
            <li>
              <i>日期:</i>
              <span>{{item.data.outCallDate }}</span>
            </li>
            <li class="imgShowLi">
              <i>附件:</i>
              <span>
                <imgShowList :activityAttachments="item.data.attachments" v-if="item.data.attachments"></imgShowList>
              </span>
            </li>
          </ul>
        </div>
        <div class="messageTbody" v-if="item.type == 2">
          <ul v-if="item.data">
             <li>
              <i>类型:</i>
              <span>跟师笔记</span>
            </li>
            <li v-if="item.data">
              <i>跟师笔记类型:</i>
              <span>{{item.data["noteType"] | studyNoteTypeFilter}}</span>
            </li>
            <li v-if="item.data['noteType']==1">
              <i>学习典籍:</i>
              <span>{{item.data["bookName"]}}</span>
            </li>
            <li v-if="item.data">
              <i>学习心得:</i>
              <span>{{item.data["studyNotes"]}}</span>
            </li>
            <li class="imgShowLi">
              <i>附件:</i>
              <span>
                <imgShowList :activityAttachments="item.data.attachments" v-if="item.data.attachments"></imgShowList>
              </span>
            </li>
          </ul>
        </div>
        <div class="messageTbody" v-if="item.type == 3">
          <ul v-if="item.data">
            <li>
              <i>类型:</i>
              <span>临床医案</span>
            </li>
            <li>
              <i>病历号:</i>
              <span>{{item.data["medicalRecordNo"]}}</span>
            </li>
            <li>
              <i>病人姓名:</i>
              <span>{{item.data["patientName"]}}</span>
            </li>
            <li>
              <i>就诊时间:</i>
              <span>{{item.data["visitTime"]}}</span>
            </li>
            <li>
              <i>就诊类型:</i>
              <span>{{item.data["visitType"]==0?'初诊':'复诊'}}</span>
            </li>
            <li v-if="item.data['visitType']==1">
              <i>复诊次数:</i>
              <span>{{item.data["subsequentVisitNum"]}}</span>
            </li>
            <li>
              <i>主诉:</i>
              <span>{{item.data["chiefComplaint"]}}</span>
            </li>
            <li>
              <i>中医诊断:</i>
              <span>{{item.data["chineseMedicineDiagnosis"]}}</span>
            </li>
             <li>
              <i>处方:</i>
              <span>{{item.data["recipe"]}}</span>
            </li>
             <li>
              <i>处方附件:</i>
              <span>
                <imgShowList :activityAttachments="item.data.recipeAttachments" v-if="item.data.recipeAttachments"></imgShowList>
              </span>
            </li>
            <li>
              <i>按语:</i>
              <span>{{item.data["comment"]}}</span>
            </li>
            <li class="imgShowLi">
              <i>按语附件:</i>
              <span>
                <imgShowList :activityAttachments="item.data.commentAttachments" v-if="item.data.commentAttachments"></imgShowList>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imgShowList from "@/components/uploadFile/imgShowList"
export default {
  name: "waitAudit",
  props: {
    auditList: Array
  },
  components: {
    imgShowList
  },
  data() {
    return {
      show: true,
      name: "李雷",
      auditType: 1,
      activityType: [],
      activityLevel: [],
      getActivityType:{},
      zdJson: {
        type: this.constantData.activityType,
        level: this.constantData.activityLevel
      },
      //测试数据
      activityAttachments2: [
        "https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg",
        "https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg",
        "https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg"]
    };
  },
  created() {
    this.auditType = this.$store.state.auditType;
    this.getActivityType = this.constantData.getActivityType;
    //获取常量
    this.activityType = this.constantData.activityType;

    this.activityLevel = this.constantData.activityLevel;
    console.log(this.constantData.activityType);
    console.log(this.constantData.activityLevel);
  },
  computed: {
    getDate() {
      let mydate = new Date();
      let onedate = mydate.toLocaleString("chinese", { hour12: false });
      let reg = /\/+/g;
      this.time = onedate.replace(reg, "-");
      console.log(onedate);
    }
  },
  methods: {
    getTime(data){
      if (!data.data) {
        return "";
      }
      if(data.data.outCallDate){
         return data.data.outCallDate;
      }
      if(data.data.visitTime){
         return data.data.visitTime;
      }
      return "";
    },
    getTimes(data){
      if (data.studentInfo.startTime) {
        return data.studentInfo.startTime;
      }
      return "";
    },
    hideOvers() {
      //   this.$emit("hideOverlay", false);
    },
    auditPop(item, index) {
      this.$emit("auditOperate", item, index);
    },
    getTimeStr(data, type) {
      if (type == 's') {
        return data.startTime || data.departmentInfoVO.startDate || '';
      }
      if (type == 'e') {
        return data.endTime || data.departmentInfoVO.endDate || '';
      }
    }
  },
};
</script>

<style scoped>
i {
  font-style: normal;
}
/* 年度选择弹窗 */
.yearPops {
  top: 84px;
}
.overYearbg {
  opacity: 0.5;
}

.icon_more {
  border-width: 8px;
  margin-left: 10px;
  margin-top: 5px;
}

.titleIcon {
  font-size: 18px;
  margin-top: 4px;
  margin-right: 4px;
}

.yearSeList {
  text-align: left;
  text-indent: 20px;
}

.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}

/*条件选择区*/
/*提交时间*/
.submit-time {
  display: flex;
  margin-top: 12px;
  background: #666;
  opacity: 1;
  width: 100%;
  border-radius: 5px;
  height: 37px;
  line-height: 37px;
}

.submit-time-all {
  display: flex;
  width: 100%;
  height: 37px;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
}
.submit-time-left {
  width: 60%;
  display: flex;
  color: #fff;
  align-items: center;
}
.submit-time-left li {
  height: 28px;
  line-height: 28px;
}
.submit-time-right {
  width: 40%;
  text-align: right;
}
.colorLgGreen {
  color: #afc5c5;
}
/*主干*/
section {
  width: 100%;
  position: absolute;
  top: 78px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
/* 头部 */
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
  width: 45px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #A083E0;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}
/* body区域 */
.messageTbody {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #f3f1f1;
  font-size: 12px;
  color: #666;
}
.messageTbody ul,
.messageTbody li {
  width: 100%;
}
.messageTbody li{
    /* height: 40px; */
    display: flex;
}
.messageTbody li i {
  /* float: left; */
  display: block;
  width: 35%;
  /* height: 40px; */
  border-right: 1px solid #f3f1f1;
  border-bottom: 1px solid #f3f1f1;
  text-align: left;
  text-indent: 20px;
  line-height: 40px;
}
.messageTbody span {
  /* float: left; */
  display: block;
  word-break: break-all;
  width: 65%;
  /* height: 40px; */
  text-indent: 20px;
  text-align: left;
  line-height: 40px;
  border-bottom: 1px solid #f3f1f1;
}

/*技能*/
.office-tag-left .tagBg {
  width: 65px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 10px;
  font-size: 12px;
  background: #A083E0;
  color: #fff;
}
.office-tag-left .name {
  font-weight: bold;
  font-size: 13px;
  margin-left: 2px;
}
.office-tag-right {
  display: flex;
  align-items: center;
  width: 70%;
  font-size: 12px;
  color: #666;
  text-indent: 20px;
}
/* 未通过 */
.noPass {
  position:relative;
  line-height: 1.875rem;
  font-size: 14px;
  text-align: left;
  height: 1.875rem;
  text-indent: -3px;
}
.noPass::before {
  position: absolute;
  content: "不属实";
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 35px 35px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  -moz-transform: rotate(-315deg);
  -webkit-transform: rotate(-315deg);
  -o-transform: rotate(-315deg);
  -ms-transform: rotate(-315deg);
  right: -39px;
  top: 16px;
  width: 60px;
}

.awaitItem .auditBtn {
  color: #fff;
  background-color:rgb(46, 204, 113);
}
/* 附件图片 */
/* imgShowLi */
.imgShowLi{
  /* height: 80px; */
}
.messageTbody .imgShowLi>i{
  /* height: 100%; */
  border-bottom: none;
}
.imgShowLi>span{
  padding: 10px;
  /* height: 100px;
  padding-top: 20px;
  padding-left: 10px; */
}
</style>
