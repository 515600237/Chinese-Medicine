<template>
  <div class="ht100">
    <!-- 指导医师 -->
    <van-tabbar v-model="isActive" v-if="isShow" class="bottomTab" >
      <van-tabbar-item icon="home-o"
                       @click="goPage(0,'/teacherPage/teacherHomeindex')"
                       class="itemTabbar"
      >
        <span class="iconAuditNum" v-show='isShowBtn()'>
          {{$store.state.stateStatic != 5 ? $store.state.allNoticeNum:$store.state.waitAuditShch}}
        </span>
        首页
      </van-tabbar-item>
      <van-tabbar-item v-if="$store.state.stateStatic != 5"
                       icon="bar-chart-o"
                       @click="goPage(1,'/teacherPage/teacherStatic')">
        统计
      </van-tabbar-item>
      <van-tabbar-item icon="user-o"
                       @click="goPage(2,'/teacherPage/teacherSet')">
        我的
      </van-tabbar-item>
    </van-tabbar>
    <router-view class="viewCenter" :class="{'ht100':!isShow}"></router-view>
  </div>
</template>

<script>
  export default {
    name: "teacherPage",
    data() {
      return {
        userType: 1,
        showTeacherStatic: true,
        showStatus:true,
      };
    },
    computed: {
      isShow() {
        return this.$store.getters.isShow;
      },
      isActive: {
        get() {
          return this.$store.getters.getActiveNum;
        },
        set(number) {
          this.$store.dispatch("setNewNum", number);
        }
      }
    },
    created(){

    },
    methods: {
      isShowBtn(){
        let falg = false;

        if(this.isActive == 0){

          if(this.Global.userType == 3){
            if(this.$store.state.allNoticeNum == 0 || this.$store.state.allNoticeNum == null){

            }else{
              falg = true;
            }
          }
          if(this.Global.userType == 5){
            if(this.$store.state.waitAuditShch == 0 || this.$store.state.waitAuditShch == null){

            }else{
              falg = true;
            }
          }
        }
        return falg;
      },
      goPage(activeNum, path) {

        // this.$store.dispatch("setNewNum",activeNum);
        this.$router.push({path: path});
      },
    },
    mounted() {
      this.userType = this.Global.userType;
      if (this.userType == 5) {
        this.showTeacherStatic = false;
      }
    },

    watch: {
      $route(to, from) { //跳转组件页面后，监听路由参数中对应的当前页面以及上一个页面
        if (to.name == 'teacherHomeindex' || to.name == 'teacherStatic' || to.name == 'teacherSet') {
          this.$store.dispatch('showFooter');
        } else {
          this.$store.dispatch('hideFooter');
        }
      }
    }
  };
</script>

<style scoped>
  .bottomTab {
    height: 50px;
  }

  .viewCenter {
    height: 100%;
    padding-bottom: 50px;
  }

  .viewCenter.ht100 {
    height: 100%;
    padding: 0;
  }

  .ht100 >>> .van-tabbar-item__text{
    position: relative
  }
  .iconAuditNum{
    position: absolute;
    top:-1.8rem;
    left:1rem;
    width:1.875rem;
    height: 1.25rem;
    text-align: center;
    line-height: 1.25rem;
    border-radius: 0.625rem;
    background: red;
    font-size: 0.75rem;
    color:#fff;
  }
</style>
