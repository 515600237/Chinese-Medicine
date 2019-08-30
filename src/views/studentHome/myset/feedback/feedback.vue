<template>
  <div class="feedback">
    <!--标题栏-->
    <van-nav-bar
      title="意见反馈"
      left-text="返回"
      left-arrow
      class="office"
      @click-left="goPage"
    />
    <!--内容区-->
    <form class="form">
      <textarea
        class="text"
        v-model="remark"
        maxlength="200"
        @input="descArea()"
        placeholder="告诉我们您的建议或遇到的问题,我们将为您不断改进..."
      >
      </textarea>
      <p class="pay-service-textarea-text">
        <span>{{remnant}}</span>/200
      </p>
    </form>
    <van-cell-group>
      <van-field v-model="phone"
                 maxlength="30"
                 class="title"
                 type="text"
                 placeholder="请填写您的联系方式,方便我们联系您反馈"
      />
    </van-cell-group>
    <button class="handleSubmit" @click="handleSubmit">提交</button>
  </div>
</template>

<script>
export default {
  name: "feedback",
  data() {
    return {
      phone: "",
      textarea: "",
      remark: "",
      remnant: 0,
      placeholder:"请填写您的联系电话，方便我们联系您反馈"
    };
  },
  methods: {
    goPage() {
      // 区分住院医师和 老师
      this.$router.go(-1);
    },
    descArea() {
      this.remnant = this.remark.length;
    },
    handleSubmit(e) {
      if(!this.remark){
        this.$toast("请输入您的建议或遇到的问题");
        return;
      }
      if(this.remark.length > 200){
          this.$toast("输入您的建议或遇到的问题最长为200个字符");
          return;
      }
      if(!this.phone){
        this.$toast("请填写您的联系方式");
        return;
      }
      var phoneReg = /^1[3456789]\d{9}$/;
      if(! phoneReg.test(this.phone)){
        this.$toast("您输入的联系方式不合法");
        return;
      }
      this.submitAjax();
      // this.$router.push({ name: 'mySet' });
    },
    // 意见反馈接口调用
    submitAjax(){
      const url = this.api.suggestion;
      const postJson = {
         remark: this.remark,
         phone: this.phone
      };
      console.log(postJson);
        this.utils.ajax({
            url: url,
            method: "POST",
            data: postJson,
            success: (res) => {
              console.log(res);
              if(res.code == 0){
                 this.$toast("意见反馈成功");
                 this.$router.go(-1);
              }else{
                this.$toast(res.msg);
              }
            }
          });
    }

  }
};
</script>

<style scoped>
  .form{
    margin:12px 0;
  }
.feedback {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f2f2f2;
}

.title {
  margin: 10px 0 5px;
}

.text {
  width: 100%;
  height: 240px;
  border: 1px solid #ccc;
  padding:10px 0;
  font-size: 0.875rem;
  text-indent: 0.935rem;
}
.pay-service-textarea-text {
  text-align: right;
  position:absolute;
  right:25px;
  top:calc(220px + 2.875rem);
  font-size:0.9rem;
}

.handleSubmit {
  border-radius: 20px;
  height: 40px;
  margin-top: 15px;
  border: none;
  width: 95%;
  background: #A083E0;
  color: #fff;
  font-size: 14px;
}
</style>