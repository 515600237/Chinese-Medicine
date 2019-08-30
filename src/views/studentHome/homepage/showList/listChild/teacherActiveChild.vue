<template>
  <div class="teaching-audit">

    <div v-if="activeList" class="activeListBox">
      <div class="teaching-content" style="overflow: hidden;"
           v-for="(item,index) in activeList"
           :key="index"
      >
        <!--提交时间-->
        <div class="submit-time">
          <div class="submit-time-all time-second" style="position: relative;">
            <ul class="submit-time-left">
              <van-icon name="todo-list-o" size="16"/>
              <li>提交时间：</li>
              <li>{{item.createTime}}</li>
              <li>|</li>
            </ul>
            <ol class="time-second-right">
              <li class="audit-status">
                <span v-if="item.auditState == 0" :style="{color:'orange'}">【待审核】</span>
                <span v-if="item.auditState == 1" :style="{color:'#2ECC71'}">【已通过】</span>
                <span v-if="item.auditState == 2">【未通过】</span></li>
              <li class="modifyBtn_li">
                <van-button
                  v-if="item.auditState == 0"
                  @click.native="goModifyPage(item)"
                  class="btnSave">
                  修改
                </van-button>
              </li>
              <!-- 是否属实 -->
              <li class="nottrue" v-if="item.auditState ==2"></li>
            </ol>
          </div>
        </div>
        <!--列表页-->
        <div class="contentBox" v-if="item.data">
          <ul>
            <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0"
            >
              <span class="lable-left">审核人:</span>
              <span class="lable-right">{{item.data.auditName}}</span>
            </li>

            <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0"
            >
              <span class="lable-left">审核时间:</span>
              <span class="lable-right">{{item.data.auditTime}}</span>
            </li>

            <li class="audit-list" :class="item.auditState ==2? 'nottrue-li': ''"
                v-if="item.auditState !=0 && item.data.auditOpinion"
            >
              <span class="lable-left">审核意见:</span>
              <span class="lable-right">{{item.data.auditOpinion}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">科室:</span>
              <span class="lable-right">{{Global.currentItem.departmentName}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">日期:</span>
              <span class="lable-right">{{item.data.activityDate}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">活动形式:</span>
              <span class="lable-right">{{item.data.activityType | activityTypeFilter}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">教学层次:</span>
              <span class="lable-right ">{{item.data.activityLevel | activityLevelFilter}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">活动内容:</span>
              <span class="lable-right ">{{item.data.activityContent}}</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">学时:</span>
              <span class="lable-right ">{{item.data.activityDuration}} 小时</span>
            </li>
            <li class="audit-list">
              <span class="lable-left">主讲人/组织人:</span>
              <span class="lable-right ">{{item.data.keynoteSpeaker}}</span>
            </li>
            <li class="audit-list last-audit">
              <div class="lable-left offtit">附件:</div>
              <div class="lable-right offname">
                <!-- 附件显示组件 -->
                <imgShowList :activityAttachments="item.data.activityAttachments" v-if="item.data.activityAttachments"></imgShowList>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 图片展示子组件
  import imgShowList from "@/components/uploadFile/imgShowList"

export default {
  name: "teacherActiveChild",
  props: {
    resData:Array,
  },
  components:{
    imgShowList
  },
  data() {
    return {
      activeList:this.resData,
      departmentName: this.Global.userInfo.departmentName,
      activityAttachments:["https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg","https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg","https://zhongyiguocheng.oss-cn-beijing.aliyuncs.com/20190628_081609_v2-90a4a7c2184c7e9ed00c20c42e3c5f68.jpg"],
    };
  },
  created() {

  },
  methods:{
    goModifyPage(item){
      this.$router.push({ name:"teachingActiveModify"});
      //store中设置教学活动id
      let modifyId = item.id;
      this.$store.dispatch("setNewTeachActiveId",modifyId);

    },
  },
    watch:{
      resData(newValue, oldValue){
        this.activeList = newValue;
      }
    }
};
</script>

<style scoped>
.red {
  color: red;
}
.teaching-audit {
  position: relative;
  padding: 0 0.9375rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/*时间栏*/
.submit-time {
  display: flex;
  margin-top: 12px;
  background: #666;
  opacity: 1;
  border-top-left-radius: 5px;
  border-top-right-radius:5px;
}
.submit-time-all {
  width: 100%;
  font-size: 12px;
  display: flex;
  padding: 5px 0;
  box-sizing: border-box;
}
.submit-time-left {
  width: 60%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
}
.time-second-right{
  display: flex;
  width:40%;
}
.audit-status{
  max-width:50%;
  line-height: 30px;
  color:#fff;
  text-align: left;

}
.modifyBtn_li{
  max-width:50%;
  margin:0 auto;
}
.modifyBtn_li button{
  min-width:45px;
  height: 30px;
  line-height: 28px;
}
/*表格列表*/
.contentBox {
  width: 100%;
  min-height: 350px;
  background: #fff;
}
.audit-list {
  width:100%;
  display: table;
  font-size: 12px;
  border: 1px solid #ccc;
  border-bottom:none;
}
.lable-left {
  display: table-cell;
  width: 40%;
  height: 36px;
  text-align: left;
  padding-left: 15px;
  box-sizing: border-box;
  vertical-align:middle ;
}
.lable-right {
  display: table-cell;
  vertical-align:middle ;
  width: 60%;
  text-align: left;
  min-height: 36px;
  border-left: 1px solid #ccc;
  padding-left: 15px;
  padding-right:.2rem;
  box-sizing: border-box;
  word-break: break-all;
}


.offtit {
  height: 90px;
  line-height: 90px;
}
.audit-list:last-of-type{
  border-bottom: 1px solid #ccc;
}
.offname{
  overflow: hidden;
}
.nottrue {
  line-height: 1.875rem;
  font-size: 14px;
  text-align: left;
  height: 1.875rem;
  text-indent: -3px;
}
.nottrue::before {
  content: "不属实";
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 40px 40px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  position: absolute;
  transform: rotate(-315deg) scale(0.8);
  right: -2.695rem;
  top: 8px;
  width: 60px;
}
/* 不属实审核信息背景色 */
.nottrue-li {
  background-color: #fff5e6;
}
.nottrue-li .lable-right{
  color: red;
}
</style>
