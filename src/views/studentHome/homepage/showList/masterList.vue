<template>
  <div class="teacher-acc-box">
    <!--头部-->
    <van-nav-bar
      :title="headTitle"
      left-text="返回"
      left-arrow
      @click-left="goPage"
      @click-right="goluPage"
      :fixed="true"
    >
      <van-button
        size="small"
        slot="right"
        class="btnSave">
        录入
      </van-button>
    </van-nav-bar>
    <div class="time">
      <span class="subtime"></span>
      <ul class="time-ul">
        <li>已录入:<span class="num-blue">{{data.total}}</span></li>
        <li>待审核:<span class="num-blue">{{data.unAuditNum}}</span></li>
        <li>已通过:<span class="num-blue">{{data.auditedNum}}</span></li>
        <li>未通过:<span class="num-blue">{{data.refusedNum}}</span></li>
      </ul>
    </div>
    <div class="acccom-box">
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <masterListChild :listPage="teachList"></masterListChild>
      </van-list>
    </div>
  </div>
</template>

<script>
  import masterListChild   from "@/views/studentHome/homepage/showList/listChild/masterListChild"
  export default {
    name: "masterList",
    data(){
      return{
        headTitle:"师承完成情况",
        teachList:[],
        loading: false,
        finished: false,
        error: false,
        page: 1,
        data:{}
      }
    },
    methods:{
      goPage(){
        this.$router.push({ path:"/studentHome/homeindex"});
      },
      goluPage(){
        this.$router.push({name:"teachingEntry"});
      },
      onLoad(){
        this.spliceList();
      },
      /****************数据请求*******************/
      spliceList(){
        const url = this.api.spliceList;
        let postJson = {
          pageIndex: this.page,
          pageSize:10,
        };
        this.utils.ajax({
          url:url,
          method:"POST",
          data:postJson,
          success:res=>{
            this.loading = false;
            if(res&&res.code==0){
              this.page = res.data.page.page + 1;
              this.data = Object.assign({},res.data);
              this.teachList = this.teachList.concat(res.data.page.result);
              if(res.data.page.page == res.data.page.totalPage || res.data.page.totalPage === 0){
                this.finished = true;
              }
            } else {
              this.error = true;
            }
          }
        })
      }
    },
    mounted(){},
    components:{
      masterListChild,
    }
  }
</script>

<style scoped>
  .list{
    height:calc(100% - 3.4rem);
    overflow: scroll;
  }
  .time{
    margin-top:3.4rem ;
  }
  .teacher-acc-box{
    display: flex;
    flex-direction: column;
    background:#f2f2f2;
  }
  .subtime {
    display: block;
  }
  .time-ul {
    display: flex;
    justify-content: space-evenly;
    font-size:12px;
    width:80%;
    margin:0 auto;
    line-height: 24px;
  }
  .num-blue {
    color: #0079FE;
    text-indent: 5px;
    display: inline-block;
  }
  .acccom-box {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    padding: 0 8px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

</style>
