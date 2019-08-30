<template>
  <div class="wrapper">
      <van-nav-bar
        title="轮转计划详情"
        left-text="返回"
        right-text="完成情况"
        left-arrow
        @click-left="goPage()"
        @click-right="lookDeptDetail()"
      />
    <div class="addRoleBox">
      <van-cell-group>
        <van-field v-model="itemData.departmentName" label="轮转科室" readonly="readonly" input-align="right"></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="isCooper"
          label="是否在协同单位轮转"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="itemData.startTime"
          label="轮转计划开始时间"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="itemData.endTime"
          label="轮转计划结束时间"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
    </div>
    <div v-if="itemData.rotationScheduleTeacherDtoList && itemData.rotationScheduleTeacherDtoList.length">
        <div class="teacherItem" v-for="(item,index) in itemData.rotationScheduleTeacherDtoList" :key="index">
          <van-cell-group>
            <van-field v-model="item.teacherName" label="指导医师" readonly="readonly" input-align="right"></van-field>
          </van-cell-group>
          <van-cell-group>
            <van-field
              v-model="item.teacherPhone"
              label="指导医师手机"
              readonly="readonly"
              input-align="right"
            ></van-field>
          </van-cell-group>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "relationDetail",
  data() {
    return {
      itemData: {}
    };
  },
  computed:{
    isCooper(){
      return this.itemData.cooperationFlag == 1 ? "是" : "否";
    }
  },
  created(){
    this.itemData = this.Global.currentItem.listScheItem;
    console.log(this.itemData);

  },
  methods: {
    goPage() {
      this.$router.push( {name:"rotation"} );
    },
    lookDeptDetail() {
      this.$store.state.deaseListPagePre = 2;
      this.$router.push({name:'deaseOperList'});
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*头部按钮字体*/
.wrapper>>> .van-nav-bar__right .van-nav-bar__text{
  color:#fff !important;
  font-size:12px;
  background: #A083E0;
  line-height: 26px;
  border-radius: .5rem;
  margin-right: 1px;
}
.wrapper>>> .van-nav-bar__text:active{
  color:#fff !important;
  font-size:12px;
  background: #A083E0;
}
.wrapper>>> .van-field__control--right{
  text-overflow:ellipsis
}
.addRoleBox {
  margin-top: 15px;
}
.teacherItem {
  margin-top: 15px;
}
.detOptionbtns .van-button {
  width: 165px;
}
.labelTab {
  padding: 10px 15px;
  font-size: 14px;
}
.labelTab /deep/ .van-tabs__nav {
  margin-right: 0;
}
.wrapper /deep/ .van-field__label {
  width: 150px;
}
.wrapper /deep/ .van-cell {
  text-align: left;
}
.wrapper /deep/ .van-cell span {
  font-size: 14px;
}
.wrapper /deep/ .van-hairline--surround {
  height: 0;
}
.wrapper /deep/.van-password-input {
  margin: 0 auto;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f5f5f5;
}
.tabs_card {
  width: 100%;
  height: 80px;
  margin-top: 15px;
}
.tab_content {
  width: 100%;
  margin-top: 15px;
}
.promise {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  font-size: 12px;
  color: #999999;
}
.defaultNone {
  display: block;
}
.add {
  display: flex;
  float: right;
  align-items: flex-end;
  font-size: 12px;
  text-align: right;
  margin-right: 24px;
  padding-top: 10px;
  box-sizing: border-box;
}
.add .add-icon {
  font-size: 18px;
}
.add span {
  margin-left: 5px;
}
</style>
