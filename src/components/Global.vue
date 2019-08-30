<script>

// userType 3 指导医师 4 住院医师  
const userType= 3;
const userId =1434;
const majorId = 889;
const orgId = 94;
// 轮转计划id
const scheduleId = 0;

const userInfo ={
    userId:1434,
    teacherId:1434,
    departmentId: null,
    departmentName:"",
    fullName: "张三",
    orgId:94,
    userType: 4,
    standardDepartmentId: null, //标准科室id,指导医师专用
};
const token="";

export default {
    userType,
    userId,
    orgId,
    userInfo,
    majorId,
    token
}
</script>

