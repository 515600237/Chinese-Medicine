
 const activityType= 
  [
    { id: 1,name: "病例讨论"},
    { id: 2,name: "教学查房"},
    { id: 3,name: "培训讲座"},
    { id: 4,name: "技能训练"},
    { id: 5,name: "模拟教学"},
    { id: 6,name: "院外实践"},
    { id: 99,name: "其他"},
  ];
  
  const getActivityType=   
    {  1: "病例讨论",2: "教学查房",3: "培训讲座",4: "技能训练",5: "模拟教学",6: "院外实践",99: "其他"};

const activityLevel= 
    [
    { id: 1,name: "院级以上"},
    { id: 2,name: "院级"},
    { id: 3,name: "专业基地"},
    { id: 4,name: "科室"},
];
const activityDuration =[
  {id: 0.5, name: '0.5小时'},
  {id: 1, name: '1小时'},
  {id: 1.5, name: "1.5小时"},
  {id: 2, name: "2小时"},
  {id: 2.5, name: "2.5小时"},
  {id: 3, name: "3小时"},
  {id: 3.5, name: "3.5小时"},
  {id:4,name:"4小时"},
  {id:4.5,name:"4.5小时"},
  {id:5,name:"5小时"},
  {id:5.5,name:'5.5小时'},
  {id:6,name:"6小时"},
  {id:6.5,name:'6.5小时'},
  {id:7,name:'7小时'},
  {id:7.5,name:'7.5小时'},
  {id:8,name:'8小时'},
];

export default{
    activityType,
    getActivityType,
    activityLevel,
    activityDuration
}



