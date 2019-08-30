<template>
  <div>
   <!--附件展示-->
    <div class="imgListBox" v-if="activityAttachments && activityAttachments.length">
          <div class="imgItemBox" v-for="(item1,index1) in activityAttachments" :key="index1" @click="previewImg(item1,index1)">
            <div class="offnameImg">


              <img :src="item1" >
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["activityAttachments"],
  data() {
    return {

    };
  },
  created(){

  },
  methods: {
    // 图片预览
    previewImg(item1,index1){
        this.utils.imagePreview(this.activityAttachments,index1);
    }
  },
  watch:{
  },
  mounted() {
     console.log(333333);
     console.log(this.activityAttachments);
  }
};
</script>

<style scoped>
/* 附近上传 */
.imgListBox{
  overflow: hidden;
  display: flex;
}
.offnameImg {
  overflow: hidden;
}
.offnameImg img{
    display: block;
    width: 56px;
    height: 56px;
    float: left;
    margin-left: 5px;
}

</style>
