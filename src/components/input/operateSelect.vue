<template>
  <div>
      <van-popup v-model="selectDepShow" position="bottom" close-on-click-overlay :overlay="true">
        <van-picker
          show-toolbar
          title="选择手术"
           value-key="skillName"
          :default-index="activeIndex"
          :columns="deaseList"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script>
export default {
  props: ["showJson","departmentId"],
  data() {
    return {
      showSelectJson: this.showJson,
      selectDepShow: false,
      operationListMap:{}
    };
  },
  created(){
    const url = this.api.departAndMedicalBaseInfo;
              console.log(url);
              let postJson = {
                  majorId: this.Global.majorId,
                  orgId: 1,
              };
              console.log(postJson);

              this.utils.ajax({
                  url: url,
                  method: "POST",
                  data: postJson,
                  success: (res) => {
                      console.log(res);
                      if(res.code == 0){
                          this.operationListMap = res.data.departIdAndSkillListMap;
                      }
                  }
              });
  },
  computed:{
      deaseList(){
        console.log(this.operationListMap);
        console.log(this.operationListMap[this.departmentId]);
         return this.operationListMap[this.departmentId] || [];
      },
      activeIndex(){
         let itemIndex = this.deaseList.findIndex((item,index)=>{
                return item.id == this.showJson.operationId;
         })
         if(itemIndex == -1){
           itemIndex = 0;
         }
         return itemIndex;
      }
  },
  methods: {
    showDept(){
      this.selectDepShow = true;
    },
    onCancel() {
      this.selectDepShow = false;
    },
    onConfirm(value,index) {
      this.selectDepShow = false;
      this.$emit("onConfirm", value);
    },
  },
  watch:{
    showJson(newValue,oldValue){
      this.showSelectJson = newValue;
    }
  },
  mounted() {}
};
</script>

<style scoped>
/* 年度选择弹窗 */
.yearPops {
  top: 84px;
}
.overYearbg {
  opacity: 0.5;
}
.icon_more {
  border-width: 8px;
  margin-left: 10px;
  margin-top: 5px;
}
.yearSeList {
  text-align: left;
  text-indent: 20px;
}
.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}
</style>

