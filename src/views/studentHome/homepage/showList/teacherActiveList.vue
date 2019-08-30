<template>
        <div class="accomplish-box">
          <!--头部-->
          <van-nav-bar
            :title="headTitle"
            left-text="返回"
            left-arrow
            @click-left="goBack"
            @click-right="goluPage"
          >
            <van-button
              size="small"
              slot="right"
              class="btnSave">
               录入
            </van-button>
          </van-nav-bar>

          <!--内容-->
          <div v-if="!activeResultList.page || !activeResultList.page.result" class="lose-img-box">
            <div>
              <img src="../../../../assets/image/defaulTentering.png" alt="">
            </div>
            <p>暂无信息</p>
          </div>
          <!--审核-->
          <div v-else class="time">
            <span class="subtime"></span>
            <ul class="time-ul">
              <li>已录入:<span class="num-blue">{{activeResultList.total}}</span></li>
              <li>待审核:<span class="num-blue">{{activeResultList.unAuditNum}}</span></li>
              <li>已通过:<span class="num-blue">{{activeResultList.auditedNum}}</span></li>
              <li>未通过:<span class="num-blue">{{activeResultList.refusedNum}}</span></li>
            </ul>
          </div>
          <div class="accomplish-content">

            <!--列表页-->
            <van-list
              v-model="loading"
              :error.sync="error"
              error-text="请求失败"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <teacherActiveChild :resData ="teachActiveList" v-if="activeResultList.page"></teacherActiveChild>
            </van-list>
          </div>
        </div>
</template>

<script>
  // 教学活动子组件
  import teacherActiveChild from "@/views/studentHome/homepage/showList/listChild/teacherActiveChild"

  export default {
    name: "teacherActiveList",
    components:{
      teacherActiveChild,
    },
    data(){
      return{
        headTitle:"教学活动完成情况",
        activeResultList: {},
        teachActiveList:[],
        deptType: 1,
        /*上拉加载*/
        loading: false,
        finished: false,
        error: false,
        page:1,
      }
    },
    created(){
      console.log(this.Global.currentItem);
      this.deptType = this.Global.currentItem.depDetailType;
      if(this.deptType == 1){
         this.headTitle =  this.Global.currentItem.departmentName
      }else{
         this.headTitle ="教学活动完成情况";
      }

    },
    methods:{
      getActiveList(){
        const that = this;
        const url = this.api.activityList;

        let data={
            "departmentId": null,
            "pageIndex": this.page,
            "pageSize": 10,
        };
        this.utils.ajax({
          url:url,
          method:"post",
          data:data,
          success:res=>{
            if(res.code == 0 && res.data){
              that.loading= false;
              that.page = res.data.page.page + 1;
              that.activeResultList = res.data;
              that.teachActiveList = that.teachActiveList.concat(res.data.page.result);
              if(res.data.page.page == res.data.page.totalPage || res.data.page.totalPage === 0){
                that.finished = true;
              }
            }else{
              that.error = true;
              that.$toast( res.msg );
            }  
          }
        })

      },
      onLoad() {
        this.getActiveList();
      },
      savePage(){

      },
      goluPage(){
        this.$router.push({ name:"teachingActiveIndex"});
      },
      goModifyPage(){
        this.$router.push({ name:"teachingActiveModify"});
      },
      goBack(){
        // 教学活动列表返回上一个页面
        this.$router.push({ path:"/studentHome/homeindex"});
      },
    },
    created(){
      // this.getActiveList();
    }
    
  }
</script>

<style scoped>
  .accomplish-box{
    width:100%;
    height:100%;
    display: flex;


    flex-direction: column;
  }
  .accomplish-content{
    flex:1;
    background:#F2F2F2;
    overflow-y: scroll;
  }
  /*审核*/
  .subtime {
    display: block;
    line-height: 12px;
    font-size:14px;
    margin:10px auto;
  }
  .time-ul {
    display: flex;
    justify-content: space-evenly;
    font-size:12px;
    width:80%;
    margin:0 auto;
  }
  .time-ul li {
    margin-right: 5px;
    font-size: 12px;
  }

  /*缺省图*/
  .lose-img-box{
      position: absolute;
      top:25%;
      left:0;
      right:0;
      bottom:0;
      margin:0 auto;
  }

  .num-blue {
    color: #0079FE;
    text-indent: 5px;
    display: inline-block;
  }
</style>
