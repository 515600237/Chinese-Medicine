<template>
  <div class="author">
    <header>过程管理系统登录</header>
    <div class="icon">
      <img src="../../assets/iconpng.png" alt="">
      <p>过程管理系统</p>
    </div>

    <div class="author-bottom">
      <p>登录后该应用将获得以下权限</p>
      <p>获得你的公开信息(昵称、头像等)</p>
      <van-button  @click="author" class="btn">
        授权
      </van-button>
      <van-button  @click="cancelAuthor" class="btn">
        取消
      </van-button>

    </div>

  </div>
</template>

<script>
    export default {
        name: "author",
        methods:{
            author(){
                const roleUrlName ={ "3":"teacherHomeindex" ,"4":"homeindex"};
                this.$router.push({name: 'homeindex'})
            },
            cancelAuthor(){
                const roleUrlName ={ "3":"teacherHomeindex" ,"4":"homeindex"};
                this.$router.push({name: roleUrlName[userType]})
            },

        }
    }
</script>

<style scoped>
  .author{
    display: flex;
    flex-direction: column;
  }
  header{
    width:100%;
    background:#1DA29A;
    height:3rem;
    line-height: 3rem;
    color:#fff;
  }
  .icon{
    margin:50px 0;
  }
  .icon::after{
    display: block;
    width:80%;
    position: relative;
    top:25px;
    content: " ";
    height:1px;
    margin:auto;
    background:#ccc;
    /*  transform: translate(0,25px);*/
  }
  .icon p{
    margin-top:10px;
    font-weight: bold;
  }
  .author img{
    width:80px;
    height:80px;
  }
  .author-bottom{
    width:80%;
    margin:0 auto;
  }
  .author-bottom  p  {
    text-align: left;
    font-weight: bold;
  }
  .author-bottom  p:nth-of-type(2){
    font-size:14px;
    margin:15px 0;
    font-weight: normal;
  }
  .author-bottom  p:nth-of-type(2)::before{
    content:"\27a5";
    margin-right:10px;
  }
  .btn{
    width: 80%;
    background: #1DA29A;
    margin:15px auto;
    color:#fff;
  }
</style>

