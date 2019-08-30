<template>
  <div class="static">
    <!--header头部-->
    <van-nav-bar title="本科室学员轮转完成情况"/>


    <!--弹窗-->
    <van-dropdown-menu class="menu-drop-box">
      <!-- 年份 -->
      <van-dropdown-item v-model="yearVal" :options="yearColumn"
                         @change="menuChange1" :title="yearVal+'年'"
                         active-color="#A083E0"
      />
      <!-- 轮转状态 -->
      <van-dropdown-item v-model="rotationStatus" :options="rotationStatusColumn" :title="menuTitle" class='menu-pop-box' @change="menuChange2" />
    </van-dropdown-menu>

    <div class="static-view">
      <div class="progressBox text-left"
           @click="goStaticDetail(item)"
           v-for="(item,index) of  relationResult" :key="index">
        <p class="progressTitle">{{item.studentName}}  [<span>{{item.rotationStatus}}</span>]</p>
        <div>
          <div class="progressBar">
            <div class="progressInBar" :style="{ width: item.completeRecordProgress +'%'}"></div>
          </div>
          <div class="progressNum" >{{item.completeRecordProgress}}%</div>
        </div>

      </div>
    </div>
    <!--缺省图-->
    <div v-if="!relationResult||!relationResult.length"
         class="miss disFlex">
      <div class="lack disFlex">
        <img :src="imgUrl" alt="">
        暂无统计信息
      </div>
    </div>
  </div>
</template>

<script>
  import selectYear from "@/components/selectListPop.vue";
  import selectState from "@/components/selectListPop.vue";
  import selectListPop from "@/components/selectListPop/selectListPop.vue";
  import {getData} from "../../../common/js/dom";
  export default {
    name: "staticindex",
    data() {
      return {
        yearVal: 2019,//选择年代
        rotationStatus: -1,//轮转状态
        yearColumn: [],//年代列表
        rotationStatusColumn: [
          { text: '全部', value: -1 },
          { text: '未入科', value: 0 },
          { text: '轮转中', value: 1 },
          { text: '已出科', value: 2 },
          {text:'轮转中-本月出科',value:3},
        ],
        menuTitle:"轮转状态-全部",//标题
        page:1,
        pageSize:10,
        radio:0,
        staticShow:true,
        imgUrl:require('../../../assets/image/defaulTentering.png'),
        // 年份
        currentYear: 2019,
        yearList: [],
        showYearPop: false,
        // 轮转状态
        state: "全部",
        rotationStatus: -1,
        list:[],
        index:0,
        stateList: ["全部","未入科","轮转中","已出科"],
        showStatePop: false,
        rate: 100,
        currentRate: 5,
        relationResult: []
      };
    },
    components:{
      vSelectyear : selectYear,
      vSelectstate : selectState,
      SelectListPop:selectListPop,
    },
    computed: {
      text() {
        return this.currentRate.toFixed(0) + "%";
      }
    },
    created(){
      this.currentYear = new Date().getFullYear();
      this.initYear();
      if(this.Global.userType==3){
        this.showRotationProgress();
      }
      if(this.Global.userType==4){
        this.showRotationProgress();
      }
      if(this.Global.userType==5){
        this.relationResult = [];
      }
      if(this.$store.state.teachStatus===0||this.$store.state.teachStatus){

      }
    },
    methods: {
      /*******************数据请求************************/
      showRotationProgress(){
        const url = this.api.showRotationProgress ;
        console.log(this.Global.userInfo.standardDepartmentId);
        const postJson={
          standardDepartmentId: this.Global.userInfo.standardDepartmentId,
          year:this.yearVal,
          rotationStatus:this.rotationStatus,
          pageIndex:1,
          pageSize:10,
        }
        this.utils.ajax({
          url:url,
          method:"POST",
          data:postJson,
          success:res=>{
            if(res.code == 0){
              this.relationResult = res.data.result;
            }
          }
        });
      },
      initYear(){
        let  date = new Date();
        let startYear = date.getFullYear();
        let  endYear = date.getFullYear()+ 4;
        for (let i = startYear; i < endYear; i++) {
          this.yearColumn.push(
            {
              text: i + "年",
              value:i,
            },
          );
        }
      },
      menuChange1(){
        this.showRotationProgress();
      },
      menuChange2(value){
        this.menuTitle="轮转状态-";
        switch(value){
          case -1:
            this.menuTitle +="全部";
            break;
          case 0:
            this.menuTitle +="未入科";
            break;
          case 1:
            this.menuTitle +="轮转中";
            break;
          case 2:
            this.menuTitle +="已出科";
            break;
          case 3:
            this.menuTitle +="轮转中-本月出科";
            break;
        }

        this.showRotationProgress();
      },
      selectYear(){
        this.showYearPop = true;
      },
      selectState(){
        this.showStatePop = true;
      },
      hideYearPop(){
        this.showYearPop  = false;
        this.showStatePop = false;
      },
      chooseItemYear(item ="",index){
        this.radio = index;
        this.currentYear = parseInt(item);
        this.showYearPop = false;
        this.showRotationProgress();
      },
      chooseStateData(item="",index){
        this.state = item;
        this.radio = index;
        this.showStatePop = false;
        const index1= Number(this.stateList.indexOf( this.state));
        this.rotationStatus =  index1 -1;
        console.log(this.rotationStatus);
        this.showRotationProgress();
      },
      goStaticDetail(item){
        // 住院医师
        if(this.Global.userType ==4){
            this.$router.push({name:"staticdetail",params:{itemData: item}});
        }

        if(this.Global.userType ==3 || this.Global.userType ==5){
            this.$router.push({name:"staticdetail2",params:{itemData: item}});
        }
      }
    },

  };
</script>

<style scoped>
  .menu-drop-box{
    background:#f2f2f2;
    border-top: 1px solid rgba(228, 228, 228, 1);
    border-bottom:1px solid rgba(228, 228, 228, 1);
  }
  .static >>> .van-dropdown-menu__item:first-of-type{
    border-right:1px solid rgba(228, 228, 228, 1);
  }

  .menu-pop-box{
    border-left:1px solid #f2f2f2;
  }
  .static >>> .van-cell__title{
    text-align: left;
  }
  .static {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    background: #fff;
  }
  .static-view {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
  /*条件选择区*/
  .queryBox {
    width: 100%;
    height: 38px;
    line-height: 38px;
    border-left: none;
    border-right: none;
    font-size:1rem;
  }
  .queryBox i {
    font-style: normal;
  }
  .yearBox {
    border-right: 1px solid #e4e4e4;

  }
  /* 年度选择弹窗 */
  .yearPops {
    top: 84px;
  }
  .overYearbg {
    opacity: 0.5;
  }
  .icon_more {
    border-width: 8px;
    margin-left: 10px;
    margin-top: 5px;
  }
  .yearSeList {
    text-align: left;
    text-indent: 20px;
  }
  .yearSeList li {
    height: 45px;
    line-height: 45px;
    border-bottom: 1px solid #ccc;
  }
  /* 进度条 */
  .progressBox{
    margin-top: 20px;
  }
  .progressTitle{
    font-size:1rem;
    margin-bottom: 6px;
  }
  .progressBar{
    position: relative;
    display: inline-block;
    width: 276px;
    height: 8px;
    background-color: #F2F2F2;
    border-radius: 8px;
    overflow: hidden;
  }
  .progressBar .progressInBar{
    position: absolute;
    width:50%;
    left: 0;
    top:0;
    bottom: 0;
    background-color: #A083E0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .progressNum{
    display: inline-block;
    font-size: 12px;
    margin-left: 8px;
  }
  /*环形进度条*/
  .static-view-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 480px;
    /* border:1px solid greenyellow;*/
  }
  .static-view-content li {
    width: 50%;
    height: 160px;
    margin-bottom: 10px;
    /*  padding-top:10px;*/
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    /* border:1px solid lightcoral;*/
  }
  .static-view-content li span {
    font-size: 12px;
    color: #333;
  }
  .static-view-content /deep/ .van-circle__text {
    font-size: 28px;
    color: #999;
    text-align: center;
  }
  /*缺省图片*/
  .miss{
    width:100%;
    height:calc(100% - 90px);
    justify-content: center;
    align-items: center;
  }
  .lack{
    width:220px;
    height:180px;
    flex-direction: column;
    font-size:18px;
    color:#999;
  }
  .lack img{
    width:100%;
  }

</style>
