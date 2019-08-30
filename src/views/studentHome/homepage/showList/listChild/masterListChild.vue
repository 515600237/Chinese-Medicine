<template>
  <div>
    <div v-for="(item,index) of list " :key="index"  style="overflow: hidden;">
      <!--提交时间-->
      <div class="submit-time">
        <div class="submit-time-all time-second" style="position: relative;">
          <ul class="submit-time-left">
            <van-icon name="todo-list-o" size="16"/>
            <li>提交时间：</li>
            <li>{{item.createTime}}</li>
            <li>|</li>
          </ul>
          <ol class="time-second-right">
            <li class="audit-status">
              <span v-if="item.auditState == 0" :style="{color:'orange'}">【待审核】</span>
              <span v-if="item.auditState == 1" :style="{color:'#2ECC71'}">【已通过】</span>
              <span v-if="item.auditState == 2">【未通过】</span></li>
            <li class="modifyBtn_li">
              <van-button
                v-if="item.auditState == 0"
                @click.native="goPage('teachingModify',item)"
                class="btnSave">
                修改
              </van-button>
            </li>
            <!-- 是否属实 -->
            <li class="nottrue" v-if="item.auditState ==2"></li>
          </ol>
        </div>
      </div>
      <ul class="study-box auditNameBox">
             <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0"
            >
              <span class="lable-left">审核人:</span>
              <span class="lable-right">{{item.data.auditName}}</span>
            </li>

            <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0"
            >
              <span class="lable-left">审核时间:</span>
              <span class="lable-right">{{item.data.auditTime}}</span>
            </li>

            <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0 && item.data.auditOpinion"
            >
              <span class="lable-left">审核意见:</span>
              <span class="lable-right">{{item.data.auditOpinion}}</span>
            </li>
          </ul>
      <!--跟师考勤-->
      <div class="teaching-content" v-if="item.type==1">
        <div class="contentBox">
          <ul class="study-box">
            <li class="audit-list">
              <span class="lable-left">类型:</span>
              <span class="lable-right">跟师学习</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">日期:</span>
              <span class="lable-right">{{item.data.outCallDate}}{{item.data.outCallTime}}</span>
            </li>
            <li class="audit-list frist-audit">
              <span class="lable-left offtit">附件:</span>
              <div class="lable-right offname">
                <!-- 附件显示组件 -->
                <imgShowList :activityAttachments="item.data.attachments" v-if="item.data.attachments"></imgShowList>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--临床医案-->
      <div class="teaching-content" v-if="item.type==3">
        <div class="contentBox">
          <ul class="case-box">
            <li class="audit-list">
              <span class="lable-left">类型:</span>
              <span class="lable-right">临床医案</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">病历号:</span>
              <span class="lable-right">{{item.data.medicalRecordNo}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">病人姓名:</span>
              <span class="lable-right">{{item.data.patientName}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">就诊时间:</span>
              <span class="lable-right">{{item.data.visitTime}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">就诊类型:</span>
              <span class="lable-right">{{item.data.visitType==0 ? '初诊':"复诊"}}</span>
            </li>
            <li class="audit-list" v-if="item.data.visitType==1&&item.data.subsequentVisitNum">
              <span class="lable-left">复诊次数:</span>
              <span class="lable-right">{{item.data.subsequentVisitNum}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">主诉:</span>
              <span class="lable-right">{{item.data.chiefComplaint}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">中医诊断:</span>
              <span class="lable-right">{{item.data.chineseMedicineDiagnosis}}</span>
            </li>
            <li class="audit-list frist-audit">
              <span class="lable-left ">处方:</span>
              <div class="lable-right">
               {{item.data.recipe}}
              </div>
            </li>
            <li class="audit-list frist-audit">
              <span class="lable-left offtit">处方附件:</span>
              <div class="lable-right offname">
                 <!-- 附件显示组件 -->
                <imgShowList :activityAttachments="item.data.recipeAttachments" v-if="item.data.recipeAttachments"></imgShowList>
              </div>
            </li>
            <li class="audit-list">
              <span class="lable-left ">按语:</span>
              <div class="lable-right">
               {{item.data.comment}}
              </div>
            </li>
            <li class="audit-list last-audit">
              <span class="lable-left offtit">按语附件:</span>
              <div class="lable-right offname">
                <!-- 附件显示组件 -->
                <imgShowList :activityAttachments="item.data. commentAttachments" v-if="item.data. commentAttachments"></imgShowList>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--学习心得 跟师笔记-->
      <div class="teaching-content" v-if="item.type==2">
        
        <div class="contentBox">
          <ul class="note-box">
            <li class="audit-list">
              <span class="lable-left">类型:</span>
              <span class="lable-right">跟师笔记</span>
            </li>
            <li class="audit-list" v-if="item.data.noteType==0">
              <span class="lable-left">跟师笔记类型:</span>
              <span class="lable-right">跟师心得体会</span>
            </li>
            <li class="audit-list" v-if="item.data.noteType==1">
              <span class="lable-left">跟师笔记类型:</span>
              <span class="lable-right">学习中医典籍体会</span>
            </li>
            <li class="audit-list" v-if="item.data.noteType==2">
              <span class="lable-left">跟师笔记类型:</span>
              <span class="lable-right">其他</span>
            </li>
            <li class="audit-list" v-if="item.data.noteType==1 && item.data.bookName">
              <span class="lable-left">典籍名称:</span>
              <span class="lable-right">{{item.data.bookName}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">学习心得:</span>
              <span class="lable-right ">{{item.data.studyNotes}}</span>
            </li>

            <li class="audit-list frist-audit">
              <span class="lable-left">附件:</span>
               <div class="lable-right offname">
                <!-- 附件显示组件 -->
                <imgShowList :activityAttachments="item.data.attachments" v-if="item.data.attachments"></imgShowList>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // 图片展示子组件
import imgShowList from "@/components/uploadFile/imgShowList"
export default {
  name: "accomplishTeacher",
  components:{
    imgShowList
  },
  props: {
    listPage: Array
  },
  data() {
    return {
      list: this.listPage,
      imgList:[]
    };
  },
  methods: {
    goPage(page, item) {
      if (item.id) {
        this.$router.push({ name: page });
      }
      let teachJson = {
        id: item.id,
        type: item.type,
        visitType: item.data.visitType,
        noteType: item.data.noteType
      };
      this.$store.dispatch("setNewteachModifyJson", teachJson);
    }
  },
  watch: {
    listPage(newValue, oldValue) {
      this.list = newValue;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.teaching-content {
  margin-bottom: 15px;
}

.time-ul li {
  margin-right: 5px;
  font-size: 12px;
}

.note-box {
  border-bottom: 1px solid #ccc;
}
.study-box {
  border-bottom: 1px solid #ccc;
  background:#fff;
}
.auditNameBox{
  border-bottom: none;
}
.audit-list-ul li {
  display: flex;
}

/*时间栏*/
.submit-time {
  display: flex;
  margin-top: 12px;
  background: #666;
  opacity: 1;
  border-top-left-radius: 5px;
  border-top-right-radius:5px;
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
.time-second-right{
  display: flex;
  width:40%;
}
.audit-status{
  max-width:50%;
  line-height: 30px;
  color:#fff;
  text-align: left;

}
.modifyBtn_li{
  max-width:50%;
  margin:0 auto;
}
.modifyBtn_li button{
  min-width:45px;
  height: 30px;
  line-height: 28px;
}
/*表格样式*/
.contentBox {
  background: #fff;
}
.audit-list {
  width: 100%;
  display: flex;
  font-size: 12px;
  border: 1px solid #ccc;
  border-bottom: none;
}
.lable-left {
  width: 40%;
  line-height: 2.2rem;
  text-align: left;
  padding-left: 15px;
  box-sizing: border-box;
  vertical-align: middle;
}
.lable-right {
  vertical-align: middle;
  width: 60%;
  line-height: 2.2rem;
  word-break: break-all;
  text-align: left;
  border-left: 1px solid #ccc;
  padding-left: 15px;
  padding-right: 0.2rem;
  box-sizing: border-box;
  word-break: break-word;
}

.offtit {
  height: 90px;
  line-height: 90px;
}
.offname{
  overflow: hidden;
  display: inline-flex;
  align-items: center;
}

.last-audit {
  border-bottom: 1px solid #ccc;
}
/* 不属实 */
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
  right: -2.695rem;
  top: 8px;
  width: 60px;
}
.nottrue-li {
  background-color: #fff5e6;
}
.nottrue-li .lable-right{
  color: #ff0000;
}
</style>
