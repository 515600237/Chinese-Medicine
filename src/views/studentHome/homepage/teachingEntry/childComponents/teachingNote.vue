<template>
        <div class="section">
            <ul>
                <li v-for="(item,index) of typeList" :key="index">
                    <van-cell-group v-if="item.type=='button'" van-hairline--surround>
                        <van-field
                                :label="item.label"
                                :placeholder="item.placeholder"
                                required
                                clearable
                                disabled
                                :input-align="item.direction"
                                :label-width="item.labelWidth"
                        >
                            <div slot="button" class="typeBtn">
                                <span class="btn"
                                      v-model="active"
                                      :class="{'active':active==index}"
                                      @click="btnClick(item,index)"
                                        v-for="(item,index) of btnList"
                                      :key="index"
                                >
                                    {{item.name}}
                                </span>
                            </div>
                        </van-field>
                    </van-cell-group>
                    <van-cell-group v-if="item.type=='text'&& active==1" van-hairline--surround>
                        <van-field
                                v-model="mentorStudyRecordDto.bookName"
                                :label="item.label"
                                :placeholder="item.word"
                                :required="item.flag"
                                maxlength="10"
                                clearable
                                :input-align="item.direction"
                                :label-width="item.labelWidth"
                                @blur="handleBlur(item)"
                        >
                        </van-field>
                    </van-cell-group>
                    <van-cell-group v-if="item.type=='textarea'" class="textarea" van-hairline--surround>
                        <van-field
                                v-model=" mentorStudyRecordDto.studyNotes"
                                type="textarea"
                                :placeholder="item.word"
                                :label="item.label"
                                label-width="auto"
                                rows="3"
                                :maxlength="item.len"
                                required
                                @input="onChange"
                        >
                        </van-field>
                        <p class="textNum">{{noteNum}}/{{item.len}}</p>

                        <div class="parentUploadBox">
                            <v-upload-file
                            :activityAttachments="mentorStudyRecordDto.attachments" 
                            :itemIndex="0"
                            :required="false"   
                            @changeImg="changeImg"></v-upload-file>
                        </div>
                        
                    </van-cell-group>
                </li>
            </ul>

        </div>
</template>

<script>
   import uploadFile from "@/components/uploadFile/uploadFile.vue";

    export default {
        name: "teachingNote",
        components: {
            vUploadFile : uploadFile
        },
        props:{
            flag:Boolean,
        },
        data(){
            return {
                noteNum:0,//学习心得控制字数
                lebelText:"附件",
                typeList:[
                    {
                        type:"button",
                        label:"类型",
                        labelWidth:"auto",
                        direction:"right",
                    },
                    {
                        type:"text",
                        value:"",
                        label:"典籍名称",
                        labelWidth:"auto",
                        direction:"right",
                        word:"请输入典籍名称",
                        flag:true,
                    },
                    {
                        type:"textarea",
                        value:"",
                        label:"学习心得",
                        word:"请输入内容",
                        len:"500",
                    },
                ],
                /*按钮*/
                active:-1,
                btnList:[
                    {
                        id:1,
                        name:"跟师心得体会"
                    },
                    {
                        id:2,
                        name:"学习中医典籍体会"
                    },
                    {
                        id:3,
                        name:"其他"
                    }

                ],
                mentorStudyRecordDto: {
                    "attachments": [],//附件
                    "bookName": "", //典籍名称
                    "noteType":"",  //类型
                    "studyNotes": ""    //学习心得
                },
                studyCopy:{}
            }
        },
        methods:{
            changeImg(imgList,itemIndex){
                    this.mentorStudyRecordDto.attachments= imgList;
            },
            btnClick(item,index){
                this.active = index;
                this.mentorStudyRecordDto.noteType = index;
                // if(this.flag){
                //     this.mentorStudyRecordDto.noteType = this.$store.state.teachModifyJson.noteType;
                // }
            },
            /*文字*/
            onChange(){
                this.noteNum = this.mentorStudyRecordDto.studyNotes.length
            },
            handleBlur(item){},
            dataFn2(){
                this.$emit("noteChange",this.mentorStudyRecordDto)
            },
            /******************数据请求**********************8*/
            noteDetail(){
                const url = this.api.noteDetail + ''+this.$store.state.teachModifyJson.id;
                let postJson={
                    type:this.$store.state.teachModifyJson.type,
                }
                this.utils.ajax({
                    url:url,
                    method:"POST",
                    data:postJson,
                    success:res=>{
                     this.mentorStudyRecordDto = Object.assign({}, this.mentorStudyRecordDto,res.data)
                    }
                })
            }
        },
        create(){
            this.studyCopy = Object.assign({},this.mentorStudyRecordDto);
        },
        mounted(){

            if(this.flag){
                this.noteDetail()
                this.active = this.$store.state.teachModifyJson.noteType
            }

        }

    }
</script>

<style scoped>
    .section{
        background:#fff;
        position: relative;
        padding-left: 0.9375rem;
        box-sizing: border-box;
    }
    /*初诊复诊按钮*/
    .typeBtn{
        display: flex;
        overflow: hidden;
        border-radius:5px;
        border:1px solid #ccc;
    }
    .typeBtn .btn{
        height:1.875rem;
        padding:0 0.5rem;
        box-sizing: border-box;
        font-size:0.75rem;
        line-height:1.875rem;
        border-right: 1px solid #ccc;
        text-align: center;
    }
    .typeBtn .btn:nth-of-type(3){
        border-right:none;
    }
    .active{
        background:#A083E0;
        color:#fff;
    }
    /*文本域*/
    .textarea{
        position: relative;
    }
    .textNum{
        position:absolute;
        right:0.9375rem;
        top:75px;
        bottom:0;
        color:#ccc;
        font-size:12px;
    }
    .section >>> ul .van-field--min-height .van-field__control{
        text-indent:1.7rem;

    }
    .section >>> van-hairline--top-bottom{
        border-bottom: transparent;
    }

    /*附件*/
    .parentUploadBox{
        padding-left: 75px;
    }
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
    .icon-box{
        width:70px;
        height:70px;
        background:#F5F5F5;
        font-size:35px;
        color:#ccc;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .icon-box{
        width:80px;
        height:80px;
        border:1px solid #ccc;
        font-size:40px;
        background: #f2f2f2;
        position: relative;
        margin:10px 0;
    }
    .icon-box img{
        width:80px;
    }
    .iconDel{
        position: absolute;
        right:0;
        bottom:0;
        font-size:20px;
        width:30px;
        height:30px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }
    .section >>> .van-cell:not(:last-child)::after{
        border-bottom:0;
    }
</style>