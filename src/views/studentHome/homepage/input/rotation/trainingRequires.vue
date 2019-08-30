<template>
  <div class="static-detail">
    <!--标题栏-->
    <van-nav-bar :title="requireTitle"
                 left-text="返回"
                 @click-left="onClickLeft"
                 left-arrow class="office"
    />
    <!--标签页tab-->
    <van-tabs type="card" class="tabCard">

      <van-tab title="病种要求" v-if="type==0">
        <!--内容区-->
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">病种</li>
              <li class="completeLi">
                要求完成例数 ({{allRqList.attach}})
              </li>
            </div>
            <div v-if="allRqList.result">
                <div class="box" v-for="(item,index) in allRqList.result" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum == 0 ? "_" : item.minCaseNum}}</li>
                </div>
            </div>
          </ul>
        </div>
      </van-tab>
      <van-tab title="中医病种要求" v-if="type==1">
        <!--内容区-->
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">病种</li>
              <li class="completeLi">
                要求完成例数 ({{skillRqList.attach}})
              </li>
            </div>
            <div v-if="skillRqList.result">
                <div class="box" v-for="(item,index) in skillRqList.result" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum == 0 ? "_" : item.minCaseNum}}</li>
                </div>
            </div>
          </ul>
        </div>
      </van-tab>

      <van-tab title="西医病种要求" v-if="type==1">
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">病种</li>
              <li class="completeLi">
                要求完成例数({{deaseRqList.attach}})
              </li>
            </div>
             <div v-if="deaseRqList.result">
                 <div class="box" v-for="(item,index) in deaseRqList.result" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum == 0 ? "_" : item.minCaseNum}}</li>
                </div>
             </div>
          </ul>
        </div>
      </van-tab>

      <van-tab title="手术或技术操作要求">
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">手术或技术操作</li>
              <li class="completeLi">
                要求完成例数({{operationRqList.attach}})
              </li>
            </div>
            <div v-if="operationRqList.result">
                <div class="box" v-for="(item,index) in operationRqList.result" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum == 0 ? "_" : item.minCaseNum}}</li>
                </div>
            </div>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>

export default {
  name: "staticDetail",
  data() {
    return {
      requireTitle:"",
      itemData: {departmentId:""},
      deaseRqList: [],
      skillRqList: [],
      operationRqList: [],
      allRqList: [],
      type: ''
    };
  },
  created(){
     this.itemData = this.$route.params.itemData;
     this.type = this.itemData.diseaseCategory;
     if(this.itemData){
        let departmentName = this.itemData.departmentName;
        if(this.itemData.baseDepartmentName){
            departmentName += "【"+ this.itemData.baseDepartmentName +"】";
        }
        this.requireTitle = departmentName;
     }
     console.log(this.itemData);
     
    //  获取三个要求 0 西医，1 中医，3 手术
    if (this.type) {
      this.getSingleRqList(1);
      this.getSingleRqList(2);
    } else {
      this.getSingleRqList(0);
    }
     this.getSingleRqList(3);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getSingleRqList(type,callback){
        const url =this.api.medicalRule;
        const postJson={
            scheduleId: this.itemData.id,
            dataType: type,
            pageIndex: 1,
            pageSize: 100
        };
        this.utils.ajax({
            url: url,
            method: "POST",
            data: postJson,
            success: (res) => {
                console.log(res);
                if(type == 0){
                  this.allRqList = res.data; // 病种列表
                }
                if(type == 1){
                  this.deaseRqList = res.data; // 西医病种列表
                }
                if(type == 2){
                  this.skillRqList = res.data; // 中医病种列表
                }
                if(type == 3){
                  this.operationRqList = res.data;// 手术操作列表
                }
            },
            error: (error) =>{
                console.log(error);
            } 
          });
    },
    

  }
};
</script>

<style scoped>
.office {
  width: 100%;
  height: 2.875rem;
  position: absolute;
  left: 0;
  top: 0;
}
.tabCard {
  width: 100%;
  margin-top: 10px;
  position: absolute;
  top: 2.875rem;
  left: 0;
  bottom: 0;
}
/* 表格区域 */
.tabBox {
  position: absolute;
  top: 46px;
  left: 0;
  bottom: 30px;
  width: 100%;
  padding: 0 15px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.tab-content{
  border: 1px solid #e4e4e4;
  border-bottom:none;
}
.tab-content .boxHeader li{
  text-align:center;
}
.tab-content .completeLi{
 line-height: normal;
 padding-top: 6px;
}
.box {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 40px;
  font-size: 12px;
  border-bottom: 1px solid #e4e4e4;
}
.tab-content li {
  width: 50%;
  text-align: center;
  line-height: 20px;
  padding: 5px  12px 5px 12px;
}
.tab-content li:first-child{
  border-right: 1px solid #e4e4e4;
}
/* 头部 */
.viewCenter /deep/ .van-nav-bar__text{
    color:#1da29a;
}
</style>