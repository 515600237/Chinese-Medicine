<template>
  <div>
   <!--附件-->
          <van-cell-group>
            <div class="nearBy" :class="{'iconRequried':required}">
              <div  :class="{'nearByText':required}">
                附件
              </div>
              <!--附件-->
              <div class="imgBox">
                <!--添加图片-->
                <div class="icon-box"
                   v-for="(itemImg,imgIndex) of activityAttachmentsCopy"
                   :key="imgIndex"
                >
                  <img :src="itemImg" alt="">
                  <span class="iconDel">
                   <van-icon name="clear"
                             color="red"
                             @click.stop="reduceClick(itemImg,imgIndex)"
                   >
                   </van-icon>
                  </span>
                </div>
                <!--增加按钮-->
                <p class="icon-box"
                   @click.stop="addFileClick()"
                   v-if="!activityAttachmentsCopy || activityAttachmentsCopy.length <3"
                >
                  <van-icon name="add"/>
                </p>
              </div>
            </div>
          </van-cell-group>
  </div>
</template>

<script>
// itemIndex 区分第几个
export default {
  props: ["activityAttachments","itemIndex", 'required'],
  data() {
    return {
       activityAttachmentsCopy: []
    };
  },
  created(){
    console.log(this.required);
  },
  methods: {
    /*附件 图片增加删除*/
    initData() {
      this.activityAttachmentsCopy = this.activityAttachments || [];
    },
    addFileClick() {
      // code == 0上传成功，1 取消，2上传失败 安卓,ios没有code
      if (this.activityAttachmentsCopy.length <3) {
        const maskImg = this.Toast.loading({
          forbidClick:true,
          mask: true,
          message: '加载中...'
        });
        setTimeout(()=>{
          if (maskImg) {
            maskImg.clear();
          }
        }, 10000)
        this.webApp.WebCallApp("uploadImg", {}, (res) => {
            console.log(res);
            if(maskImg) {
              maskImg.clear();
            }
            if( res && res.flag && res.result){
                 console.log(res.code);
                 if(res.code == 0){ //上传成功
                    this.activityAttachmentsCopy.push(res.result.path);
                    this.$emit("changeImg",this.activityAttachmentsCopy,this.itemIndex);
                 }
                 if(res.code == 2){//安卓
                    this.$toast("图片添加失败");
                 }
                 if(res.code !==0 && !res.code){//iOS环境
                      if(res.result.path){
                          this.activityAttachmentsCopy.push(res.result.path);
                          this.$emit("changeImg",this.activityAttachmentsCopy,this.itemIndex);
                      }
                 }
            }else{
               this.$toast("图片添加失败");
            }
            console.log(this.activityAttachmentsCopy);
            console.log(this.itemIndex);
        });
      }
    },
    reduceClick(src, index) {
      if (this.activityAttachmentsCopy && this.activityAttachmentsCopy.length) {
        this.activityAttachmentsCopy.splice(index, 1);
        this.$emit("changeImg",this.activityAttachmentsCopy,this.itemIndex);
      }
    }
  },
  watch:{
    activityAttachments(val) {
      this.initData();
    }
  },
  mounted() {
  }
};
</script>

<style scoped>

 /*附件*/
  .nearBy {
    font-size: 0.875rem;
    text-align: left;
    padding: 0.625rem 0.45rem;
    box-sizing: border-box;
  }
  .nearBy>div{
      padding-left: 0.55rem;
  }
  .iconRequried::before{
      position: absolute;
      left: 0.5rem;
      color: #f44;
      font-size: 0.875rem;
      content: '*';
  }
  .star {
    color: red;
    margin-right: 3px;
  }

  .nearByText {
    padding-bottom: 10px;
    box-sizing: border-box;
  }

  .imgBox {
    display: flex;
  }

  .icon-box{
    width:76px;
    height:76px;
    border:1px solid #ccc;
    font-size:35px;
    background: #f5f5f5;
    position: relative;
    margin:10px 5px 10px 0;
    color:#999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-box img {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .iconDel {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:#ccc;
    opacity: .7;
  }


</style>
