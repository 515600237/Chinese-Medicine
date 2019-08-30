<template>
  <div class="teaching-wrapper">
    <!--header-->
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
    <!--content-->
    <div class="content" v-if="postList" ref="postList">
      <div class="postList" >
        <ul class="content-ul" v-for="(item,index) of postList" :key="index">
          <li>
            <!--日期-->
            <van-cell-group>
              <van-field
                v-model="item.activityDate"
                :is-link="true"
                :readonly="true"
                placeholder="请选择"
                label="日期"
                label-width="auto"
                input-align="right"
                :required="true"
                @click="TimeClick(item)"
              ></van-field>
            </van-cell-group>

            <van-cell-group>
              <van-field
                v-model="item.typeName"
                :is-link="true"
                :readonly="true"
                placeholder="请选择"
                label="活动形式"
                label-width="auto"
                input-align="right"
                :required="true"
                @click="selectText(item,1)"
              ></van-field>
            </van-cell-group>

            <van-cell-group>
              <van-field
                v-model="item.levelName"
                :is-link="true"
                :readonly="true"
                placeholder="请选择"
                label="教学层次"
                label-width="auto"
                input-align="right"
                :required="true"
                @click="selectText(item,2)"
              ></van-field>
            </van-cell-group>

            <van-cell-group  class="textarea">
              <van-field
                v-model="item.activityContent"
                :is-link="false"
                :readonly="false"
                placeholder="请输入内容"
                label="活动内容"
                label-width="auto"
                :required="true"
                type ="textarea"
                rows="3"
                :border="true"
                @input="textAreaInp"
                maxlength="200"
              ></van-field>
              <p class="textNum">{{textNum}}/200</p>
            </van-cell-group>

            <van-cell-group>
              <van-field
                v-model="item.durationName"
                :is-link="true"
                :readonly="true"
                placeholder="请选择"
                label="学时"
                label-width="auto"
                input-align="right"
                :required="true"
                @click="selectText(item,3)"
              ></van-field>
            </van-cell-group>

            <van-cell-group>
              <van-field
                v-model="item.keynoteSpeaker"
                :is-link="false"
                :readonly="false"
                placeholder="请输入主讲人/组织者姓名"
                label="主讲人/组织者"
                label-width="auto"
                maxlength="20"
                input-align="right"
                :required="true"
              ></van-field>
            </van-cell-group>
          </li>
          <!-- 附件上传 -->
          <li class="file-li">
            <div class="file-li-box">
              <v-upload-file
              :activityAttachments="item.activityAttachments"
              :itemIndex="index"
              @changeImg="changeImg">
              </v-upload-file>
            </div>
          </li>
          <li></li>
        </ul>
        <div class="iconBox">
          <div class="add" @click="AddClick()">
            <van-icon name="add" color="#A083E0" class="add-icon"/>
            <span>新增</span>
          </div>
          <div class="add reduce" v-if="postList.length&&postList.length >1" @click="clearClick()">
            <van-icon name="delete" color="#FF0000" class="add-icon"/>
            <span>删除</span>
          </div>
        </div>
      </div>

    </div>

    <!--日期弹窗-->
    <van-popup v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="timeValue"
        title="选择日期"
        type="date"
        @cancel="timeShow= false"
        @confirm="TimeConfirm"
        :min-date='minDate'
        :max-date="maxDate"
        :formatter="formatter"
      />
    </van-popup>
    <!--活动形式/教学层次/学时-->
    <van-popup v-model="isShow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :title="title"
        :columns="columns"
         :value-key="keyName"
        :default-index="0"
        @cancel="isShow= false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
  import uploadFile from "@/components/uploadFile/uploadFile.vue";
  import BScroll from "better-scroll";
  export default {
    name: "teachingActiveIndex",
    components: {
      vUploadFile : uploadFile
    },

    data() {
      return {
        idx:0,
        /*头部标题*/
        headTitle: "",
        /*控制点击事件下标值*/
        activeIndex: 0,
        cancel: "取消",
        /*时间弹窗↓*/
        timeShow: false,//弹窗开关
        timeTitle: "选择日期",//标题
        minDate:new Date(this.Global.currentItem.currentRotationStartTime.replace(/-/g, '/')),
        maxDate:new Date(this.Global.currentItem.SelectRotationEndTime),
        timeItem: "",//时间内容
        timeValue: "",//时间
        /*活动形式/教学活动/学时↓*/
        isShow: false,
        columns: [],
        title: "",
        objJson: {
          0: ["院级以上", "院级", "专业基地", "科室"],
          1: ["好", "中等", "不合格", "极差"],
          2: [1.5, 2.5, 3, 4],
        },
        /*活动内容，输入多少字数↓*/
        textNum: 0,
        /*附件*/
        fileShow: false,

        fileFlag: false,
        imgFlag: true,
        postList: [],
        ysJson:{
            "activityAttachments": [],
            "activityContent": "",
            "activityDate": null,
            "activityDuration": null,
            "activityLevel": null,
            "activityType": null,

            "typeName":"",//显示用
            "levelName":"",
            "durationName":"",

            "id": 0,
            "keynoteSpeaker": "",
            "scheduleId": this.Global.scheduleId || 0,
        },
        activeJson: {},
        activeSelectType:1,
        keyName: "name",
      }
    },

    created(){
       this.postList = [];
       let addJson = JSON.parse( JSON.stringify(this.ysJson));
       this.postList.push( addJson);
       this.headTitle = this.Global.currentItem.departmentName;
    },
    methods: {
      changeImg(imgList,itemIndex){
         console.log(imgList);
         console.log(itemIndex);
         console.log(this.postList);
         this.postList[itemIndex].activityAttachments = imgList;
         console.log(this.postList);
      },
      /*返回*/
      goPage(){
        this.$router.push({name: "homeindex"})
      },
    addZero(s){
        return s < 10 ? '0' + s: s;
    },
    fomateData(value){
      let day= new Date(value);
      day = day.getFullYear()+"-"+this.addZero(day.getMonth()+1)+"-"+this.addZero(day.getDate());
      return day;
    },
      // 时间选择
    TimeClick(item) {
      this.activeJson = item;
      // timeItem 时间插件显示的时间
      this.timeValue = new Date(item.activityDate || new Date());
      this.timeShow = true;
    },
      /*时间确认*/
      TimeConfirm(value) {
        this.timeShow = false;
        const activeTime = this.utils.formatDate(new Date(value).toLocaleDateString(), 'yyyy-MM-dd');
        this.activeJson.activityDate = activeTime;
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      // type 1活动形式，2教学层次，3学时
      selectText(item,type){
         let titleJson={
            1:"教学活动",
            2: "教学层次",
            3: "学时"
         };
         let columsJson = {
            1: this.constantData.activityType,
            2: this.constantData.activityLevel,
            3: this.constantData.activityDuration
         };
        //  弹窗显示
        this.title = titleJson[type];
        this.columns =columsJson[type];
        this.keyName ="name";
        // 设置当前值
        this.activeJson = item;
        this.activeSelectType = type;
         this.isShow = true;
      },
      // 弹窗确认
      onConfirm(value, index) {
        console.log(value+"---"+index);
        let typeJson = {
            1: "activityType",
            2: "activityLevel",
            3: "activityDuration"
         };
         let showNameJson={
            1: "typeName",
            2: "levelName",
            3: "durationName"
         };
        let type= typeJson[this.activeSelectType];
        this.activeJson[type] = value.id;

        let showName= showNameJson[this.activeSelectType];
        this.activeJson[showName] = value.name;

        this.isShow = !this.isShow;
      },
      /*保存*/
      savePage() {
          const url = this.api.activitySave;
          // let postArrlist = this.postList;
          let postArrlist = [].concat(this.postList);
          let activeFlag = postArrlist.every((item)=>{
              if(!item.activityDate){
                  this.$toast("请选择活动日期");
                  return false;
              }
              if(!item.activityType){
                  this.$toast("请选择活动形式");
                  return false;
              }
              if(!item.activityLevel){
                  this.$toast("请选择教学层次");
                  return false;
              }
              if(!item.activityContent){
                  this.$toast("请输入活动内容");
                  return false;
              }
              if(!item.activityDuration){
                  this.$toast("请选择学时");
                  return false;
              }
              if(item.activityContent.length >200){
                   this.$toast("活动内容不能超过200个字符");
                   return false;
              }
              if(!item.keynoteSpeaker){
                  this.$toast("请输入主讲人/组织者姓名");
                  return false;
              }
              // if(!item.activityAttachments || item.activityAttachments.length==0){
              //     this.$toast("请上传附件");
              //     return false;
              // }
              if(item.keynoteSpeaker.length > 20){
                  this.$toast("主讲人/组织者姓名不能超过20个字符");
                  return false;
              }
              return true;
          })
          if(!activeFlag){
             return;
          }
          let postAjax ={
            listData : postArrlist
          }
          postArrlist.forEach(i => {
            delete i.typeName;
            delete i.levelName;
            delete i.durationName;
          });
          this.utils.ajax({
            url: url,
            method: "POST",
            data: postAjax,
            success: res => {
              console.log(res);
              if (res.code == 0) {
                this.$toast("新增教学活动成功");
                this.$router.push({ name: "teacherActiveList"});
              }else{
                this.$toast(res.msg);
              }
            }
          });
      },
      /*文本域*/
      textAreaInp(item) {
        console.log(item)
        let txtVal = item.length;
        this.textNum = txtVal;
      },
      // 整体新增删除
      AddClick(){
          if(this.postList.length < 10){
            let addJson = JSON.parse( JSON.stringify(this.ysJson));
            this.postList.push(addJson)
          }

      },
      clearClick(){
        if(this.postList.length >= 2){
          this.postList.pop();
        }
      },

    },
    mounted(){
      this.$nextTick(() =>{
        this.scroll =  new BScroll(this.$refs.postList, {
          mouseWheel: true,
          click: true,
          tap: true
        });
        console.log(this.scroll)
      })
    },

  }
</script>

<style scoped>
  .teaching-wrapper {
    width: 100%;
    height: 100%;
    background: #F2F2F2;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .content {
    flex: 1;
    width:100%;

    position: absolute;
    top:2.875rem;
    left:0;
    right:0;
    bottom:10px;
    overflow: hidden;
  }

  .content-ul {
    background: #fff;
    padding-left:0.9375rem;
  }
  .content-ul:not(:first-child){
    margin-top:20px;
  }

  /*新增、删除图标 class类名起的不好*/
  .content-ul li:last-of-type {
    margin: 0;
    background: #f2f2f2;
  }

  .iconBox {
    display: flex;
    padding-top: 10px;
    box-sizing: border-box;
    flex-direction: row-reverse;
    background: #f2f2f2;
  }

  .add {
    display: flex;
    font-size: 12px;
    margin-right: 24px;
    color: #A083E0;

  }

  .add .add-icon {
    font-size: 18px;
  }

  .add span {
    margin-left: 5px;
  }

  .reduce {
    color: red;
  }

  /*文本域里面的字体*/
  .textarea {
    position: relative;
  }

  .textNum {
    position: absolute;
    right: 0.9375rem;
    bottom: 0;
    color: #ccc;
    font-size: 12px;
  }

  .teaching-wrapper >>> ul .van-field--min-height .van-field__control {
    text-indent: 1em;
  }
  /* >>> .nearByText::before{
      position: absolute;
      left: 0.5rem;
      color: #f44;
      font-size: 0.875rem;
      content: '*';
    }
  >>> .nearByText{
      padding-left: 0.55rem;
  } */
</style>
