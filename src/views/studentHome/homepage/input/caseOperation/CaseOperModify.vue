<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar
      title="修改录入信息"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="goBack()"
      @click-right="savePage()"
    >
      <van-button
              loading-type
              loading-size="15px"
              loading-text="保存"
              :loading="loadFlag"
                  size="small"
                  slot="right"
                  class="btnSave">
        保存
      </van-button>
    </van-nav-bar>
    <!--标签页-->
    <div class="tabbar">
      <!-- 病种 -->
      <div class="inputBox deaseBox" v-show="activeTab ==0">
        <div class="van-tabs__content">
          <!--入院方式-->
          <van-field label="类型" class="typeCardBox" disabled required>
            <van-button
              slot="button"
              :size="itemSm.size"
              :text="itemSm.text"
              :type="itemSm.type"
              v-for="(itemSm,indexSm) of btnList"
              :key="indexSm"
              class="hospitalType"
              :class="{'active': diseaseJson.accessMode == (indexSm+1)}"
              @click="hospTypeClick(itemSm,indexSm,diseaseJson)"
            ></van-button>
          </van-field>

          <van-cell-group class="defaultNone" v-show="diseaseJson.accessMode==3">
            <van-field label="是否全程管理">
              <van-button slot="button" size="small" @click="wholeProcess(diseaseJson,1)" :class="{'active': diseaseJson.manageWholeProcess == 1}">是</van-button>
              <van-button slot="button" size="small" :class="{'active': diseaseJson.manageWholeProcess == 0}" @click="wholeProcess(diseaseJson,0)">否</van-button>
            </van-field>
            <van-field label="书写大病历">
              <van-button slot="button" size="small" @click="bigRecord(diseaseJson,1)" :class="{'active': diseaseJson.writeMajorMedicalRecord == 1}">是</van-button>
              <van-button slot="button" size="small" @click="bigRecord(diseaseJson,0)" :class="{'active': diseaseJson.writeMajorMedicalRecord == 0}">否</van-button>
            </van-field>
          </van-cell-group>

          <!--就诊时间-->
          <van-cell-group>
            <van-field
              v-model="diseaseJson.accessMode != 3 ? diseaseJson.visitTime:diseaseJson.inHospitalTime"
              required
              is-link
              placeholder
              :label="diseaseJson.accessMode != 3?'就诊时间':'住院时间'"
              readonly="readonly"
              input-align="right"
              @click="TimeClick('就诊时间',diseaseJson)"
            ></van-field>
          </van-cell-group>


          <!--病历号-->
          <van-cell-group>
            <van-field
              v-model="diseaseJson.medicalRecordNo"
              required
              placeholder="请输入病历号"
              label="病历号"
              input-align="right"
            ></van-field>
          </van-cell-group>

          <!--病人姓名-->
          <van-cell-group>
            <van-field
              v-model="diseaseJson.patientName"
              required
              placeholder="请输入病人姓名"
              label="病人姓名"
              input-align="right"
            ></van-field>
          </van-cell-group>

          <!--主要诊断-->
          <van-cell-group>
            <van-field
              v-model="diseaseJson.mainDiseaseName"
              required
              is-link
              placeholder="请选择"
              label="主要诊断"
              readonly="readonly"
              input-align="right"
              @click="toggleDeaseList(diseaseJson,1)"
            ></van-field>
          </van-cell-group>

          <!-- 其他主要病种 -->
            <van-cell-group v-if="diseaseJson.mainDiseaseName == '其他'  || diseaseJson.mainDiseaseName == '其它' ">
              <van-field
                v-model="diseaseJson.mainOtherDiseaseName"
                required
                placeholder="请输入疾病名称"
                label="其他病种"
                input-align="right"
              ></van-field>
            </van-cell-group>

         <!-- 病种次要诊断-->
         <div class="secondDeaseList">
               <van-cell-group v-for="(secondItem,secondIndex)  in diseaseJson.secondaryDiseaseList" :key="secondIndex">

            <van-field
              v-model="secondItem.secondaryDiseaseName"
              is-link
              placeholder="请选择"
              label="次要诊断"
              readonly="readonly"
              input-align="right"
              @click="toggleDeaseList(secondItem,2)"
            >

            <van-icon name="add"
                      color="#A083E0"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex == 0"
                       @click.stop="addSecondClick(diseaseJson.secondaryDiseaseList,2)"
            />
            <van-icon name="clear"
                      color="red"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex != 0"
                       @click.stop="reduceSecondClick(diseaseJson.secondaryDiseaseList,secondIndex,2)"
            />
              </van-field>
              <!-- 其他文字录入 -->
              <van-cell-group
                  v-if="secondItem.secondaryDiseaseName == '其他'  || secondItem.secondaryDiseaseName == '其它' "
                >
                  <van-field
                    v-model="secondItem.secondaryOtherDiseaseName"
                    required
                    placeholder="请输入疾病名称"
                    label="其他病种"
                    input-align="right"
                  ></van-field>
                </van-cell-group>
            </van-cell-group>
         </div>
        </div>
        <button class="deleteBtn" @click="deleteDataConfirm">删除</button>
      </div>

       <!-- 手术 或 技术操作 -->
      <div class="inputBox deaseBox" v-show="activeTab ==1">
        <div class="van-tabs__content">
          <!--手术名称-->
          <van-cell-group>
            <!--主要手术 或 技术操作-->
            <van-field
              v-model="operationJson.operationName"
              required
              is-link
              placeholder="请选择"
              label="手术名称"
              readonly="readonly"
              input-align="right"
              @click="toggleOperateList(operationJson,1)"
            ></van-field>
          </van-cell-group>

           <!--主要手术选择其他时 -->
            <van-cell-group v-if="operationJson.operationName == '其他'  || operationJson.operationName == '其它' ">
              <van-field
                v-model="operationJson.otherOperationName"
                required
                placeholder="请输入其他手术或技术操作"
                label="其他手术或技术操作"
                input-align="right"
              ></van-field>
            </van-cell-group>
          <!--次要手术-->
         <div class="secondDeaseList">
               <van-cell-group v-for="(secondItem,secondIndex)  in operationJson.secondaryOperationList" :key="secondIndex">

            <van-field
              v-model="secondItem.secondaryOperationName"
              is-link
              placeholder="请选择"
              label="次要诊断"
              readonly="readonly"
              input-align="right"
              @click="toggleOperateList(secondItem,2)"
            >
            <van-icon name="add"
                      color="#A083E0"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex == 0"
                       @click.stop="addSecondClick(operationJson.secondaryOperationList,1)"
            />
            <van-icon name="clear"
                      color="red"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex != 0"
                       @click.stop="reduceSecondClick(operationJson.secondaryOperationList,secondIndex,1)"
            />
              </van-field>
               <van-cell-group
                  v-if="secondItem.secondaryOperationName == '其他'  || secondItem.secondaryOperationName == '其它' "
                >
                  <van-field
                    v-model="secondItem.secondaryOtherOperationName"
                    required
                    placeholder="请输入其他手术或技术操作"
                    label="其他手术或技术操作"
                    input-align="right"
                  ></van-field>
                </van-cell-group>
            </van-cell-group>
         </div>
          <!--角色-->
          <van-field label="手术角色">
            <van-button
              slot="button"
              :size="itemSm.size"
              :text="itemSm.text"
              :type="itemSm.type"
              v-for="(itemSm,indexSm) of roleList"
              :key="indexSm"
              :class="{'active': operationJson.operationRole == (indexSm+1)}"
              @click="hosRoleClick(itemSm,indexSm,operationJson)"
            ></van-button>
          </van-field>
          <!--手术时间-->
          <van-cell-group>
            <van-field
              v-model="operationJson.operationTime"
              required
              is-link
              placeholder
              label="手术/操作时间"
              readonly="readonly"
              input-align="right"
              @click="TimeClick('手术时间',operationJson)"
            ></van-field>
          </van-cell-group>
          <!-- 病历号-->
          <van-cell-group>
            <van-field
              v-model="operationJson.medicalRecordNo"
              required
              placeholder="请输入病历号"
              label="病历号"
              input-align="right"
            ></van-field>
          </van-cell-group>
          <!-- 病人姓名-->
          <van-cell-group>
            <van-field
              v-model="operationJson.patientName"
              required
              placeholder="请输入病人姓名"
              label="病人姓名"
              input-align="right"
            ></van-field>
          </van-cell-group>
        </div>
        <button class="deleteBtn" @click="deleteDataConfirm">删除</button>
      </div>
    </div>

     <!-- 时间弹窗 -->
     <van-popup v-model="timeflag" position="bottom" :overlay="true">
              <van-datetime-picker
                v-model="timeItem"
                :title="timeTitle"
                type="date"
                @cancel="timeCancel"
                @confirm="TimeConfirm"
                :max-date="maxDate"
                :min-date="minDate"
                :formatter="formatter"
              />
      </van-popup>
      <!-- 选择病种pop  联动 -->
      <van-popup v-model="deaseSelect" position="bottom" close-on-click-overlay :overlay="true">
              <van-picker
                show-toolbar
                title="选择病种"
                :columns="deaseTwoColums"
                value-key="diseaseName"
                @cancel="onCancel"
                @confirm="ondeaseConfirm"
                @change="ondeaseTwoChange"
              />
      </van-popup>
      <!-- 选择手术pop-->
      <van-popup v-model="operateSelect" position="bottom" close-on-click-overlay :overlay="true">
              <van-picker
                show-toolbar
                title="选择手术或技术操作"
                :columns="operationColums"
                value-key="operationName"
                @cancel="onCancel"
                @confirm="operationConfirm"
              />
      </van-popup>
  </div>
</template>

<script>
/*
 *    1.officeValue ：选择科室的值
 *    2.entityValue :病种名称的值
 *    3.timeValue:就诊时间的值
 *
 * */
import { departBaseInfoMixin } from "@/common/js/mixin";

export default {
  name: "incaseOper",
  mixins: [departBaseInfoMixin],
  components: {
  },
  created() {
   this.modifyJson = this.$store.state.deaseModifyJson;
   this.modifyId = this.modifyJson.id;
   this.modifyType = this.modifyJson.type;
   this.activeTab = this.modifyType;

  // 初始化原始数据
    this.diseaseJsonyh= Object.assign({},{},this.diseaseJson);
    this.operationJsonyh= Object.assign({},{},this.operationJson);

    this.getMedicalBaseInfo().then(
      res => {
        // deaseTwoColums 0：西医 1：中医
        if (res.code == 0) {
          this.deaseMap = res.data.typeAndDiseaseListMap;
          this.operationColums = res.data.operationList;

          if (!this.deaseMap) return;
          if (res.data.rotationSchedule.diseaseCategory == 1) {
            let deaseMap = res.data.typeAndDiseaseListMap;

              //1 西医，2 中医
             this.deaseMap ={};
             this.deaseTwoColums =[];
             this.deaseTwoColums =[];
            if(deaseMap["1"] && deaseMap["1"].length){
                this.deaseMap['西医']=deaseMap["1"];
            }
            if(deaseMap["2"] && deaseMap["2"].length){
                 this.deaseMap['中医']=deaseMap["2"];
            }

            let keysArr = Object.keys(this.deaseMap);
            this.deaseTwoColums = [
              {
                values: keysArr,
                className: "column1"
              },
              {
                values: this.deaseMap[keysArr[0]],
                className: "column2",
                "value-key": "diseaseName",
                defaultIndex: 2
              }
            ];
          } else {
            this.deaseMap = res.data.typeAndDiseaseListMap["0"];
            this.deaseTwoColums = [
              {
                values: this.deaseMap,
                "value-key": "diseaseName",
              },
            ];
          }

        }

      },
      error => {}
    );
    this.getMsgInfo();
  },
  mounted() {},
  data() {
    return {
      modifyJson:{},
      modifyId: 0,
      modifyType: 0,

      activeTab: 0,
      // 公用时间
      timeTitle:"就诊时间",
      timeItemJson: {},
      timeItem:new Date(),
      derpartList: [],
      //   当前活动科室json
      activeDepJson: {},
      // 三组件共用
      activeDepartId: -1,
      // 病种
      activeDeaseJson:{},
      // 手术
      activeOperateJson:{},

      // 病种，手术和技术操作
      // 病种
      diseaseList: [],
      diseaseJsonyh:{},
      diseaseJson: {
        accessMode: null, //类型
        visitTime: "",  //就诊时间
        medicalRecordNo: "", //病历号
        patientName: "", //病人名称
        mainDiseaseId: null, //主要诊断
        mainDiseaseName: "",  //主要诊断名称
        mainOtherDiseaseName: "",//其他病种
        secondaryDiseaseList: [ //次要诊断列表
           {
            secondaryDiseaseId: 0,
            secondaryDiseaseName:"",
            secondaryOtherDiseaseName: ""
           },
        ],
        inHospitalTime: "", //入院时间
        manageWholeProcess: 0, //全程管理
        writeMajorMedicalRecord: 0, //书写大病历
      },
      // 次要诊断
      secondDeaseJson:{
        secondaryDiseaseId: 0,
        secondaryDiseaseName:"",
        secondaryOtherDiseaseName: ""
      },
       // 手术或技术操作
      operateionList: [],
      operationJsonyh:{},
      operationJson: {
        operationId: 0,
        operationRole: 0, //手术角色
        operationTime: "", //手术时间
        patientName:"", //病人姓名
        medicalRecordNo: "", //病历号

        operationName: "",//手术名称
        otherOperationName:"",//其他手术名称
        secondaryOperationList: [
           {
            secondaryOperationId: null,
            secondaryOperationName: "",
            secondaryOtherOperationName: ""
          }
        ], //其他病种技能手术
      },
      secondOperateJson:{
         secondaryOperationId: null,
         secondaryOperationName: "",
         secondaryOtherOperationName: ""
      },
      initPostJson: {
        clinicalSkillRecordDtoList: [],
        diseaseRecordDtoList: [],
        operationRecordDtoList: [],
      },
      // 病种选择弹窗
      deaseSelect: false,
      deaseTwoColums: [],
      deaseMap:{},
      deaseType: 1,
      // 手术选择弹窗
      operateSelect: false,
      operationColums:{},
      operationType: 1,

      btnList: [
        {
          type: "default",
          text: "门诊",
          size: "small"
        },
        {
          text: "急诊",
          size: "small",
          type: "default"
        },
        {
          type: "default",
          text: "住院",
          size: "small"
        }
      ],
      roleList: [
        {
          type: "default",
          text: "主刀",
          size: "small"
        },
        {
          text: "助手",
          size: "small",
          type: "default"
        }
      ],
      loadFlag:false,
      // 时间选择
      timeflag: false,

      index: 0,
      val: "请输入病历号",

      officeValue: "",
      value1: "",
      timeValue: "",
      entityValue: "",
      showKeyboard: false,
      keyboard: "value1",
      minDate:new Date(this.Global.currentItem.currentRotationStartTime),
      maxDate:new Date(this.Global.currentItem.SelectRotationEndTime),
      shortRotationScheduleDto:{}
    };
  },
  methods: {
    /*保存*/
    getMsgInfo: function () {
          let url;
          // type 0 病种 1 手术技能
          if(this.modifyType == 0){
             url = this.api.deaseInfo + "/"+ this.modifyId;
          }else{
             url =this.api.operateInfo+ "/"+ this.modifyId;
          }
          console.log(url);

          this.utils.ajax({
            url: url,
            method: "POST",
            data: {},
            success: res => {
              console.log(res);
              if (res.code == 0) {
                 if(this.modifyType == 0){
                   this.diseaseJson =res.data;
                 }else{
                   this.operationJson= res.data;
                 }
                 this.shortRotationScheduleDto = res.data.shortRotationScheduleDto;
                 if(this.shortRotationScheduleDto){
                    let startTime = this.shortRotationScheduleDto.startTime;
                    let endTime = this.shortRotationScheduleDto.endTime;
                    this.minDate = new Date(startTime.replace(/-/g, '/'));
                    endTime = new Date(endTime.replace(/-/g, '/'));
                    this.maxDate = endTime;
                    if(endTime.getTime() > new Date().getTime()){
                        this.maxDate = new Date();
                    }
                 }
              }else{
                this.$toast(res.msg);
              }
            }
          });
      },
    // 病种选择
   toggleDeaseList(item,type) {
      // 绑定数据
      this.activeDeaseJson = item;
      // 区分主要诊断，次要诊断
      this.deaseType = type;

      this.deaseSelect = true;
    },
    // 病种联动
    ondeaseTwoChange(picker, values){
        picker.setColumnValues(1, this.deaseMap[values[0]]);
    },
    /*病种科室确认事件*/
    ondeaseConfirm(value, index) {
      // 设置主要诊断
         console.log(value);
         console.log(index);
       // 设置主要诊断
      let deaseName = '';
      let deaseId = '';
      if (value[0].diseaseName) {
        deaseName = value[0].diseaseName;
        deaseId = value[0].id;
      } else {
        deaseName = value[1].diseaseName;
        deaseId = value[1].id;
      }

      if(this.deaseType == 1){
         this.activeDeaseJson.mainDiseaseName =deaseName;
         this.activeDeaseJson.mainDiseaseId = deaseId;
      }
      // 设置次要诊断
      if(this.deaseType == 2){
         this.activeDeaseJson.secondaryDiseaseName = deaseName;
         this.activeDeaseJson.secondaryDiseaseId = deaseId;
      }
      this.deaseSelect = false;
    },
    // 手术选择
    toggleOperateList(item,type) {
      this.activeOperateJson = item;
      this.operationType = type;
      this.operateSelect = true;
    },
    // 手术确认
    operationConfirm(value, index){
      console.log(value);
      console.log(index);
       if(this.operationType == 1){
         this.activeOperateJson.operationId = value.id;
         this.activeOperateJson.operationName =value.operationName;
      }
      // 设置次要诊断
      if(this.operationType == 2){
         this.activeOperateJson.secondaryOperationId = value.id;
         this.activeOperateJson.secondaryOperationName =value.operationName;
      }
      this.operateSelect = false;
    },
    // 是否全程管理
    wholeProcess(item,type){
      item.manageWholeProcess = type;
    },
    // 是否书写大病历
    bigRecord(item,type){
      item.writeMajorMedicalRecord = type;
    },

    /*路由跳转*/
    goBack() {
      this.$router.go( -1 );
    },
    // 判断病种/技能/手术 当前值和初始值是否相等
    isEqualSame(postList,yjson){
       let postJson = postList[0];
       let flag = true; //默认全部相等
       for(var key in postJson){
           if(postJson[key] != yjson[key]){
             flag = false;
           }
       }
       if(flag){
            return [];
       }else{
            return postList;
       }
    },
    savePage() {
      let urlJson ={
         0: this.api.diseaseModify,
         1: this.api.operateModify
      }
      let url = urlJson[this.modifyType];
      let postJson;
      if(this.modifyType == 0){
          postJson =Object.assign({},this.diseaseJsonyh,this.diseaseJson);
      }else{
          postJson =Object.assign({},this.operationJsonyh,this.operationJson);
      }
      console.log(postJson);
      this.saveData(url,postJson);
    },
    // 修改病种技能手术
    saveData(url,postJson) {
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          console.log(res);
          this.loadFlag = false;
          if (res.code == 0) {
            this.$toast( this.modifyType=='0'? "修改病种成功" : "修改技能/手术成功");
            this.$router.go(-1);
          }else{
            this.$toast(res.msg);
          }
        }
      });
    },
    deleteDataConfirm(){
        this.confirmDialog("确定删除吗?",(res)=>{
            console.log(res);
            if(res){
               this.deleteData();
            }
        })
    },
    deleteData(){
      let urlJson ={
        0: this.api.diseaseDelete,
        1: this.api.operateDelete
      }
      let toastJson= {
        0: "病种",
        1: "手术或技术操作"
      }
      let toast = toastJson[this.modifyType];
      let url = urlJson[this.modifyType] +"/"+ this.modifyId;
        console.log(url);
        this.utils.ajax({
          url:url,
          method:"post",
          success:res=>{
            console.log(res);
            if(res.code == 0){
              this.$toast("删除"+ toast +"成功");
              this.$router.go(-1);
            }else{
              this.$toast( res.msg );
            }
          }
        })
      },
    //新增次要诊断，次要手术
    addSecondClick(secondList,type){

        let toastString = type ==1 ?"次要诊断": "次要手术或技术操作";
        let addJson = type ==1 ? this.secondDeaseJson : this.secondOperateJson;

       addJson = JSON.parse(JSON.stringify(addJson));

        if(secondList.length>=4){
            this.$toast("最多只能新增4例"+toastString);
            return;
        }
        secondList.push(addJson);
    },
    //减少次要诊断，次要手术
    reduceSecondClick(secondList,index,type){
        if(secondList.length > 1){
            secondList.splice(index,1);
        }
    },
    /*病种,手术弹窗事件*/
    onCancel() {
      this.show = false;
      this.deaseSelect = false;
      this.operateSelect = false;
    },
    // 时间选择
    TimeClick(title,item) {
      this.timeTitle = title;
      // timeItem 时间插件显示的时间
      if(this.activeTab == 0){
        this.timeItem = new Date(item.visitTime || new Date());
      }
      if(this.activeTab == 1){
        this.timeItem = new Date(item.operationTime || new Date());
      }
      this.timeItemJson = item;
      this.timeflag = ! this.timeflag;
    },
     // 时间弹窗确认取消
    timeCancel() {
      this.timeflag = false;
    },
    addZero(s){
        return s < 10 ? '0' + s: s;
    },
    TimeConfirm(value) {
      let day= new Date(value);
      day = day.getFullYear()+"-"+this.addZero(day.getMonth()+1)+"-"+this.addZero(day.getDate());
      if(this.activeTab == 0){
        this.timeItemJson.visitTime =day;
      }
      if(this.activeTab == 0){
          if(this.diseaseJson.accessMode==3){
              this.timeItemJson.inHospitalTime =day;
          }
      }
      if(this.activeTab == 1){
        this.timeItemJson.operationTime =day;
      }
      this.timeflag = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },

    drgClick() {
      if (!this.deaseSelect) {
        this.deaseSelect = true;
      } else {
        this.deaseSelect = false;
      }
    },
    onInput(key) {
      const { keyboard } = this;
      this[keyboard] = (this[keyboard] + key).slice(0);
    },
    onDelete() {
      const { keyboard } = this;
      this[keyboard] = this[keyboard].slice(0, this[keyboard].length - 1);
    },
    confrim(e) {
      let timearr = e.getValues();
      this.timeValue = `${timearr[0]}${timearr[1]}${timearr[2]}`;
    },
    hospitalClick(item, index) {
      this.index = index;
    },
    // 入院方式
    hospTypeClick(indexSm,index,item){
      item.accessMode= index+1;
      console.log(item.accessMode);
    },
    // 手术角色
    hosRoleClick(indexSm,index,item){
      item.operationRole= index+1;
      console.log(item.operationRole);
    },
    // 手术类型
    hosOperTypeClick(indexSm,index,item){
      item.operationType= index+1;
      console.log(item.operationType);
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*返回键和下面单元格对齐*/
  .wrapper /deep/ .van-nav-bar__left{
    left:0.625rem;
  }
  /*picker里面的确认和取消键的颜色*/
  .wrapper /deep/ .van-picker__confirm{
    color:#A083E0;
  }
  .wrapper /deep/ .van-picker__cancel{
    color:#A083E0;
  }
.inputBox {
  position: absolute;
  top: 47px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
}
.van-button.active{
  background-color: #A083E0;
  color: #fff;
}
.wrapper /deep/ .van-tabs__content:first-child{
    margin-top: 0px;
}
.wrapper /deep/ .van-tabs__content{
    margin-top: 13px;
}

/*标签页.van-tabs__nav--card*/
.wrapper /deep/ .van-tabs__nav--card {
  margin: 0 45px;
}
.wrapper /deep/ .van-cell {
  text-align: left;
}
.wrapper /deep/ .van-cell span {
  font-size: 14px;
}
.wrapper /deep/ .van-hairline--surround {
  height: 0;
}
.wrapper /deep/.van-password-input {
  margin: 0 auto;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #F2F2F2;
}
.tabs_card {
  width: 100%;
  height: 40px;
  margin-top: 11px;
}
.tab_content {
  width: 100%;
  margin-top: 15px;
}
/* label标签 */
.promise {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: #999999;
}
.defaultNone {
  display: block;
}
.add {
  display: flex;
  float: right;
  align-items: flex-end;
  font-size: 12px;
  text-align: right;
  margin-right: 24px;
  color: #A083E0;
  padding-top: 10px;
  box-sizing: border-box;
}
.add .add-icon {
  font-size: 18px;
}
.add span {
  margin-left: 5px;
}
.reduce{
  color: red;
}
.hospitalType{
  width:80px;
}
/* 删除按钮 */
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
</style>
