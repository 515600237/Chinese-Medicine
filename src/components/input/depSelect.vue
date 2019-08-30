<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="showSelectJson.departmentName"
        is-link
        placeholder="请选择"
        label="科室"
        readonly="readonly"
        input-align="right"
        @click="changeShow()"
      ></van-field>
      <van-popup v-model="selectDepShow" position="bottom" close-on-click-overlay :overlay="true">
        <van-picker
          show-toolbar
          title="选择科室"
           value-key="name"
          :default-index="activeIndex"
          :columns="derpartList"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
    </van-cell-group>
  </div>
</template>

<script>
import {departListMixin} from "@/common/js/mixin";
export default {
  props: ["showJson","dataString"],
  mixins:[departListMixin],
  data() {
    return {
      showSelectJson: this.showJson,
      selectDepShow: false
    };
  },
  computed:{
      activeIndex(){
         let itemIndex = this.derpartList.findIndex((item,index)=>{
                return item.id == this.showJson.departmentId;
         })
         if(itemIndex == -1){
           itemIndex = 0;
         }
         return itemIndex;
      }
  },
  methods: {
    changeShow(){
      this.selectDepShow =! this.selectDepShow
      this.$emit("onClickts", this.showJson);
    },
    onCancel() {
      this.selectDepShow = false;
    },
    onConfirm(value,index) {
     
      this.selectDepShow = false;
      value.dataString =this.dataString;
      this.$emit("onConfirm", value);
    },
  },
  watch:{
    showJson(newValue,oldValue){
      this.showSelectJson = newValue;
    }
  },
  mounted() {
  }
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

