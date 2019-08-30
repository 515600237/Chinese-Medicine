<template>
  <div class="static">

      <!--header头部-->
      <div class="header">
        <van-tabs type="card" v-model="staticActive" @click="tabClick" >
          <van-tab title="第一阶段"></van-tab>
          <van-tab title="第二阶段"></van-tab>
        </van-tabs>
      </div>

      <!--缺省图-->
      <div v-if="(staticActive===0&&!staticObj[1])||(staticActive===1&&!staticObj[2])"
           class="miss disFlex">
        <div class="lack disFlex">
          <img :src="imgUrl" alt="">
        </div>
        <p class="textentering"></p>
        <div>
            暂无轮转计划
        </div>

      </div>
      <!--内容区容器-->
      <div class="static-view"  v-show="staticActive===0&&staticObj[1]">
        <!--三个小标签-->
        <ul class="static-view-title"  v-if="staticObj[1]">
          <li>
            <span class="one"></span>
            <p>轮转中:{{staticObj[1].rotatingDepartmentNum}}</p>
          </li>
          <li>
            <span class="two"></span>
            <p>已出科：{{staticObj['1'].passedDepartmentNum}}</p>
          </li>
          <li>
            <span class="three"></span>
            <p>未入科：{{staticObj['1'].noStartDepartmentNum}}</p>
          </li>
        </ul>
        <!--环形进度条-->
            <div ref="circleScroll" class="circle-wrapper">
              <ol class="static-view-content" >
                <li @click.prevent="goStaticDetail(item)"
                    v-for="(item,index) of staticDataOne"
                    :key="index"
                >
                  <div id="box1" class="pieItemBox"></div>
                  <p>{{item.departmentName}}</p>
                  <p class="ligntColor" v-if="item.baseDepartmentName">【{{item.baseDepartmentName}}】</p>
                </li>
              </ol>
            </div>
      </div>
      <div class="static-view"  v-show="staticActive===1&&staticObj[2]" >
        <!--三个小标签-->
        <ul class="static-view-title"  v-if="staticObj[2]">
          <li>
            <span class="one"></span>
            <p>轮转中:{{staticObj["2"].rotatingDepartmentNum }}</p>
          </li>
          <li>
            <span class="two"></span>
            <p>已出科：{{staticObj["2"].passedDepartmentNum}}</p>
          </li>
          <li>
            <span class="three"></span>
            <p>未出科：{{staticObj["2"].noStartDepartmentNum}}</p>
          </li>
        </ul>
        <!--环形进度条-->
        <div  ref="circleScroll" class="circle-wrapper">
          <ol class="static-view-content" >
            <li @click.prevent="goStaticDetail(item)"
                v-for="(item,index) of staticDataTwo"
                :key="index"
            >
              <div id="box2" class="pieItemBox1"></div>
              <p>{{item.departmentName}}</p>
              <p class="ligntColor" v-if="item.baseDepartmentName">【{{item.baseDepartmentName}}】</p>
            </li>
          </ol>
        </div>
      </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
export default {
  name: "staticindex",
  data() {
    return {
      staticActive:0,
      msg:{},
      imgUrl:require('../../../../assets/image/defaulTentering.png'),
      rate1: 100,
      rate2: 27,
      currentRate1: 0,
      currentRate2: 0,
      resizeShow: "120px",
      staticDataOne: [],
      staticDataTwo:[],
      staticObj:{},
    };
  },
  created(){
  },
  computed: {
    circleSize() {
      let clientWidth_get = document.documentElement.clientWidth;
      let size = parseInt((clientWidth_get / 375) * 120) + "px";
      return size;
    },
    text1() {
      return this.currentRate1.toFixed(0) + "%";
    },
    text2() {
      return this.currentRate2.toFixed(0) + "%";
    },

  },
  methods: {
    goPage(){
    /*  this.$router.push({name:"CaseOper"});*/
    },

    goStaticDetail(item) {
      console.log(item);
     this.$router.push({name:"staticdetail",params:{itemData: item}});
    },
    resize() {
      var clientWidth_get = document.documentElement.clientWidth;
      this.resizeShow = (clientWidth_get / 375) * 16 + "px";
    },
    drawLine() {
      // 基于准备好的dom，
      // 初始化echarts实例
      var  echartsDom,dataItem;
      if(this.staticActive===0){
         echartsDom = document.getElementsByClassName("pieItemBox");
      }else{
        echartsDom = document.getElementsByClassName("pieItemBox1");
      }

      Array.from(echartsDom).forEach((item,index)=>{
        let myChart = this.$echarts.init(item);
        if(this.staticActive===0){
          dataItem = this.staticDataOne[index];
        }else{
          dataItem = this.staticDataTwo[index];
        }
        const option = this.getOption(dataItem);
        myChart.setOption(option);
      })
    },
    /*切换阶段、初始echarts*/
    tabClick(name, title) {
      if (title == "第一阶段") {
        this.init();
      }
      if (title == "第二阶段") {
        this.init();
      }
    },

    getOption(dataItem){
       console.log(dataItem);
        let progress =  dataItem.progress + "%";
        let passNum = dataItem.passedNum;
        let noPassNum = dataItem.requiredNum - dataItem.passedNum;
        if(passNum == 0 && noPassNum== 0 ){
           noPassNum =1;
        }
        // rotationStatus 0 未入科 1 轮转中  2 已出科
        let color =""
        if(dataItem.rotationStatus == 0){
              color="#e4e4e4";
        }
        if(dataItem.rotationStatus == 1){
              color="#A083E0";
        }
        if(dataItem.rotationStatus == 2){
              color="#0079fe";
        }
        // 绘制图表
        let option = {
          series: [
            {
              name: "",
              type: "pie",
              radius: ["60%", "75%"], //这里是控制环形内半径和外半径             avoidLabelOverlap: false,
              hoverAnimation: false, //控制鼠标放置在环上时候的交互
              color:[color,'#e4e4e4'],
              label: {
                normal: {
                  show: true,
                  position: "center",
                  textStyle: {
                    fontSize: "16",
                    fontWeight: "bold"
                  }
                }
              },
              data: [
                {
                  value: passNum,
                  name: progress
                },
                {
                  value: noPassNum,
                  name: ""
                }
              ]
            }
          ],
          color: ["#339900", "#C9C9C9"]
        };
        return option;
    },

    /**************数据请求***************/
    //统计首页
    rotationProgress(){
      return new Promise( (resolve,reject) =>{
        const url = this.api.rotationProgress;
        this.utils.ajax({
          url:url,
          method:"POST",
          success:res=>{
              resolve(res);
          }
        })
      } )
    },
    init() {
      this.rotationProgress().then((res)=>{
        this.staticObj = Object.assign({},{},res.data);
        if(this.staticObj[1]){
          this.staticDataOne = this.staticObj[1].departPassedMedicalRecordDtoList;
        }
        if(this.staticObj[2]){
          this.staticDataTwo = this.staticObj[2].departPassedMedicalRecordDtoList;

        }
        this.$nextTick(() =>{
          this.drawLine();
          this.scroll =  new BScroll(this.$refs.circleScroll, {
            mouseWheel: true,
            click: true,
            tap: true
          });
        })
      })
    }
  },
  mounted() {
    this.init();

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .static>>> .van-tabs__nav--card {
    margin: 0 4.5rem;
  }

.static  .header{
  width:100%;
  height:2.875rem;
  padding:5px;
  box-sizing: border-box;
}
.static-view {
  /* width: 100%; */
  padding: 0 30px;
  box-sizing: border-box;
}
/*三个小标签css*/
.static-view-title {
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
}
.static-view-title li {
  display: flex;
  width: calc(100% / 3);
  height: 2rem;
  justify-content: center;
  align-items: center;

}
  .circle-wrapper{
    position: absolute;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
    top:calc(4.875rem + 10px);
    left:1rem;
    right:1rem;
    bottom:2.875rem;
    margin:0 auto;
  }

/* 饼状图 */
.pieItemBox{
    width: 100%;
    height: 145px;
}
.pieItemBox1{
    width: 100%;
    height: 145px;
}
.static-view-title span {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.static-view-title .one {
  background: #A083E0;
}
.static-view-title .two {
  background: #0079fe;
}
.static-view-title .three {
  background: #e4e4e4;
}
/*环形进度条*/
.static-view-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.van-circle__layer {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.static-view-content li {
  width: 157px;
  height: 160px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.static-view-content li p {
  font-size: 12px;
  color: #333;
}
.static-view-content li .ligntColor{
  color: #cccccc;
}
.static-view-content /deep/ .van-circle__text {
  font-size: 28px;
  color: #999;
  text-align: center;
}

  /*缺省图*/
.miss{
  width:100%;
  height:calc(100% - 90px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.lack{
  width:9rem;
  height:9rem;
}
.lack img{
        width:100%;
}
.textentering{
  font-size:18px;
  width:100%;
  color:#999;
  margin-bottom:20px;
}
.entering{
  width:12.5rem;
  height:2.5rem;
  border-radius:2rem;
  background:#fff;
  border: 1px solid #A083E0;
  font-size:1rem;
  color:#A083E0;
}
</style>