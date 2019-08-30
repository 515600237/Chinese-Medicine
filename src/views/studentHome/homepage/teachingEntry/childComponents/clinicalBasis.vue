<template>
  <div class="content"  >
    <div ref="basisContent" class="scroll-content">
      <ul class="ulBox">
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.medicalRecordNo"
              label="病历号"
              placeholder="请输入病历号"
              required
              maxlength="30"
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.patientName"
              label="病人姓名"
              placeholder="请输入病人姓名"
              required
              maxlength="30"
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.visitTime"
              label="就诊时间"
              placeholder="请选择"
              :readonly="true"
              required
              is-link
              @click="timeClick"
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              label="就诊类型"
              required
              :readonly="true"
              label-width="auto"
            >
              <div slot="button" class="typeBtn">
                <span class="btn"
                      v-model="active"
                      :class="{'active':active==index}"
                      @click.stop="btnClick(item,index)"
                      v-for="(item,index) of btnList"
                      :key="index">
                  {{item.name}}
                </span>
              </div>
            </van-field>

          </van-cell-group>
        </li>
        <li v-if="active==1">
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.subsequentVisitNum"
              label="复诊次数"
              placeholder="请输入复诊次数"
              required
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.chiefComplaint"
              label="主诉"
              placeholder="请输入主诉"
              required
              maxlength="30"
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.chineseMedicineDiagnosis"
              label="中医诊断"
              placeholder="请输入中医诊断"
              required
              maxlength="30"
              input-align="right"
              label-width="auto"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.westernMedicineDiagnosis"
              label="西医诊断"
              placeholder="请输入西医诊断"
              input-align="right"
              label-width="auto"
              maxlength="20"
            >
            </van-field>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group  class="textarea" van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.recipe"
              type="textarea"
              placeholder="请输入处方"
              label="处方"
              label-width="auto"
              rows="3"
              maxlength="500"
              required
              @input="onChange()"
            >
            </van-field>
            <p class="textNum">{{recipeNum}}/{{500}}</p>
            <div class="parentUploadBox">
                <v-upload-file
                :activityAttachments="mentorDiagnosticRecordDto.recipeAttachments"
                :itemIndex="0"
                :required ="false"
                @changeImg="changeImg1"></v-upload-file>
            </div>
          </van-cell-group>
        </li>
        <li>
          <van-cell-group  class="textarea" van-hairline--surround>
            <van-field
              v-model="mentorDiagnosticRecordDto.comment"
              type="textarea"
              placeholder="请输入按语"
              label="按语"
              label-width="auto"
              rows="3"
              maxlength="500"
              required
              @input="onChange()"
            >
            </van-field>
            <p class="textNum">{{commentNum}}/{{500}}</p>
            <div class="parentUploadBox">
                <v-upload-file
                :activityAttachments="mentorDiagnosticRecordDto.commentAttachments"
                :itemIndex="0"
                :required ="false"
                @changeImg="changeImg2"></v-upload-file>
            </div>
          </van-cell-group>
        </li>
      </ul>
    </div>


    <!--就诊时间弹窗-->
    <van-popup v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="timeItem"
        :title="timeTitle"
        type="date"
        @cancel="timeShow=!timeShow"
        @confirm="TimeConfirm"
        :max-date="maxDate"
        :min-date="minDate"
        :formatter="formatter"
      />
    </van-popup>

  </div>
</template>

<script>
  import uploadFile from "@/components/uploadFile/uploadFile.vue";
  import BScroll   from "better-scroll"
  export default {
    name: "ChinicalBasis",
    components: {
      vUploadFile : uploadFile
    },
    props:{
      flag:Boolean
    },
    data() {
      return {
        mentorDiagnosticRecordDto: {
          "chiefComplaint": "",//主诉
          "chineseMedicineDiagnosis": "", //中医诊断
          "comment": "",//按语
          "commentAttachments": [
          ],//按语附件
          "medicalRecordNo": "",//病历号
          "patientName": "",//病人姓名
          "recipe": "",//处方
          "recipeAttachments": [

          ],//处方附件
          "subsequentVisitNum":"" ,//复诊次数
          "visitTime": "",//就诊时间
          "visitType":"",//就诊类型
          "westernMedicineDiagnosis": ""//西医诊断
        },
        /*时间弹窗↓*/
        timeShow: false,//弹窗开关
        timeTitle: "选择日期",//标题
        minDate:new Date(2019,0,1),
        maxDate:new Date(),
        timeItem: "",//时间内容
        timeValue: "",//输入框

        /*列表*/
        loading: true,
        finished: true,
        active: -1,
        /*文本域*/
        commentNum: 0,//按语
        recipeNum:0,//处方
        lebelText: "附件",
        btnList: [{id: 1, name: "初诊"}, {id: 2, name: "复诊"}],
        DiagnosticCopy:{},
      }
    },
    methods: {
      changeImg1(imgList,itemIndex){
            if(imgList.length){
              this.mentorDiagnosticRecordDto.recipeAttachments = imgList;
            }

      },
      regNumber() {
        let num = this.mentorDiagnosticRecordDto.subsequentVisitNum;
        if(/\D/.test(num.split('')[0])){
          this.mentorDiagnosticRecordDto.subsequentVisitNum = '';
          return;
        }
        if (/\D/.test(num)) {
          this.mentorDiagnosticRecordDto.subsequentVisitNum = parseInt(num)
        }
      },
      changeImg2(imgList,itemIndex){
        if(imgList.length){
          this.mentorDiagnosticRecordDto.commentAttachments = imgList;
        }
      },
      dataFn1(){
        this.$emit("basisChange",this.mentorDiagnosticRecordDto);
      },
      btnClick(item,index){
        this.active=index;
        this.mentorDiagnosticRecordDto.visitType = index;
        if(this.flag){
          this.mentorDiagnosticRecordDto.visitType = index;
        }
      },
      timeClick(){
        this.timeItem = new Date();
        this.timeShow  =true;
      },
      onLoad() {},
      /*时间确认*/
      TimeConfirm(value) {
        this.timeShow = !this.timeShow;
        this.mentorDiagnosticRecordDto.visitTime = this.utils.formatDate(new Date(value).toLocaleDateString(), 'yyyy-MM-dd');
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      onChange(item){
        if(this.mentorDiagnosticRecordDto.recipe.length){
          this.recipeNum =  this.mentorDiagnosticRecordDto.recipe.length;
        }
      if(this.mentorDiagnosticRecordDto.comment.length){
        this.commentNum  = this.mentorDiagnosticRecordDto.comment.length;
      }


      },
      /******************数据请求************************/
      caseDetail(){
        const url = this.api.caseDetail  + "" + this.$store.state.teachModifyJson.id;
              let postJson={
                type:this.$store.state.teachModifyJson.type,
              };
           this.utils.ajax({
             url:url,
             method:"POST",
             data:postJson,
             success:res=>{
               this.mentorDiagnosticRecordDto = Object.assign({},this.mentorDiagnosticRecordDto,res.data)
             }
           })
      }
    },
    created(){


    },
    mounted(){

      if (this.flag){
        this.caseDetail();
        this.active = this.$store.state.teachModifyJson.visitType
      }
      this.$nextTick(() =>{
      this.scroll =  new BScroll(this.$refs.basisContent, {
        mouseWheel: true,
        click: true,
        tap: true
      });
      })
    }
  }
</script>

<style scoped>

  .content {
    width: 100%;
    height:580px;
    background: #fff;
    padding-left: 0.9375rem;
    box-sizing: border-box;
  }
  .scroll-content{
    position: absolute;
    width: 100%;
    overflow: hidden;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: #fff;
  }
  /*初诊复诊按钮*/
  .typeBtn {
    display: flex;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .typeBtn .btn {
    width: 76px;
    height: 1.875rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
    font-size: 0.75rem;
    line-height: 1.875rem;
    border-right: 1px solid #ccc;
    text-align: center;
  }

  .typeBtn .btn:nth-of-type(2) {
    border-right: none;
  }

  .active {
    background: #A083E0;
    color: #fff;
  }

  /*文本域*/
  .textarea {
    position: relative;
    margin-bottom: 20px;
  }

  .textNum {
    position: absolute;
    right: 0.9375rem;
    top: 75px;
    bottom: 0;
    color: #ccc;
    font-size: 12px;
  }
  .content >>>  .van-field--min-height .van-field__control {
    text-indent: 1.7rem;

  }
  .content >>> van-hairline--top-bottom {
    border-bottom: transparent;
  }
  /*附件*/
  .parentUploadBox{
    padding-left: 56px;
  }
  .icon-box {
    width: 70px;
    height: 70px;
    margin-left: 1.7rem;
    background: #F5F5F5;
    font-size: 35px;
    color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-box {
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    font-size: 40px;
    background: #f2f2f2;
    position: relative;
  }

  .icon-box img {
    width: 80px;
  }

  .iconDel {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .content >>> .van-cell:not(:last-child)::after {
    border-bottom: 0;
  }

  .content >>> .van-hairline--top-bottom::after {
    border-width: 0.0625rem 0 0 0;
  }
  /* 滚动区域 */
  .ulBox{
    padding-bottom: 100px;
  }

</style>