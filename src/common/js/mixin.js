
// 获取科室，病种，技能，手术
export const departBaseInfoMixin = {
    data() {
        return {
            // derpartList: [],
            // diseaseListMap: {},
            // skillListMap: {},
            // operationListMap: {}
        }
    },
    created() {
    },
    mounted() {

    },
    activated() {
    },
    methods: {
        // 获取基础信息

       getMedicalBaseInfo() {
            let result = new Promise((resolve,reject) =>{
                const url = this.api.departAndMedicalBaseInfo;
                let postJson = {};
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: (res) => {
                        if(res.code == 0){
                            resolve(res);
                        }else{
                            this.$toast(res.msg);
                        }
                    },
                    error: (error) =>{
                        console.log(error);
                    } 
                });
            })
            return result;
        },

    }
};

// 获取科室
export const departListMixin = {
    data() {
        return {
            derpartList: [],
            diseaseListMap: {},
            skillListMap: {},
            operationListMap: {}
        }
    },
    created() {
        this.getMedicalBaseInfo();
    },
    mounted() {
    },
    activated() {
    },
    watch: {
        playlist(newVal) {
        }
    },
    methods: {
        // 获取基础信息
        getMedicalBaseInfo() {
            const url = this.api.BaseInfo;
            this.utils.ajax({
                url: url,
                method: "POST",
                success: (res) => {
                    console.log(res);
                    if(res.code == 0){
                        this.derpartList = res.data;
                   }
                }
            });
        },
    }
};