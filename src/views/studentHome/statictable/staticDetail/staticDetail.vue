<template>
  <div class="static-box">
    <!--标题栏-->
    <van-nav-bar
      :title="title"
      left-text="返回"
      @click-left="onClickLeft"
      left-arrow
      class="office"
    />
    <!--下拉菜单-->
    <van-dropdown-menu  active-color="#A083E0">
      <van-dropdown-item v-model="value" :options="option"  @change="handleChange"/>
    </van-dropdown-menu>

    <ul class="tab-content top7rem" v-show="value==1">
      <li class="box titleLi">
        <span class="pox">活动形式</span>
        <span>次数</span>
        <span>学时</span>
      </li>
      <div class="tab-content1">
        <li class="box" v-for="(item,index) of teachingActive" :key="index">
          <span class="pox">{{item.activityType}}</span>
          <span>{{item.count}}</span>
          <span>{{item.activityDuration}}</span>
        </li>
        <li v-if="teachingActive.length == 0" class="null-data">
          无数据
        </li>
      </div>
    </ul>

    <!--标签页-->
    <van-tabs type="card" class="tabCard" @change="changeTab" v-model="activeTab" v-if="value==0">
      <van-tab
              :title="item.title + item.showNum"
              v-for="(item,index) of   typeList"
              :key="index">
      </van-tab>
    </van-tabs>
    <div class="contentBox" v-if="value==0">
      <!--病种-->
      <ul class="tab-content" v-show="activeTab==0">
        <li class="box titleLi">
          <span class="pox">病种</span>
          <span>最低例数</span>
          <span>完成例数</span>
        </li>
        <div class="tab-content1">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="30"
            :error.sync="error"
            error-text="请求失败"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <li class="box" v-for="(item,index) of deaseContentList" :key="index">
              <span class="pox">{{item.dataName}}</span>
              <span>{{item.minCaseNum == '0' ? '_' : item.minCaseNum}}</span>
              <span>{{item.completedCaseNum}}</span>
            </li>
          </van-list>
        </div>
      </ul>
      <!--手术-->
      <ul class="tab-content" v-show="activeTab==1">
        <li class="box titleLi">
          <span class="pox">手术</span>
          <span>最低例数</span>
          <span>完成例数</span>
        </li>
        <div class="tab-content1">
          <van-list
            v-model="loading1"
            :finished="finished1"
            :offset="30"
            :error.sync="error1"
            error-text="请求失败"
            finished-text="没有更多了"
            @load="onLoad1"
          >
            <li class="box"
                v-for="(item,index) of operationContentList"
                :key="index"
            >
              <span class="pox">{{item.dataName}}</span>
              <span>{{item.minCaseNum}}</span>
              <span>{{item.completedCaseNum}}</span>
            </li>
          </van-list>
        </div>
      </ul>


    </div>
  </div>
</template>

<script>
export default {
  name: "staticDetail",
  data() {
    return {
      /*下拉菜单*/
      value: 0,
      option: [
        { text: '病种/手术或技术操作完成情况', value: 0 },
        { text: '教学活动', value: 1 },
      ],
      activeTab: 0,
      card:[],
      typeList: [
        {
          id: 1,
          title: "病种",
          showNum: "(0/0)",
        },
        {
          id: 2,
          title: "手术/技术操作",
          showNum: "(0/0)",
        },

      ],
      content: [],
      result: [],
      // title: '',//头部标题
      departmentId: null,
      studentName: "",
      deaseContentList: [],
      skillContentList: [],
      operationContentList: [],
      itemData:{},
      teachingActive:[],//教学活动数组
      detalist:[],
      scheduleId:0,
      page:1,
      page1:1,
      departsId:'',
      loading:false,
      finished:false,
      loading1:false,
      finished1:false,
      error:false,
      error1:false,
    };
  },
  computed: {
    title() {
      let item =this.$route.params.itemData;
      let departmentName = item.departmentName;
      let currentBaseDepartName = item.baseDepartmentName;
      if(currentBaseDepartName){
          departmentName = departmentName +"【"+currentBaseDepartName+"】";
      }
      return departmentName;
    }
  },
  methods: {
/*    当下拉菜单变化时发起请求*/
    handleChange(value){
      if(value==1){
        this.report();
      }
    },
    /*教学活动接口*/
    onLoad2() {
      this.report();
    },
    report(){
      var url;
      if(this.Global.userType==4){
        url = this.api.report+ "?departmentId=" + this.itemData.departmentId+"&stage="+this.itemData.stage;
      }
      if(this.Global.userType==3){
        url = this.api.report+'?studentId='+ this.itemData.studentId + "&departmentId=" + this.itemData.departmentId
      }
      this.utils.ajax({
        url:url,
        method:"POST",
        success:(res)=>{
          if(res&&res.code==0){
            this.teachingActive = res.data;
            this.teachingActive.forEach((item)=>{
              this.constantData.activityType.forEach((val)=>{
                if(item.activityType==val.id){
                  item.activityType=val.name;
                }
              })
            })
          } else {
            this.$toast(res.msg);
          }
        }
      })
    },
    onClickLeft() {
      /*返回键*/
      this.$router.go(-1);
    },
    /**************数据请求*****************/
    /*病种　type:1   手术 type:3 */
    onLoad() {
      this.getInfoList(1).then(res => {
        this.deaseContentList = this.deaseContentList.concat(res.data.result);
      });
    },
    changeTab(name, title) {
      if (name == 1) {
        this.error = false;
        this.error1 = false;
        this.error2 = false;
        this.onLoad1();
      }
    },
    onLoad1() {
      this.getInfoList(3).then(res => {
        this.operationContentList = this.operationContentList.concat(res.data.result);
      });
    },
    getInfoList(type) {
      this.error = false;
      this.error1 = false;
      this.error2 = false;
      return new Promise((resolve, reject) => {
        let url = this.api.medicalInfoBySchedule;
        
        const postJson = {
          scheduleId: this.scheduleId,
          pageIndex: 1,
          pageSize: 15,
          dataType: type
        };
        if (type == 1) {
          postJson.pageIndex = this.page;
          this.loading = true;
        } else {
          postJson.pageIndex = this.page1;
          this.loading1 = true;
        }
        // 指导老师时，传学生scheduleId
        if (this.Global.userType == 3) {
          postJson.scheduleId = this.itemData.rotationScheduleId;
        }
        this.utils.ajax({
          url: url,
          method: "POST",
          data: postJson,
          success: res => {
            if (!res.success) {
              if (type == 1) {
                this.error = true;
              } else {
                this.error1 = true;
              }
              this.$toast(res.msg);
            }
            if (type == 1) {
              this.loading = false;
              this.page = res.data.page + 1;
            } else {
              this.page1 = res.data.page + 1;
              this.loading1 = false;
            }
            if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
              if (type == 1) {
                this.finished = true;
              } else {
                this.finished1 = true;
              }
            }
            if (res.code == 0 && res.data) {
              resolve(res);
            }
          }
        });
      });
    },
    recordStatisticsOfSchedule(){
      let url = this.api.recordStatisticsOfSchedule + "/"+this.itemData.id;
      if(this.Global.userType==3){
        url = this.api.recordStatisticsOfSchedule + "/"+ this.itemData.rotationScheduleId;
      }

      this.utils.ajax({
        url:url,
        method:"POST",
        success:res=>{
          if(res&&res.code==0){
            if(!res.data.studentRecordStatisticsPerTypeVOList) return;

            this.typeList = res.data.studentRecordStatisticsPerTypeVOList;
            this.typeList =  this.typeList.map(item => {
              item.title= item.dataTypeName;
              if(item.requireRecordNum==0){
                item.requireRecordNum='-'
              }
              if(!item.passNum){
                item.passNum=0;
              }
              return {
                ...item,
                showNum: " (" + item.passNum + "/" + item.requireRecordNum + ")"
              };
            });

          }

        }
      })
    }
  },
  created() {
    this.scheduleId = this.$route.params.itemData.id;
    this.itemData = this.$route.params.itemData;
    // dataType  数据类型  缺教学活动统计

    this.recordStatisticsOfSchedule();
    if(this.Global.userType==3){

    }
  },
  mounted() {
    
  }
};
</script>

<style scoped>
  .static-box >>>.van-tabs__wrap{
    z-index:5;
  }
  .static-box /deep/ .van-tabs__nav--card .van-tab{
    min-width:18%;
    font-size:12px;
  }
  .static-box /deep/ .van-tabs__nav--card .van-tab:nth-of-type(2){
    min-width:44%;
  }
.static-box {
}

.office {
  width: 100%;
  height: 2.875rem;
}
.tabCard {
  width: 100%;
  margin-top: 10px;
  color: #666666;
}
.box {
  
}

.box:nth-of-type(1) {
  border-top: 1px solid #e4e4e4;
}
.tab-content li {
  display: flex;
  width: 100%;
  text-align: left;
  line-height: 40px;
  font-size: 12px;
  border-left: 1px solid #e4e4e4;
}
.tab-content .pox {
  flex-shrink:0;
  width: 60%;
  text-align: center;
}
.tab-content span {
  flex-shrink:0;
  width: 20%;
  text-align: center;
  border-right: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
}
.contentBox {
  position: absolute;
  width: 100%;
  top: 135px;
  bottom: 0;
}
.tab-content {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  top: 1rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.tab-content1 {
  position: absolute;
  left: 0;
  right: 0;
  top: 41px;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.top7rem {
  top: 7rem;
}
>>>.van-cell__title {
  flex: 2;
}
.null-data {
  border-bottom: 1px solid #e4e4e4;
  border-right: 1px solid #e4e4e4;
  display: flex;
  justify-content: center;
}
</style>
