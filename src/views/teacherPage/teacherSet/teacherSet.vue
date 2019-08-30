<template>
  <div class="wrapper disFlex" ref="wrapper">
    <!--我的-->
    <div class="header">
      我的
      <button class="headBtn" @click="goPage('teacherPerfecInfo')">完善信息</button>
    </div>
    <!--内容区-->
    <div class="artice">
      <!--内容区标题-->
      <div class="caption">
        <div class="iconPortrait">
          <img src="../../../assets/image/user.png" alt="">
        </div>
        <p class="teacherName ">{{myInfo.userName}}</p>
        <ul class="manInfo">
          <li class="tal">
            职能<span class="colon">:</span>
            <span v-if="userType == 3">指导医师</span>
            <span v-if="userType == 5">师承医师</span>
          </li>
        </ul>
        <ol class="endTime">
          <li class="tal" style="color: #ff8800">
            截止目前您的带教人数是<span class="colon">:</span>{{myInfo.peopleNum || 0}}人
          </li>
        </ol>
      </div>
      <!--主内容-->
      <div class="section">
        <div class="changePassWord">
          <van-cell-group>
            <van-cell
              value="修改密码"
              icon="lock"
              is-link
              class="password"
              @click="changePassword()"
            />
          </van-cell-group>
        </div>
        <div class="tips">
          <van-cell-group>
            <van-cell value="使用说明"
                      icon="question"
                      is-link
                      :to="{path:'/teacherPage/operatingTeacher'}"
            />
          </van-cell-group>
          <van-cell-group>
            <van-cell value="意见反馈"
                      icon="comment"
                      is-link
                      :to="{path:'/teacherPage/feedbackTeacher'}"
            />
          </van-cell-group>

          <van-cell value="400-001-8080"
                    icon="phone"
                    is-link
                    @click="connect"
          >
              <template slot="title">
                  <span class="custom-text">联系我们</span>
              </template>
          </van-cell>
          
          <van-cell value="1.0.2" icon="info">
            <template slot="title">
              <span class="custom-text">版本信息</span>
            </template>
          </van-cell>
        </div>
        <div class="quitLogin">
          <button class="deleteBtn"
                  @click="outLogin">退出登录
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  // import BScroll from 'better-scroll';
  export default {
    name: "teacherSet",
    data() {
      return {
        myInfo:"",
        userType: 4
      };
    },
    methods: {
      changePassword(){
        this.$router.push({ name: "changepassword2" });
      },
      goPage(name) {
        this.$router.push({ name: name, params: { type: 2 } });
      },
      isInApp() {
        if (typeof Elf.AppCallWeb != "undefined") {
          return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
        }
      },
      outLogin() {
        this.$dialog
          .confirm({
            title:"确定要退出吗？",
            message: "退出登录后，你将收不到数字住培发送的消息",
            confirmButtonColor:"red",
            confirmButtonText:"确定",
          })
          .then(() => {
            if(this.isInApp()){
              this.webApp.WebCallApp("UserLogout", {}, (res) => {});
            }else{
              this.$router.push({ name: "login"});
            }
          })
          .catch(() => {
            console.log(2);
          });
      },
      connect() {
        this.$dialog
          .confirm({
            message: "确定要拨打电话吗"
          })
          .then(() => {
            this.webApp.WebCallApp("CmdDialing",{"tel":"400-001-8080"}, (res) => {});
          })
          .catch(() => {
            console.log(2);
          });
      },
      handleTo() {
        this.$router.push(
          { name: "feedback" }
        );
      },
      getUserInfo() {
        const url = this.api.mysetInfo;
        const postJson = {
          userId: this.Global.userInfo.userId,
          userType: this.Global.userType
        };
        this.utils.ajax({
          url: url,
          method: "POST",
          data: postJson,
          success: res => {
            console.log(res);
            this.myInfo = res.result;
            this.myInfo  =Object.assign({},this.myInfo,res.result)
          }
        });
      }
    },
    created(){
      this.userType = this.Global.userType;
      this.getUserInfo();

    },
    mounted(){
      /*this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper, {})
      })*/
    }
  }
</script>

<style scoped>
  .wrapper /deep/ .van-progress{
    width:100%;
    height:0.3125rem;
  }
  .wrapper{
    width:100%;
    height:100%;
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:auto;
    flex-direction: column;
    background:#f2f2f2;
    overflow-y: auto;
  }
  .header{
    width:100%;
    height:2.875rem;
    background:#A083E0;
    color:#fff;
    line-height:2.875rem;
    font-size:16px;
    position: relative;
  }
  .headBtn{
    min-width:60px;
    max-height:2rem;
    background:#fff;
    border-radius: 5px;
    position: absolute;
    right:10px;
    top:0.4375rem;
    text-align: center;
    font-size:14px;
    border:0;
    color:#A083E0;
    line-height:2rem;
  }
  /*图标 姓名 参培时间*/
  .artice{
    flex:1;
    margin-top:10px;
  }
  .artice .caption{
    width:100%;
    /* height:210px; */
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    background:#fff;
    padding:1rem 17px;
    box-sizing: border-box;
  }
  .teacherName{
    color:#A083E0;
    font-size:1rem;
    line-height: 3rem;
  }
  .iconPortrait{
    width:67px;
    height:67px;
    margin: 0 auto;
  }
  .iconPortrait img{
    width:100%;
  }
  .manInfo{
    align-self: flex-start;
    font-size:12px;
    color:#333333;
  }
  .endTime{
    align-self: flex-start;
    font-size:12px;
    color:#333333;
  }
  .progress{
    width:100%;
    height:0.3125rem;
  }

  .colon{
    margin:0 7px;
  }
  .startTime{
    align-self: flex-end;
  }
  .erect{
    margin:0 7px;
    align-self: flex-end;
  }
  /*修改密码 版本信息 退出登录*/
  .password {
    margin: 12px 0;
  }
  .wrapper /deep/ .van-cell__title {
    text-align: left;

  }
  .wrapper /deep/ .van-cell__value--alone span{
    font-size:14px;
  }
  .deleteBtn {
    border-radius: 4px;
    height: 40px;
    margin-top: 20px;
    border: none;
    width: 95%;
    background: #A083E0;
    color: #fff;
    font-size: 14px;
  }
  .tal {
    text-align: left;
    line-height: 1.6rem;
  }
</style>