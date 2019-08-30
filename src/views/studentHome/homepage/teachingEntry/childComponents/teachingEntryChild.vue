<template>
            <div class="entryBox">
                <van-cell-group>
                  <!-- v-on:click.native="timeShow()" -->
                    <van-field
                            v-model="mentorAttendanceRecordDto.outCallDate"
                            is-link
                            required
                            :readonly="true"
                            label="出诊时间"
                            input-align="right"
                            placeholder="请选择"
                            label-width="auto"
                            @click="timeClickShow"
                    />
                </van-cell-group>
                <!-- 上传附件 -->
                <van-cell-group>
                   <v-upload-file :activityAttachments="mentorAttendanceRecordDto.attachments"
                                  :itemIndex="0"
                                  :required="true"
                                  @changeImg="changeImg">

                   </v-upload-file>
                </van-cell-group>
                <van-popup v-model="timeShow" position="bottom" :overlay="true">
                    <van-datetime-picker
                        v-model="timeItem"
                        :title="timeTitle"
                        type="date"
                        :min-date="minDate"
                        :max-date="maxDate"
                        @cancel="timeShow=!timeShow"
                        @confirm="timeConfirm"
                        :formatter="formatter"
                        :visible-item-count='num'
                    />
                </van-popup>
            </div>
</template>

<script>
   import uploadFile from "@/components/uploadFile/uploadFile.vue";

    export default {
        name: "teachingEntryChild",
        props:{
          flag:Boolean,
        },
        components: {
          vUploadFile : uploadFile
        },
        data(){
            return {

                lebelText:"附件",
                fileFlag:false,
                imgFlag:true,
                imgList:[],
                pageTrue:false,
                /*时间弹窗↓*/
                timeShow:false,//弹窗开关
                timeTitle:"选择日期",//标题
                num:4,
                timeItem:"",//时间内容
                timeValue:"",//输入框
                minDate:new Date(2019,0,1),
                maxDate:new Date(),
                /*接收后台传来值*/
                data:{},
                am:"",
                outCallDate:'',
                /*传送参数*/
              mentorAttendanceRecordDto:{
                "attachments":[],//附件
                "outCallDate":"",//日期
              },
              //复制
              mentorCopy:{}
            }
        },
        methods:{
          timeClickShow(){
            this.timeItem = new Date();
            this.timeShow = !this.timeShow;

          },
          changeImg(imgList,itemIndex){
            this.mentorAttendanceRecordDto.attachments = imgList;
          },
          dataFn(){

            this.$emit("change",this.mentorAttendanceRecordDto)
          },
          previewClick(attachment, index){
            this.utils.imagePreview(this.imgList);
          },
            /*时间确认*/
          timeConfirm(value){
               this.timeShow = !this.timeShow;
            this.outCallDate =this.utils.formatDate(new Date(value).toLocaleDateString(),"yyyy-MM-dd");
            this.mentorAttendanceRecordDto.outCallDate =  this.outCallDate.replace(/[\u4e00-\u9fa5]/g,"");
          },
          formatter(type,value) {
              return this.utils.pickerType(type,value);
          },
          /**************数据请求******************/
          studyDetail(){
            const url = this.api.studyDetail +''+this.$store.state.teachModifyJson.id;
             let postJson={
                  type:this.$store.state.teachModifyJson.type,
             };
             this.utils.ajax({
               url:url,
               method:"POST",
               data:postJson,
               success:res=>{
                 this.mentorAttendanceRecordDto = Object.assign({},this.mentorAttendanceRecordDto,res.data);
               }
             })
          }

        },
       created(){
         this.mentorCopy = Object.assign({},this.mentorAttendanceRecordDto);
       },
        mounted(){
          if( this.flag){
            this.studyDetail()
          }

        }
    }
</script>

<style scoped>

    .entryBox{
        position: relative;
        padding-left:0.9375rem;
        box-sizing: border-box;
        background:#fff;
    }
    /*附件*/
    .nearBy{
        font-size:0.875rem;
        text-align: left;
        padding:0.625rem 0.45rem;
        box-sizing: border-box;
    }
    .star{
        color:red;
        margin-right:3px;
    }
    .nearByText{

        padding-bottom:10px;
        box-sizing: border-box;
    }
    /*图片*/
    .imgBox {
      display: flex;
    }
    .icon-box{
        width:76px;
        height:76px;
        border:1px solid #ccc;
        font-size:35px;
        background: #f5f5f5;
        position: relative;
        margin:10px 5px 10px 0;
        color:#999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .icon-box img{
        width:100%;
        overflow: hidden;
    }
    .iconDel{
        position: absolute;
        top:0;
        right:0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:20px;
        width:30px;
        height:30px;
        background:#666;
        opacity: .8;
    }
</style>
