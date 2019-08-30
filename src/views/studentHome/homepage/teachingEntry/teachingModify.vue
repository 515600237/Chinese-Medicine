<template>
          <div class="teaching-Modify">
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
            <div class="teaching-box">
              <teaching-entry-child
                v-if="type==1"
                ref="entryC"
                @change="studyChange"
                :flag="isPage"
              >
              </teaching-entry-child>
              <clinical-basis
                v-if="type==3"
                @basisChange="basisChange"
                ref="basis"
                :flag="isPage"
              >

              </clinical-basis>
              <teaching-Note
                v-if="type==2"
                ref="notes"
                @noteChange="noteChange"
                :flag="isPage"
              >
              </teaching-Note>
              <div class="deleteBtn btn" @click="delClick">删除</div>
            </div>
          </div>
</template>

<script>
  import teachingEntryChild from "@/views/studentHome/homepage/teachingEntry/childComponents/teachingEntryChild"//跟师笔记
  import clinicalBasis from "@/views/studentHome/homepage/teachingEntry/childComponents/clinicalBasis"//临床医案
  import teachingNote from "@/views/studentHome/homepage/teachingEntry/childComponents/teachingNote" //跟师笔记
  export default {
    name: "teachingModify",
    data(){
      return{
        headTitle:"修改师承录入信息",
        isPage:true,//判断页面
        isShow:1,
        json:{},
        id:0,//根据ID判断修改和删除
        type:0,//根据类型判断哪个页面
        mentorAttendanceRecordDto:{},//学习
        mentorStudyRecordDto:{},//笔记
        mentorDiagnosticRecordDto:{},//临床医案
      }
    },
    methods:{
      delClick(){
        this.confirmDialog("确定删除吗?",(res)=>{
            console.log(res);
            if(res){
               this.teachDel();
            }
        })
      },
      studyChange(data){

        this.mentorAttendanceRecordDto = Object.assign({},this.mentorAttendanceRecordDto,data)
      },
      basisChange(data){

        this.mentorDiagnosticRecordDto = Object.assign({}, this.mentorDiagnosticRecordDto,data);
      },
      noteChange(data){

        this.mentorStudyRecordDto = Object.assign({},this.mentorStudyRecordDto,data)
      },
      goPage(){
        this.$router.push({name:"masterList"})
      },
      /*保存*/
      savePage(){
        let checkFlag = true;
        if(this.type==1){
          this.$refs.entryC.dataFn();
          checkFlag =this.checkAllowTeacher();
          console.log(this.mentorAttendanceRecordDto);
          if(!checkFlag){
            return;
          }
          this.studyUpdate();
        }
        if(this.type==2){
          this.$refs.notes.dataFn2();
          checkFlag= this.checkNote();
            if(!checkFlag){
                return;
            }
          console.log(this.mentorStudyRecordDto);
          this.noteUpdate();
        }
        if(this.type==3){
          this.$refs.basis.dataFn1();
          checkFlag= this.checkYiAn();
            if(!checkFlag){
                return;
            }
          this.caseUpdate();
        }

      },
      checkAllowTeacher(){
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
      checkYiAn(){
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
      /**************数据请求**********************/
      /*修改*/
      studyUpdate(){
          const url = this.api.studyUpdate+''+ this.$store.state.teachModifyJson.id;
          this.utils.ajax({
            url:url,
            method:"POST",
            data:this.mentorAttendanceRecordDto,
            success:res=>{
              if(res.code==0){
                this.$toast("修改成功");
                this.$router.go(-1);
              }

            }
          })
      },
      noteUpdate(){
        const url = this.api.noteUpdate+''+ this.$store.state.teachModifyJson.id;
        this.utils.ajax({
          url:url,
          method:"POST",
          data:this.mentorStudyRecordDto,
          success:res=>{
            if(res.code==0){
              this.$toast("修改成功");
              this.$router.go(-1);
            }
          }
        })
      },
      caseUpdate(){
        const url = this.api.caseUpdate+''+ this.$store.state.teachModifyJson.id;
        this.utils.ajax({
          url:url,
          method:"POST",
          data:this.mentorDiagnosticRecordDto,
          success:res=>{
            if(res.code==0){
              this.$toast("修改成功");
              this.$router.go(-1);
            }
          }
        })
      },
      // 删除后返回
      goBack(){
        setTimeout( ()=> {
          this.$router.go(-1);
        },200)
      },
      /*删除*/
      teachDel(){
        let  url = this.api.teachDel+''+ this.$store.state.teachModifyJson.id+'?'+'type'+'='+this.type;
        this.utils.ajax({
          url:url,
          method:"POST",
          success:res=>{
            if(res.code==0){
              this.$toast("删除成功");
              this.goBack();
            }
          }
        })
      },

    },
    created(){
      this.json = this.$store.state.teachModifyJson;
      this.id   = this.json.id;
      this.type = this.json.type;
      console.log(this.json);
    },
    mounted(){

    },
    components: {
      teachingEntryChild:teachingEntryChild,
      clinicalBasis:clinicalBasis,
      teachingNote: teachingNote,
    }
  }
</script>

<style scoped>
  .teaching-Modify{
    width:100%;
    background:#f2f2f2;
  }
  .teaching-box{
    position: absolute;
    width:100%;
    height:580px;
  }
  .deleteBtn{
    width: 95%;
    height: 2rem;
    line-height: 2rem;
    border-radius: 0.25rem;
    margin: 0.9375rem auto 0;
    border: none;
    background: #f04844;
    color: #fff;
    font-size: 0.875rem;
  }
</style>