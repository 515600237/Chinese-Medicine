<template>
      <div>
        <van-nav-bar
          :title="title"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />

        <!--内容区-->
        <div class="box">
          <van-row type="flex" justify="space-between" class="absence">
            <h2 class="title_large title-sec">
              已轮转科室
              <b>{{showData.completeRotatedDepartNum}}</b>
            </h2>
            <van-col span="8" v-if="false">
              缺勤天数:
              <span>{{}}天</span>
            </van-col>
          </van-row>
          <div class="Disease" @click="goPage('masterList')">
            <h5 class="title_small">师承完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{showData.mentorAttendanceRecordNum}}</span>
                </p>跟师学习
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.mentorDiagnosticRecordNum}}</span>
                </p>临床医案
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.mentorStudyRecordNum}}</span>
                </p>跟师笔记
              </van-col>
            </van-row>
          </div>
          <div class="Disease" @click="goCurrentDep(2)">
            <h5 class="title_small">病种完成情况</h5>
            <van-row type="flex" justify="space-between">
              <van-col span="6" >
                <p>
                  <span>{{showData.allDepartDiseaseCompleteCase}}</span>
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
                  <span>{{showData.allDepartOperationCompleteCase}}</span>/
                  {{showData.allDepartOperationRequireCase}}
                </p>录入例数
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.allDepartOperationCompleteCaseRate}}%</span>
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
                  <span>{{showData.allDiscussionNum}}</span>
                </p>病历讨论
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.allTeachingNum}}</span>
                </p>教学查房
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.allSeminarNum}}</span>
                </p>培训讲座
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{showData.allTrainNum}}</span>
                </p>技能训练
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.allSimulationNum}}</span>
                </p>模拟教学
              </van-col>
              <van-col span="6">
                <p>
                  <span>{{showData.allPracticeNum}}</span>
                </p>院外实践
              </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
              <van-col span="6">
                <p>
                  <span>{{showData.allOtherNum}}</span>
                </p>其他
              </van-col>
            </van-row>
          </div>
        </div>

      </div>
</template>

<script>
  export default {
    name: "teacherStaticDetails",
    data(){
      return{
        teachingActive:[],
        showData: {},
        title: ""
      }
    },
    methods:{
      onClickLeft(){
        this.$router.go(-1)
      },

      getData() {

        this.utils.ajax({
          url: this.api.studentInfo,
          method:'POST',
          data: {
            studentId: this.$store.state.teachAuditStudentId.studentId
          },
          success: res => {
            this.showData = res.data;
          }
        })
      }
    },
    mounted(){
      this.getData();
      this.title = this.$store.state.teachAuditStudentId.studentName
    }
  }
</script>

<style scoped>
  .studentHeader /deep/ .van-nav-bar__title{
    font-size: 14px;
  }
  .title-sec{
    margin-left:0.9375rem;
  }
  .box{
    padding:0 0.9375rem;
    box-sizing: border-box;
  }
  /*底部内容栏容器*/

  /*第一阶段*/
  .absence {
    margin-top: 10px;
    text-align: center;
    color:#333;
  }
  /*日期*/

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

  .enter_text span {
    font-size: 18px;
    font-weight: bold;
  }
</style>