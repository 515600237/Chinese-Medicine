<template>
  <div class="login-container">
    <img src="../../assets/loginTopImg.png" alt="">
    <div class="tabs">
      <div  @click="status = 0" :class="{active:status==0}">过程管理系统</div>
      <div @click="status = 1" :class="{active:status==1}">360评估</div>
    </div>
    <van-cell-group class="loginBox">
      <van-field
        v-model="username"
        clearable
        left-icon="manager-o"
        placeholder="请输入用户名"
        @click-right-icon="$toast('question')"
      />
      <van-field v-model="password"
                 type="password"
                 left-icon="lock"
                 placeholder="请输入密码"
      />
      <van-cell-group>
        <van-field
          v-if="status==0"
          label="请选择培训类别："
          disabled
        >
          <div slot="button">
            <van-radio-group v-model="radio">
              <van-radio name="1" checked-color="#1DA29A">西医</van-radio>
              <van-radio name="2" checked-color="#1DA29A">中医</van-radio>
            </van-radio-group>
          </div>
        </van-field>

      </van-cell-group>
      <van-button type="primary loginBtn" @click="login()">登录</van-button>
      <div class="process-text"  v-if="status==0">
        <p v-for="(item) of listObj[1] ">{{item.text}}</p>
      </div>
      <div class="process-text" v-if="status==1">
        <p v-for="(item,index) of listObj[2]" :style="index==2?'marginTop:14px':''">{{item.text}}</p>
      </div>
    </van-cell-group>
    <footer>
      <p>中国医师协会</p>
      <p>医视界:400-001-8080 ( 周一至周五 9:00-18:00 )</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: "",//指导老师
      password: "",
        radio:1,//中西医
        status:0,
        listObj: {
            1: [
                {
                    text: "住院医师用户名为身份证或证件号，默认密码为000000"
                },
                {
                    text: "指导医师用户名为手机号，默认密码为000000"
                },
                {
                    text: "师承老师用户名为手机号，默认密码为000000"
                }
            ],
            2: [
                {
                    text: "360评估目前在部分基地进行试点，非试点单位暂不开放。"
                }, {
                    text: "如有疑问，请拨打咨询电话400-001-8080"
                }, {
                    text: " 试点单位参与评估人员登录办法如下："
                }, {
                    text: " 住院医师用户名为身份证号或手机号，"
                }, {
                    text: " 默认密码为身份证号后6位,"
                }, {
                    text: " 带教老师用户名为手机号，默认密码为000000"
                }, {
                    text: " 护理人员用户名为手机号，默认密码为000000"
                }
            ],

        }
    };
  },
  created(){
    localStorage.setItem("token","");

  },
  methods:{
      login(){
          const url= this.api.login;


          let password = this.password || "000000";
          // password = this.$md5(password);
          // 130726199012120029   刘冬莲（住院医师）  心血管科
          // 13521297526    林峰（指导医师/师承老师）
          // 13521297527    林峰1（师承老师）
          // 13521297528    林峰2（指导医师）
          // 学生账号  130225199203092987   老师 18800001005  师承 13521297526
          // 测试环境   13063119901108122X   132930199011051823  13521297525    13521297588
          //130522199102212246
          //  13092919900514142X    13521297531    130726199012120029    13521297528
          //13809859680   13809859680   445281199202180043

        /*  if(this.radio==1){
              this.$store.state.project = "west"
          }else{
              this.$store.state.project = "east"
          }*/
          const postJson={
              login: this.username || "13811100482",
             /* login: this.username || "450803198908185854",*/
              password: password,
              imei: "123",
              loginType: 1,
              project:'east'
          };
          this.utils.ajax({
            url: url,
            method: "POST",
            data: postJson,
            success: (res) => {
              const result = res.result;

            // userType 0 国家 1 省 2 基地  3 指导老师 4 学生 5 师承老师
              const roleUrlName ={ "3":"teacherHomeindex" ,"4":"homeindex","5":"teacherHomeindex","7":"teacherHomeindex"};
              if(result && res.code == 0 ){
                  const userType =result.userType;
                  this.setUserInfo(result);
                  this.$store.dispatch('showFooter');
                  this.$store.dispatch("setNewToken",result.token);
                  this.$store.dispatch("setNewImei",result.imei || "123");
                  this.$router.push({ name: roleUrlName[userType]});
                  this.$toast("登录成功");
              }else{
                   this.$toast( res.msg);
              }

            }
          });
      },
      setUserInfo(result){

        this.Global.userInfo = result;
        this.Global.userType = result.userType;
        this.Global.copyUserType = result.userType;
        this.Global.token = result.token;
        // 初始化用户信息
        this.Global.userId = result.accountId;
        this.Global.majorId = result.majorId;
        this.Global.orgId = result.orgId;
        localStorage.setItem("token",result.token);

        this.Global.userInfo.userId = result.accountId;
        this.Global.userInfo.teacherId = result.accountId;
      }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .loginBox {
    position: absolute;
    width: 100%;
    margin: 17px auto;
  }
  .loginBox >>> .van-field__label{
    width:7.625rem;
  }
  .loginBox.van-hairline--top-bottom::after {
    border: none;
  }
  .loginBox .van-cell {
    width: 90%;
    margin: 0 auto;
    text-align: left ;
  }
  .tabs{
    display: flex;
    width:90%;
    height:37px;
    margin:0 auto;
    background:#fff;
    border-radius: 15px;
    border:1px solid #1DA29A;
    transform: translate(-3px,0);

  }
  .tabs  div{
    width:50%;
    text-align: center;
    line-height: 37px;
    color:#1DA29A;

  }
  .tabs  div:first-child{
    border-top-left-radius: 13px;
    border-bottom-left-radius: 13px;
  }
  .tabs > div + div{
    border-left:1px solid #1DA29A;
    border-top-right-radius: 13px;
    border-bottom-right-radius: 13px;
  }
  .tabs .active{
    color:#fff;
    background:#1DA29A;

  }


  .loginBtn{
    width: 90%;
    height: 42px;
    line-height: 42px;
    border-radius: 42px;
    margin-top: 24px;
    background-color:#1DA29A;
  }
  .login-container >>> .van-radio-group{
    display:flex;
  }
  .login-container >>> .van-radio{
    margin-right:15px;
  }
  .login-container > img{
    width:100%;
    display: block;
    height:112px;
    margin:0 auto 14px;

  }

  .tabs-card{
    height:74px;
  }
  .process-text  p {
    font-size:12px;
    color:#1DA29A;
    text-align: left;
    margin-left:21px;
  }
  .process-text  p:first-child{
    margin-top:14px;
  }
  footer{
    position: absolute;
    bottom:20px;
    left:5%;
    right:5%;
    margin:0 auto;
  }
  footer > p{
    font-size:12px;
    margin-top:9px;
  }
  footer  p:first-child{
    margin-top:0;
  }
</style>
