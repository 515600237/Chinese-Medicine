<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar
      :title="headerTitle"
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
        class="btnSave"
      >保存</van-button>
    </van-nav-bar>
    <!--标签页-->
    <div class="tabbar">
      <van-tabs type="card" class="tabs_card" v-model="activeTab">
        <!--第一栏病种-->
        <van-tab title="病种" class="tab_content"></van-tab>
        <!--第二栏内容-->
        <van-tab title="手术或技术操作" class="tab_content"></van-tab>
      </van-tabs>

      <!-- 病种 -->
      <div class="inputBox deaseBox" v-show="activeTab ==0" ref="deaseBox">
        <div>
          <div class="van-tabs__content" v-for="(item,index) in diseaseList" :key="index">
            <!--入院方式-->
            <van-field label="类型" class="hospCardBox" disabled required>
              <van-button
                slot="button"
                :size="itemSm.size"
                :text="itemSm.text"
                :type="itemSm.type"
                v-for="(itemSm,indexSm) of btnList"
                :key="indexSm"
                class="hospitalType"
                :class="{'active': item.accessMode == (indexSm+1)}"
                @click="hospTypeClick(itemSm,indexSm,item)"
              ></van-button>
            </van-field>

            <van-cell-group class="defaultNone" v-show="item.accessMode==3">
              <van-field label="是否书写大病历" :readonly="true" required>
                <van-button
                  slot="button"
                  size="small"
                  @click="bigRecord(item,1)"
                  :class="{'active': item.writeMajorMedicalRecord == 1}"
                >是</van-button>
                <van-button
                  slot="button"
                  size="small"
                  @click="bigRecord(item,0)"
                  :class="{'active': item.writeMajorMedicalRecord == 0}"
                >否</van-button>
              </van-field>
              <van-field label="是否全程管理" :readonly="true" required>
                <van-button
                  slot="button"
                  size="small"
                  @click="wholeProcess(item,1)"
                  :class="{'active': item.manageWholeProcess == 1}"
                >是</van-button>
                <van-button
                  slot="button"
                  size="small"
                  :class="{'active': item.manageWholeProcess == 0}"
                  @click="wholeProcess(item,0)"
                >否</van-button>
              </van-field>
            </van-cell-group>

            <!--就诊时间-->
            <van-cell-group>
              <van-field
                v-model="item.visitTime"
                required
                is-link
                placeholder
                :label="item.accessMode==3?'入院时间': '就诊时间'"
                readonly="readonly"
                input-align="right"
                @click="TimeClick('就诊时间',item)"
              ></van-field>
            </van-cell-group>

            <!--病历号-->
            <van-cell-group>
              <van-field
                v-model="item.medicalRecordNo"
                required
                placeholder="请输入病历号"
                maxlength="30"
                label="病历号"
                input-align="right"
              ></van-field>
            </van-cell-group>

            <!--病人姓名-->
            <van-cell-group>
              <van-field
                v-model="item.patientName"
                required
                placeholder="请输入病人姓名"
                maxlength="30"
                label="病人姓名"
                input-align="right"
              ></van-field>
            </van-cell-group>

            <!--主要诊断-->
            <van-cell-group>
              <van-field
                v-model="item.mainDiseaseName"
                required
                is-link
                placeholder="请选择"
                label="主要诊断"
                readonly="readonly"
                input-align="right"
                @click="toggleDeaseList(item,1)"
              ></van-field>
              <!-- mainDiseaseName -->
            </van-cell-group>

            <!-- 其他主要病种 -->
            <van-cell-group v-if="item.mainDiseaseName == '其他'  || item.mainDiseaseName == '其它' ">
              <van-field
                v-model="item.mainOtherDiseaseName"
                required
                placeholder="请输入疾病名称"
                label="其他病种"
                input-align="right"
              ></van-field>
            </van-cell-group>

            <!--次要诊断-->
            <div class="secondDeaseList">
              <div
                v-for="(secondItem,secondIndex)  in item.secondaryDiseaseList"
                :key="secondIndex"
              >
                <van-cell-group>
                  <van-field
                    v-model="secondItem.secondaryDiseaseName"
                    is-link
                    placeholder="请选择"
                    label="次要诊断"
                    readonly="readonly"
                    input-align="right"
                    @click="toggleDeaseList(secondItem,2)"
                  >
                    <van-icon
                      name="add"
                      color="#A083E0"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex == 0"
                      @click.stop="addSecondClick(item.secondaryDiseaseList,1)"
                    />
                    <van-icon
                      name="clear"
                      color="red"
                      size="20px"
                      slot="left-icon"
                      v-if="secondIndex != 0"
                      @click.stop="reduceSecondClick(item.secondaryDiseaseList,secondIndex,2)"
                    />
                  </van-field>
                </van-cell-group>
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
              </div>
            </div>
          </div>
          <div style="overflow:hidden;">
            <div>
              <div class="add" @click="addList(1)">
                <van-icon name="add" color="#A083E0" class="add-icon" />
                <span>新增</span>
              </div>
              <div class="add reduce" @click="reduceList(1)" v-if="diseaseList.length>=2">
                <van-icon name="delete" color="red" class="add-icon" />
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 手术 或 技术操作 -->
      <div class="inputBox deaseBox" v-show="activeTab ==1" ref="skill">
        <div>
          <div class="van-tabs__content" v-for="(item,index) in operateionList" :key="index">
            <!--手术名称-->
            <van-cell-group>
              <!--主要手术 或 技术操作-->
              <van-field
                v-model="item.operationName"
                required
                is-link
                placeholder="请选择"
                label="主要手术或技术操作"
                readonly="readonly"
                input-align="right"
                @click="toggleOperateList(item,1)"
              ></van-field>
            </van-cell-group>

            <!--主要手术选择其他时 -->
            <van-cell-group v-if="item.operationName == '其他'  || item.operationName == '其它' ">
              <van-field
                v-model="item.otherOperationName"
                required
                placeholder="请输入其他手术或技术操作"
                label="其他手术或技术操作"
                input-align="right"
              ></van-field>
            </van-cell-group>
            <!--次要手术-->
            <div class="secondDeaseList">
              <div  v-for="(secondItem,secondIndex)  in item.secondaryOperationList"
                :key="secondIndex">
                   <van-cell-group
              >
                <van-field
                  v-model="secondItem.secondaryOperationName"
                  is-link
                  label-width="130px"
                  placeholder="请选择"
                  label="次要手术或技术操作"
                  readonly="readonly"
                  input-align="right"
                  @click="toggleOperateList(secondItem,2)"
                >
                  <van-icon
                    name="add"
                    color="#A083E0"
                    size="20px"
                    slot="left-icon"
                    v-if="secondIndex == 0"
                    @click.stop="addSecondClick(item.secondaryOperationList,2)"
                  />
                  <van-icon
                    name="clear"
                    color="red"
                    size="20px"
                    slot="left-icon"
                    v-if="secondIndex != 0"
                    @click.stop="reduceSecondClick(item.secondaryOperationList,secondIndex,1)"
                  />
                </van-field>
              </van-cell-group>

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
              </div>
            </div>
            <!--角色-->
            <van-field label="手术角色" :readonly="true">
              <van-button
                slot="button"
                :size="itemSm.size"
                :text="itemSm.text"
                :type="itemSm.type"
                v-for="(itemSm,indexSm) of roleList"
                :key="indexSm"
                :class="{'active': item.operationRole == (indexSm+1)}"
                @click="hosRoleClick(itemSm,indexSm,item)"
              ></van-button>
            </van-field>
            <!--手术时间-->
            <van-cell-group>
              <van-field
                v-model="item.operationTime"
                required
                is-link
                placeholder
                label="手术/操作时间"
                readonly="readonly"
                input-align="right"
                @click="TimeClick('手术时间',item)"
              ></van-field>
            </van-cell-group>
            <!-- 病历号-->
            <van-cell-group>
              <van-field
                v-model="item.medicalRecordNo"
                required
                placeholder="请输入病历号"
                label="病历号"
                input-align="right"
                maxlength="30"
              ></van-field>
            </van-cell-group>
            <!-- 病人姓名-->
            <van-cell-group>
              <van-field
                v-model="item.patientName"
                required
                placeholder="请输入病人姓名"
                maxlength="30"
                label="病人姓名"
                input-align="right"
              ></van-field>
            </van-cell-group>
          </div>
          <div style="overflow:hidden;">
            <!-- <p class="promise">本人承诺信息真实有效，如有不实之处承担全部责任</p> -->
            <div>
              <div class="add" @click="addList(2)">
                <van-icon name="add" color="#A083E0" class="add-icon" />
                <span>新增</span>
              </div>
              <div class="add reduce" @click="reduceList(2)" v-if="operateionList.length>=2">
                <van-icon name="delete" color="#FF0000" class="add-icon" />
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间弹窗 -->
    <van-popup v-model="timeflag" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="timeItem"
        :title="timeTitle"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="timeCancel"
        @confirm="TimeConfirm"
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
import depSelect2 from "@/components/input/depSelect2.vue"; //选择科室
import deaseSelect from "@/components/input/deaseSelect.vue"; //选择病种
import skillSelect from "@/components/input/skillSelect.vue"; //选择技能
import operateSelect from "@/components/input/operateSelect.vue"; //选择技能
import BScroll from "better-scroll";
export default {
  name: "incaseOper",
  mixins: [departBaseInfoMixin],
  components: {
    vDepselect2: depSelect2,
    vDeaseselect: deaseSelect,
    vSkillselect: skillSelect,
    vOperateselect: operateSelect
  },
  created() {
    this.headerTitle = this.Global.currentItem.departmentName;
    console.log(this.Global.currentItem.currentRotationStartTime);

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
                },
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
        console.log(this.deaseMap);
        console.log(this.deaseTwoColums);
      },
      error => {}
    );
    // 初始化三组数据
    this.diseaseJsonyh = Object.assign({}, {}, this.diseaseJson);
    this.operationJsonyh = Object.assign({}, {}, this.operationJson);

    this.diseaseList = [this.diseaseJson];
    this.operateionList = [this.operationJson];
    if (this.activeTab == 0) {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.deaseBox, {
          mouseWheel: true,
          click: true,
          tap: true
        });
      });
    }
    if (this.activeTab == 1) {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.skill, {
          mouseWheel: true,
          click: true,
          tap: true
        });
      });
    }
  },
  mounted() {},
  data() {
    return {
      headerTitle: "",
      activeTab: 0,
      // 公用时间
      timeTitle: "就诊时间",
      timeItemJson: {},
      timeItem: new Date(),
      minDate:new Date(this.Global.currentItem.currentRotationStartTime),
      maxDate:new Date(this.Global.currentItem.SelectRotationEndTime),
      derpartList: [],
      //   当前活动科室json
      activeDepJson: {},
      // 三组件共用
      activeDepartId: -1,
      // 病种
      activeDeaseJson: {},
      // 手术
      activeOperateJson: {},

      // 病种，手术和技术操作
      // 病种
      diseaseList: [],
      diseaseJsonyh: {},
      diseaseJson: {
        accessMode: null, //类型
        visitTime: this.getToday(), //就诊时间
        medicalRecordNo: "", //病历号
        patientName: "", //病人名称

        mainDiseaseId: null, //主要诊断
        mainDiseaseName: "", //主要诊断名称
        mainOtherDiseaseName: "", //其他病种
        secondaryDiseaseList: [
          //次要诊断列表
          {
            secondaryDiseaseId: null,
            secondaryDiseaseName: "",
            secondaryOtherDiseaseName: ""
          }
        ],
        inHospitalTime: this.getToday(), //入院时间
        manageWholeProcess: 0, //全程管理
        writeMajorMedicalRecord: 0 //书写大病历
      },
      // 次要诊断
      secondDeaseJson: {
        secondaryDiseaseId: null,
        secondaryDiseaseName: "",
        secondaryOtherDiseaseName: ""
      },
      // 手术或技术操作
      operateionList: [],
      operationJsonyh: {},
      operationJson: {
        operationId: 0,
        operationRole: null, //手术角色
        operationTime: "", //手术时间
        patientName: "", //病人姓名
        medicalRecordNo: "", //病历号

        operationName: "", //手术名称
        otherOperationName: "", //其他手术名称
        secondaryOperationList: [
          {
            secondaryOperationId: null,
            secondaryOperationName: "",
            secondaryOtherOperationName: ""
          }
        ] //其他病种技能手术
      },
      secondOperateJson: {
        secondaryOperationId: null,
        secondaryOperationName: "",
        secondaryOtherOperationName: ""
      },
      initPostJson: {
        clinicalSkillRecordDtoList: [],
        diseaseRecordDtoList: [],
        operationRecordDtoList: []
      },
      // 病种选择弹窗
      deaseSelect: false,
      deaseTwoColums: [],
      deaseMap: {},
      deaseType: 1,
      // 手术选择弹窗
      operateSelect: false,
      operationColums: [],
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
      loadFlag: false,
      // 时间选择
      timeflag: false,

      officeValue: "",
      value1: "",
      timeValue: "",
      entityValue: "",
      showKeyboard: false,
      keyboard: "value1",
      isMustData: {}, //病种必填校验字段
      isMustDeaseData: { //病种必填校验字段
        accessMode: "请选择病种类型",
        visitTime: "请选择就诊时间",
        operationTime: "请选择手术/操作时间",
        medicalRecordNo: "请输入病历号",
        patientName: "请输入病人姓名",
        mainDiseaseId: "请选择主要诊断"
      },
      isMustOperateData: { //手术必填校验字段
        operationId: "请选择主要手术或技术操作",
        operationTime: "请选择手术时间",
        medicalRecordNo: "请输入病历号",
        patientName: "请输入病人姓名",
      },
    };
  },
  methods: {
    getToday() {
      let day = new Date();
      day =
        day.getFullYear() +
        "-" +
        this.addZero(day.getMonth() + 1) +
        "-" +
        this.addZero(day.getDate());
      return day;
    },
    // 病种选择
    toggleDeaseList(item, type) {
      // 绑定数据
      this.activeDeaseJson = item;
      // 区分主要诊断，次要诊断
      this.deaseType = type;

      this.deaseSelect = true;
    },
    // 病种联动
    ondeaseTwoChange(picker, values) {
      picker.setColumnValues(1, this.deaseMap[values[0]]);
    },
    /*病种科室确认事件  选择不是其他时，其他置空*/
    ondeaseConfirm(value, index) {
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
      if (this.deaseType == 1) {
        this.activeDeaseJson.mainDiseaseName = deaseName;
        this.activeDeaseJson.mainDiseaseId = deaseId;
        if(deaseName !="其他" && deaseName !="其它"){
              this.activeDeaseJson.mainOtherDiseaseName ="";
        }
      }
      // 设置次要诊断
      if (this.deaseType == 2) {
        this.activeDeaseJson.secondaryDiseaseName = deaseName;
        this.activeDeaseJson.secondaryDiseaseId = deaseId;
        if(deaseName !="其他" && deaseName !="其它"){
              this.activeDeaseJson.secondaryOtherDiseaseName ="";
        }
      }
      this.deaseSelect = false;
    },
    // 手术选择
    toggleOperateList(item, type) {
      this.activeOperateJson = item;
      this.operationType = type;
      this.operateSelect = true;
    },
    // 手术确认  选择其他时清空
    operationConfirm(value, index) {
      let operationName = value.operationName;
      let operationId = value.id;
      if (this.operationType == 1) {
        this.activeOperateJson.operationId = operationId;
        this.activeOperateJson.operationName = operationName;
        if(operationName !="其他" && operationName !="其它"){
              this.activeOperateJson.otherOperationName ="";
        }
      }
      // 设置次要诊断
      if (this.operationType == 2) {
        this.activeOperateJson.secondaryOperationId = operationId;
        this.activeOperateJson.secondaryOperationName = operationName;
        if(operationName !="其他" && operationName !="其它"){
              this.activeOperateJson.secondaryOtherOperationName ="";
        }
      }
      this.operateSelect = false;
    },
    // 是否全程管理
    wholeProcess(item, type) {
      item.manageWholeProcess = type;
    },
    // 是否书写大病历
    bigRecord(item, type) {
      item.writeMajorMedicalRecord = type;
    },

    /*路由跳转*/
    goBack() {
      this.$router.go(-1);
    },
    // 判断病种/技能/手术 当前值和初始值是否相等
    isEqualSame(postList, yjson) {
      if (postList && postList.length >= 2) {
        return postList;
      }
      if (JSON.stringify(postList) == JSON.stringify([yjson])) {
        return [];
      }
      return postList;
    },
    isRepeat(data, flag) {
      let obj = {};
      let result = true;
      let otherArr = {};
      data.forEach(i => {
        let arr = [];
        if (flag) {
          let arr1 = [];
          i.secondaryDiseaseList.forEach(item => {
            if (item.secondaryDiseaseId || item.secondaryDiseaseName == '其他') {
              arr1.push(item)
            }
          });
          i.secondaryDiseaseList = arr1;
          if (i.mainDiseaseName == '其他') {
            if (otherArr.hasOwnProperty([i.medicalRecordNo + i.visitTime.replace(/-/g, '')])) {
              otherArr[i.medicalRecordNo + i.visitTime.replace(/-/g, '')].push(i.mainOtherDiseaseName)
            } else {
              otherArr[i.medicalRecordNo + i.visitTime.replace(/-/g, '')] = [i.mainOtherDiseaseName];
            }
          } else {
            arr.push(i.mainDiseaseId);
          }
          i.secondaryDiseaseList.forEach(item => {
            if (item.secondaryDiseaseName == '其他') {
              if (otherArr.hasOwnProperty([i.medicalRecordNo + i.visitTime.replace(/-/g, '')])) {
                otherArr[i.medicalRecordNo + i.visitTime.replace(/-/g, '')].push(item.secondaryOtherDiseaseName)
              } else {
                otherArr[i.medicalRecordNo + i.visitTime.replace(/-/g, '')] = [item.secondaryOtherDiseaseName];
              }
            } else {
              arr.push(item.secondaryDiseaseId);
            }
          });
          if (obj.hasOwnProperty([i.medicalRecordNo + i.visitTime.replace(/-/g, '')])) {
            obj[i.medicalRecordNo + i.visitTime.replace(/-/g, '')] =
            obj[i.medicalRecordNo + i.visitTime.replace(/-/g, '')].concat(arr);
          } else {
            obj[i.medicalRecordNo + i.visitTime.replace(/-/g, '')] = arr
          }
        } else {
          let arr1 = [];
          i.secondaryOperationList.forEach(item => {
            if (item.secondaryOperationId || item.secondaryOperationName == '其他') {
              arr1.push(item)
            }
          });
          i.secondaryOperationList = arr1;
          if (i.operationName == '其他') {
            if (otherArr.hasOwnProperty([i.medicalRecordNo + i.operationTime.replace(/-/g, '')])) {
              otherArr[i.medicalRecordNo + i.operationTime.replace(/-/g, '')].push(i.otherOperationName)
            } else {
              otherArr[i.medicalRecordNo + i.operationTime.replace(/-/g, '')] = [i.otherOperationName];
            }
          } else {
            arr.push(i.operationId);
          }
          i.secondaryOperationList.forEach(item => {
            if (item.secondaryOperationName == '其他') {
              if (otherArr.hasOwnProperty([i.medicalRecordNo + i.operationTime.replace(/-/g, '')])) {
                otherArr[i.medicalRecordNo + i.operationTime.replace(/-/g, '')].push(item.secondaryOtherOperationName)
              } else {
                otherArr[i.medicalRecordNo + i.operationTime.replace(/-/g, '')] = [item.secondaryOtherOperationName];
              }
            } else {
              arr.push(item.secondaryOperationId);
            }
          });
          if (obj.hasOwnProperty([i.medicalRecordNo + i.operationTime.replace(/-/g, '')])) {
            obj[i.medicalRecordNo + i.operationTime.replace(/-/g, '')] =
            obj[i.medicalRecordNo + i.operationTime.replace(/-/g, '')].concat(arr);
          } else {
            obj[i.medicalRecordNo + i.operationTime.replace(/-/g, '')] = arr
          }
        }
      });
      if (!this.isLenSoon(obj)) {
        result = false;
      }
      if (result) {
        if (!this.isLenSoon(otherArr)) {
          result = false;
        }
      }
      return result;
    },
    isLenSoon(obj) {
      let flag = true;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          let newArr = Array.from(new Set(obj[key]));
          if (newArr.length != obj[key].length) {
            flag = false;
            break;
          }
        }
      }
      return flag;
    },
    isMast(data) { // 必填校验
      let result = true;
      data.forEach(item => {
        if (result) {
          for (const key in this.isMustData) {
            if (item.hasOwnProperty(key)) {
              if (!item[key]) {
                this.$toast(this.isMustData[key]);
                result = false;
                break;
              }
            }
          }
        }
      });
      return result;
    },
    savePage() {
      let dease = JSON.parse(JSON.stringify(this.diseaseList));
      let operate = JSON.parse(JSON.stringify(this.operateionList));
      // 校验是否录入过
      dease = this.isEqualSame(dease, this.diseaseJsonyh);
      operate = this.isEqualSame(operate, this.operationJsonyh);
      // 判断是否添加过内容
      if (!dease.length && !operate.length) {
        this.$toast("请录入数据");
        return;
      }

      // 病种必填校验
      this.isMustData = JSON.parse( JSON.stringify(this.isMustDeaseData));
      console.log(this.isMustData);
      // 病种存在录入数据时，校验必填项
      if (dease && dease.length>0 && (!this.isMast(dease))) {
        this.activeTab = 0;
        return;
      }
      // 手术必填校验
      this.isMustData = JSON.parse( JSON.stringify(this.isMustOperateData));
      console.log(this.isMustData);
       // 手术存在录入数据时，校验必填项
      if (operate && operate.length>0 && (!this.isMast(operate))) {
        this.activeTab = 1;
        return;
      }

      // operate.secondaryOperationList = [];
      // 判断是否重复
      if (!this.isRepeat(dease, true)) {
        this.$toast('病种不能重复');
        return;
      }
      if (!this.isRepeat(operate, false)) {
        this.$toast('手术操作不能重复');
        return;
      }

      this.initPostJson = {
        diseaseRecordDtoList: dease,
        operationRecordDtoList: operate
      };
      this.saveData(dease, operate);
    },
    // 新增病种技能手术
    saveData(dease, operate) {
      const url = this.api.medicalSave;
      console.log(this.initPostJson);

      this.utils.ajax({
        url: url,
        method: "POST",
        data: this.initPostJson,
        success: res => {
          console.log(res);
          this.loadFlag = false;
          if (res.code == 0) {
            if (dease.length > 0 && operate.length > 0) {
              this.$toast("保存成功");
            } else if (dease.length > 0) {
              this.$toast("保存成功");
            } else if (operate.length > 0) {
              this.$toast("保存成功");
            } else {
              this.$toast("保存成功");
            }
            this.$router.push({ name: "deaseOperList" });
          } else {
            this.$toast(res.msg);
          }
        }
      });
    },
    //新增次要诊断，次要手术
    addSecondClick(secondList, type) {
      let toastString = type == 1 ? "次要诊断" : "次要手术或技术操作";
      let addJson = type == 1 ? this.secondDeaseJson : this.secondOperateJson;
      addJson = JSON.parse(JSON.stringify(addJson));

      if (secondList.length >= 4) {
        this.$toast("最多只能新增4例" + toastString);
        return;
      }
      secondList.push(addJson);
    },
    //减少次要诊断，次要手术
    reduceSecondClick(secondList, index, type) {
      if (secondList.length > 1) {
        secondList.splice(index, 1);
      }
    },
    //新增病种，手术
    addList(type) {
      if (type == 1) {
        if (this.diseaseList.length >= 10) {
          this.$toast("最多只能添加10个病种");
          return;
        }
        const json = Object.assign({}, {}, this.diseaseJsonyh);
        let secondJson = Object.assign({}, {}, this.secondDeaseJson);
        json.secondaryDiseaseList = [
          //次要诊断列表
          secondJson
        ];
        this.diseaseList.push(json);
      }
      if (type == 2) {
        if (this.operateionList.length >= 10) {
          this.$toast("最多只能添加10个手术信息");
          return;
        }
        const json = Object.assign({}, {}, this.operationJsonyh);
        let secondJson = Object.assign({}, {}, this.secondOperateJson);
        json.secondaryOperationList = [secondJson];
        this.operateionList.push(json);
      }
    },
    //减少病种，手术
    reduceList(type) {
      if (type == 1) {
        this.diseaseList.pop();
      }
      if (type == 2) {
        this.operateionList.pop();
      }
    },
    /*病种,手术弹窗事件*/
    onCancel() {
      this.show = false;
      this.deaseSelect = false;
      this.operateSelect = false;
    },
    // 时间选择
    TimeClick(title, item) {
      this.timeTitle = title;
      // timeItem 时间插件显示的时间
      if (this.activeTab == 0) {
        this.timeItem = new Date(item.visitTime || new Date());
      }
      if (this.activeTab == 1) {
        this.timeItem = new Date(item.operationTime || new Date());
      }
      this.timeItemJson = item;
      this.timeflag = !this.timeflag;
    },
    // 时间弹窗确认取消
    timeCancel() {
      this.timeflag = false;
    },
    addZero(s) {
      return s < 10 ? "0" + s : s;
    },
    TimeConfirm(value) {
      let day = new Date(value);
      day =
        day.getFullYear() +
        "-" +
        this.addZero(day.getMonth() + 1) +
        "-" +
        this.addZero(day.getDate());
      if (this.activeTab == 0) {
        this.timeItemJson.visitTime = day;
      }
      if (this.activeTab == 1) {
        this.timeItemJson.operationTime = day;
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
    hospitalClick(item, index) {
      this.index = index;
    },
    // 入院方式
    hospTypeClick(indexSm, index, item) {
      item.accessMode = index + 1;
      console.log(item.accessMode);
    },
    // 手术角色
    hosRoleClick(indexSm, index, item) {
      item.operationRole = index + 1;
      console.log(item.operationRole);
    },
    // 手术类型
    hosOperTypeClick(indexSm, index, item) {
      item.operationType = index + 1;
      console.log(item.operationType);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputBox {
  position: absolute;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  /* height:calc(100% - 3.5rem); */
  top: 96px;
  bottom: 20px;
  left: 0;
  right: 0;
}
.deaseBox /deep/ .van-field__label{
  width: 150px;
}
/* 住院方式选项 */
.hospCardBox /deep/ .van-field__label{
  width: 60px;
}
.van-button.active {
  background-color: #a083e0;
  color: #fff;
}
.wrapper /deep/ .van-tabs__content:first-child {
  margin-top: 0px;
}
.wrapper /deep/ .van-tabs__content {
  margin-top: 13px;
}

.wrapper >>> .van-cell {
  text-align: left;
  padding-left: 0.9375rem;
  box-sizing: border-box;
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
  background: #f2f2f2;
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
  color: #a083e0;
  padding-top: 10px;
  box-sizing: border-box;
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
.hospitalType {
  width: 80px;
}
</style>
