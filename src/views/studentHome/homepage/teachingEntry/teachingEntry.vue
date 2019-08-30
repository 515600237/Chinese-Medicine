<template>
  <div class="wrapper">
    <!--头部-->
    <van-nav-bar
      :title="headTitle"
      left-text="返回"
      left-arrow
      @click-left="goPage"
      @click-right="savePage"
    >
      <van-button
        size="small"
        slot="right"
        class="btnSave">
        保存
      </van-button>
    </van-nav-bar>
    <!--内容-->
    <div class="content">

      <van-tabs type="card" class="card"  v-model="activeTabs" ellipsis :lazy-render='false' >
        <van-tab :title="item.name"
                 v-for="(item,index) of tabs"
                 :key="index"
        >
        </van-tab>
      </van-tabs>

      <div class="yiAnChildBox">
          <chini-Basis
            v-show="activeTabs==1"
            ref="basis"
            @basisChange="handleBasis"
          >
          </chini-Basis>
      </div>
      <teaching-entry-child
        v-show="activeTabs==0"
        @change="handleChange"
        ref="entryC"
      >
      </teaching-entry-child>
      <teaching-note v-show="activeTabs==2"
                     ref="notes"
                     @noteChange="noteChange"
      ></teaching-note>
      </div>
  </div>
</template>

<script>
  /*子组件*/
  import teachingEntryChild from "@/views/studentHome/homepage/teachingEntry/childComponents/teachingEntryChild"//跟师学习
  import chiniBasis from "@/views/studentHome/homepage/teachingEntry/childComponents/clinicalBasis"//临床医案
  import teachingNote from "@/views/studentHome/homepage/teachingEntry/childComponents/teachingNote" //跟师笔记
  export default {
    name: "teachingEntring",
    data() {
      return {
        /*头部标题*/
        activeTabs:0,
        headTitle: "录入师承",
        active: 0,
        tabs: [
          {id:1,name:"跟师学习"},{
          id:2,name:"临床医案"
          },{id:3,name:"跟师笔记"}
        ],
        tag: {},
        mentorAttendanceRecordDto:{},//学习
        mentorStudyRecordDto:{},//笔记
        mentorDiagnosticRecordDto:{},//临床医案
        attendCopy:{
            "attachments":[],//附件
            "outCallDate":"",//日期
          /*  "outCallTime":""//上下午*/
          },//学习
        metorCopy: {
            "chiefComplaint": "",//主诉
            "chineseMedicineDiagnosis": "", //中医诊断
            "comment": "",//按语
            "commentAttachments": [],//按语附件
            "medicalRecordNo": "",//病历号
            "patientName": "",//病人姓名
            "recipe": "",//处方
            "recipeAttachments": [],//处方附件
            "subsequentVisitNum":"" ,//复诊次数
            "visitTime": "",//就诊时间
            "visitType": "",//就诊类型
            "westernMedicineDiagnosis": ""//西医诊断
          },//临床医案
        studyCopy: {
          "attachments": [],
          "bookName": "",
          "noteType":"",
          "studyNotes": ""
        },//学习心得
        postJson:{},
      }
    },
    methods: {
      handleChange(data){
        this.mentorAttendanceRecordDto = Object.assign({}, this.mentorAttendanceRecordDto,data);
      },
      handleBasis(data){
        console.log(data);
        this.mentorDiagnosticRecordDto = Object.assign({}, this.mentorDiagnosticRecordDto,data)
        console.log(this.mentorDiagnosticRecordDto.visitType);
      },
      noteChange(data){
        this.mentorStudyRecordDto = Object.assign({}, this.mentorStudyRecordDto,data);
      },
      /*返回*/
      goPage: function () {
        this.$router.push({name: "homeindex"})
      },
      /*保存*/

      isEqualSame(postList,yjson){
        let postJson = postList;
        let flag = true; //默认全部相等
        for(var key in postJson){
            if(String(postJson[key]) !== String(yjson[key])){
              flag = false;
            }
        }
        if(flag){
          return null;
        }else{
          return postList;
        }
      },
      // 跟师学习
      checkAllowTeacher(){
        //跟师学习附件必传
          if(!this.mentorAttendanceRecordDto.outCallDate){
              this.$toast("请选择出诊时间");
              return false;
          }
          if(!this.mentorAttendanceRecordDto.attachments || !this.mentorAttendanceRecordDto.attachments.length){
              this.$toast("请添加附件");
              return false;
          }
          return true;
      },
      // 临床医案
      checkYiAn(){
            let flag = false;
            if(!this.mentorDiagnosticRecordDto.medicalRecordNo){
              this.$toast("请输入病历号");
              return false;
            }
            if(this.mentorDiagnosticRecordDto.medicalRecordNo.length> 30){
              this.$toast("病历号最长为30个字符");
              return false;
            }
            if(!this.mentorDiagnosticRecordDto.patientName) {
              this.$toast("请输入病人姓名");
              return false;
            }
            if(this.mentorDiagnosticRecordDto.patientName.length > 30) {
              this.$toast("病人姓名最长为30个字符");
              return false;
            }
            if(!this.mentorDiagnosticRecordDto.visitTime){
                this.$toast('请选择就诊时间');
              return false;
            }
            if(this.mentorDiagnosticRecordDto.visitType === ''){
              this.$toast('请选择就诊类型');
              return false;
            }
            if(this.mentorDiagnosticRecordDto.visitType==1&&!this.mentorDiagnosticRecordDto.subsequentVisitNum){
              this.$toast('请输入复诊次数');
              return false;
            }
            if(this.mentorDiagnosticRecordDto.visitType==1&&this.mentorDiagnosticRecordDto.subsequentVisitNum){
              let reg =/^[1-9][0-9]{0,1}$/;
              if(!reg.test(this.mentorDiagnosticRecordDto.subsequentVisitNum)){
                   this.$toast('复诊次数只能输入数字，且最大为99');
                  return false;
              }
            }
            if(!this.mentorDiagnosticRecordDto.chiefComplaint){
              this.$toast("请输入主诉");
              return false;
            }
            if(this.mentorDiagnosticRecordDto.chiefComplaint.length> 30){
              this.$toast("主诉最长为30个字符");
              return false;
            }
            if(!this.mentorDiagnosticRecordDto.chineseMedicineDiagnosis){
              this.$toast("请输入中医诊断");
              return false;
            }
            if(this.mentorDiagnosticRecordDto.chineseMedicineDiagnosis.length > 30){
              this.$toast("中医诊断最长为30个字符");
              return false;
            }
             // 处方和处方附件都没输入
            if(!this.mentorDiagnosticRecordDto.recipe.length){
              if(!this.mentorDiagnosticRecordDto.recipeAttachments || !this.mentorDiagnosticRecordDto.recipeAttachments.length){
                   this.$toast("请输入处方");
                    return false;
              }
            };

            //处方和处方附件选择一个即可
            //处方输入后
            if(this.mentorDiagnosticRecordDto.recipe){
                if(this.mentorDiagnosticRecordDto.recipe.length>500){
                  this.$toast("处方最长为500个字符");
                  return false;
                };
            }

            if(!this.mentorDiagnosticRecordDto.comment.length){
                if(!this.mentorDiagnosticRecordDto.commentAttachments || !this.mentorDiagnosticRecordDto.commentAttachments.length){
                    this.$toast("请输入按语");
                    return false;
                }
            }
            if(this.mentorDiagnosticRecordDto.comment){
               if(this.mentorDiagnosticRecordDto.comment.length >500){
                  this.$toast("按语最长为500个字符");
                  return false;
               }
            }
            return true;

      },
      // 跟师笔记校验
      checkNote(){
          if(this.mentorStudyRecordDto.noteType === ''){
            this.$toast("请选择类型");
            return false;
          }
          if(this.mentorStudyRecordDto.noteType==1 && !this.mentorStudyRecordDto.bookName){
            this.$toast("请输入典籍名称");
            return false;
          }
          if(!this.mentorStudyRecordDto.studyNotes){
              if(!this.mentorStudyRecordDto.attachments || !this.mentorStudyRecordDto.attachments.length){
                  this.$toast("请输入学习心得");
                  return false;
              }
          }
          if(this.mentorStudyRecordDto.studyNotes){
             if(this.mentorStudyRecordDto.studyNotes.length> 500){
                this.$toast("学习心得最大为500个字符");
                return false;
             }
          }
          return true;
      },
      savePage(){
        this.$refs.entryC.dataFn();
        this.$refs.basis.dataFn1();
        this.$refs.notes.dataFn2();

        // 跟师学习
        let   attentdJson = this.isEqualSame(this.mentorAttendanceRecordDto,this.attendCopy);
        // 临床医案
        let   Diagnostic  = this.isEqualSame(this.mentorDiagnosticRecordDto,this.metorCopy);
        // 跟师笔记
        let   studyJson = this.isEqualSame( this.mentorStudyRecordDto,this.studyCopy);

        if(!attentdJson && !Diagnostic && !studyJson ){
             this.$toast("请先录入数据");
             return;
        }
          /*跟师学习校验*/
          let checkFlag = true;
          if(attentdJson){
              checkFlag =this.checkAllowTeacher();
              if(!checkFlag){
                return;
              }
          }

          //临床医案校验
          if(Diagnostic){
            checkFlag= this.checkYiAn();
            if(!checkFlag){
                return;
            }
          }

          //跟师笔记校验
          if(studyJson){
            checkFlag= this.checkNote();
            if(!checkFlag){
                return;
            }
          }

       this.postJson={
          "mentorAttendanceRecordDto":attentdJson ,
          "mentorStudyRecordDto":  studyJson ,
          "mentorDiagnosticRecordDto" :Diagnostic ,
        };
        this.mergeSave();
      },

      /*保存*/
      mergeSave(){
        const url = this.api.mergeSave;
        this.utils.ajax({
          url:url,
          method:"POST",
          data:this.postJson,
          success:(res)=>{
            if(res.code==0){
              this.$toast("保存成功");
              this.$router.push({name:"masterList"});
            }
          }
        })
      }
    },
    created(){

    },
    mounted() {
      this.activeTabs = this.$route.params.type;
    },
    components: {
      teachingEntryChild: teachingEntryChild,
      chiniBasis: chiniBasis,
      teachingNote: teachingNote,
    }
  }
</script>

<style scoped>
  .wrapper >>> .van-tabs__nav--card {
    margin: 0 4rem;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    background: #f2f2f2;
    flex-direction: column;
  }

  .content {
    flex: 1;
  }
  .card {
    margin-top: 10px;
  }
  /* 临床医案 */
  .yiAnChildBox{
    position: absolute;
    top: 86px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding-left: 0.9375rem;
    box-sizing: border-box;
  }


</style>
