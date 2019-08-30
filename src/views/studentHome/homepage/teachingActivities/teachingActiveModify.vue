<template>
  <div class="teaching-wrapper">
    <!--header-->
    <van-nav-bar
      :title="headTitle"
      left-text="返回"
      left-arrow
      @click-left="goBack"
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
    <div class="content">
      <ul class="content-ul">
        <li>
          <!--日期-->
          <van-cell-group>
            <van-field
              v-model="postJson.activityDate"
              :is-link="true"
              :readonly="true"
              placeholder="请选择"
              label="日期"
              label-width="auto"
              input-align="right"
              :required="true"
              @click="TimeClick()"
            ></van-field>
          </van-cell-group>

          <van-cell-group>
            <van-field
              v-model="postJson.typeName"
              :is-link="true"
              :readonly="true"
              placeholder="请选择"
              label="活动形式"
              label-width="auto"
              input-align="right"
              :required="true"
               @click="selectText(1)"
            ></van-field>
          </van-cell-group>

          <van-cell-group>
            <van-field
              v-model="postJson.levelName"
              :is-link="true"
              :readonly="true"
              placeholder="请选择"
              label="教学层次"
              label-width="auto"
              input-align="right"
              :required="true"
               @click="selectText(2)"
            ></van-field>
          </van-cell-group>

           <van-cell-group  class="textarea">
            <van-field
              v-model="postJson.activityContent"
              :is-link="false"
              :readonly="false"
              placeholder="请输入内容"
              label="活动内容"
              label-width="auto"
              input-align="right"
              :required="true"
              type ="textarea"
              rows="3"
              :border="true"
              maxlength="200"
            ></van-field>
            <p class="textNum">{{textNum}}/200</p>
          </van-cell-group>

          <van-cell-group>
            <van-field
              v-model="postJson.durationName"
              :is-link="true"
              :readonly="true"
              placeholder="请选择"
              label="学时"
              label-width="auto"
              input-align="right"
              :required="true"
               @click="selectText(3)"
            ></van-field>
          </van-cell-group>

          <van-cell-group>
            <van-field
              v-model="postJson.keynoteSpeaker"
              :is-link="false"
              :readonly="false"
              placeholder="请输入主讲人/组织者姓名"
              label="主讲人/组织者"
              label-width="auto"
              input-align="right"
              :required="true"
            ></van-field>
          </van-cell-group>
        </li>
         <!-- 附件上传 -->
        <li>
          <v-upload-file
            :activityAttachments="postJson.activityAttachments"
            :itemIndex="0"
            @changeImg="changeImg"
          ></v-upload-file>

        </li>
      </ul>
      <button class="deleteBtn" @click="deleteDataConfirm">删除</button>
    </div>

    <!--日期弹窗-->
    <van-popup v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="timeValue"
        title="选择日期"
        type="date"
        @cancel="timeShow= false"
        @confirm="TimeConfirm"
        :max-date="maxDate"
        :min-date="minDate"
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

  export default {
    name: "teachingActiveIndex",
    components: {
      vUploadFile : uploadFile
    },

    data() {
      return {
        modifyId: 0,
        /*头部标题*/
        headTitle: "中医外科",
        /*控制点击事件下标值*/
        activeIndex: 0,
        /*时间弹窗↓*/
        timeShow: false,//弹窗开关
        timeTitle: "选择日期",//标题
        minDate:new Date(this.Global.currentItem.currentRotationStartTime),
        maxDate:new Date(this.Global.currentItem.SelectRotationEndTime),
        timeItem: "",//时间内容
        timeValue: "",//时间
        /*活动形式/教学活动/学时↓*/
        isShow: false,
        columns: [],
        title: "",
        /*活动内容，输入多少字数↓*/
        textNum: 0,
        /*附件*/
        fileShow: false,

        postJson:{
            "activityAttachments": [],
            "activityContent": "",
            "activityDate": this.fomateData(new Date()),
            "activityDuration": null,
            "activityLevel": null,
            "activityType": null,
            "id": 0,
            "keynoteSpeaker": "",
            "scheduleId": 0,
        },
        activeJson: {},
        activeSelectType:1,
        keyName: "name",
      }
    },

    created(){
       this.modifyId = this.$store.state.teachActiveId;
       console.log(this.modifyId);
       //获取详情数据
       this.getModifyInfo();
    },
    methods: {
      changeImg(imgList,itemIndex){
         this.postJson.activityAttachments = imgList;
      },
       getModifyInfo(){
        const url = this.api.activityDetail+"/"+this.modifyId;
        console.log(url);
        this.utils.ajax({
          url:url,
          method:"post",
          success:res=>{
            console.log(res);
            if(res.data.scheduleStartDate && res.data.scheduleEndDate){
              this.minDate = new Date(res.data.scheduleStartDate.replace(/-/g, '/'));
              let endTime = res.data.scheduleEndDate;
              endTime = new Date(res.data.scheduleEndDate.replace(/-/g, '/'));
              this.maxDate = endTime;
              if(endTime.getTime() > new Date().getTime()){
                this.maxDate = new Date();
              }
            }
            if(res.code == 0 && res.data){
                 let postJson = res.data;
                 let typeIndex = Number(postJson.activityType) - 1;
                 let levelIndex = Number(postJson.activityLevel) - 1;
                 if (postJson.activityType == 99) {
                   typeIndex = 6;
                 }
                 postJson.typeName = this.constantData.activityType[typeIndex].name;
                 postJson.levelName = this.constantData.activityLevel[levelIndex].name;
                 postJson.durationName = postJson.activityDuration +"小时";
                 this.postJson = postJson;
            }else{
              this.$toast( res.msg );
            }
          }
        })
      },
      deleteDataConfirm(){
        this.$dialog.confirm({
          message: "确定要删除吗？"
        }).then(()=>{
          this.deleteData();
        }).catch(()=>{
          //
        })
      },
      deleteData(){
          const url = this.api.activityRemove+"/"+this.modifyId;
          console.log(url);
          this.utils.ajax({
            url:url,
            method:"post",
            success:res=>{
              console.log(res);
              if(res.code == 0){
                this.$toast("删除教学活动成功");
                this.$router.go(-1);
              }else{
                this.$toast( res.msg );
              }
            }
          })
      },
      /*返回*/
      goBack() {
        this.$router.go(-1);
      },
      addZero(s){
          return s < 10 ? '0' + s: s;
      },
    fomateData(value){  //初始值使用
      let day= new Date();
      day = day.getFullYear()+"-"+this.addZero(day.getMonth()+1)+"-"+this.addZero(day.getDate());
      return day;
    },
      // 时间选择

    TimeClick() {


      let currentTime = this.postJson.activityDate || new Date();
      this.timeValue = new Date(currentTime.replace(/-/g, '/'));

      this.timeShow = true;
    },
      /*时间确认*/
      TimeConfirm(value) {
        this.timeShow = false;
        const activeTime = this.utils.formatDate(new Date(value).toLocaleDateString(), 'yyyy-MM-dd');
        this.postJson.activityDate = activeTime;
      },
      formatter(type, value) {
        return this.utils.pickerType(type, value);
      },
      // type 1活动形式，2教学层次，3学时
      selectText(type){
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
        this.postJson[type] = value.id;

        let showName= showNameJson[this.activeSelectType];
        this.postJson[showName] = value.name;

        this.isShow = !this.isShow;
      },
      /*保存*/
      savePage: function () {
          const that = this;
          const url = this.api.activityUpdate +"/"+this.modifyId;
          const saveObj = {
            typeName: this.postJson.typeName,
            levelName: this.postJson.levelName,
            durationName: this.postJson.durationName
          }
          delete this.postJson.typeName;
          delete this.postJson.levelName;
          delete this.postJson.durationName;
          console.log(this.postJson);
          this.utils.ajax({
            url: url,
            method: "POST",
            data: this.postJson,
            success: res => {
              console.log(res);
              if (res.code == 0) {
                this.$toast("修改教学活动成功");
                this.$router.go(-1);
              }else{
                this.$toast(res.msg);
                Object.assign(that.postJson, saveObj)
              }
            }
          });
      },
      /*文本域*/
      onChange(item) {
        if( item.value.length){
          let txtVal = item.value.length;
          this.textNum = txtVal;
        }

      },
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
  }

  .content-ul {
    background: #fff;
  }
  .content-ul:not(:first-child){
    margin-top:20px;
  }

  .content-ul li {
    margin: 0 0 0 0.9375rem;
  }

 /* 删除功能 */
.deleteBtn{
      border-radius: 4px;
      height:32px;
      margin-top:15px;
      border: none;
      width:95%;
      background:#f04844;
      color:#fff;
      font-size:14px;
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

</style>
