<template>
            <div class="wrapper disFlex">
                <van-nav-bar
                        title="通知消息"
                        left-text="返回"
                        left-arrow
                        @click-left="onClickLeft"
                        class="newsHeader greenLg"
                />
                <div class="section disFlex">
                    <div class="tabbar">
                        <van-tabs type="card" class="tabs_card" v-model="activeTab" @change="changeTab">
                            <van-tab title="未读" class="tab_content"></van-tab>
                            <van-tab title="已读" class="tab_content"></van-tab>
                        </van-tabs>
                    </div>
                    <div class="newsListBox" v-show="activeTab == 0">
                        <div class="newsItemBox disFlex van-hairline--bottom" v-for="(item,index) in unReadList" :key="index">
                            <div class="newsItemText text-left van-hairline--bottom">
                                <p>{{item.content}}</p>
                                <p>{{item.pushTime}}</p>
                            </div>
                        </div>
                    </div>

                    <div class="newsListBox" v-show="activeTab == 1">
                       <div class="newsItemBox disFlex van-hairline--bottom" v-for="(item,index) in alreadyReadList" :key="index">
                            <div class="newsItemText text-left van-hairline--bottom">
                                <p>{{item.content}}</p>
                                <p>{{item.pushTime}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
    export default {
        name: "newsList",
        data(){
            return {
                activeTab: 0,
                contentId:0,
                content:{},
                contentHtml:"",
                userName:"",
                author:"",
                title:"",
                currentDate:'',
                unReadList: [],
                alreadyReadList: []
            }
        },
        methods:{
            changeTab(index,title){
                if(index == 0){
                    this.getUnReadList();
                }else{
                    this.getReadList();
                }
            },
            //获取未读消息列表
            getUnReadList(){
                this.getNewsList(0);
            },
            //获取已读消息列表
            getReadList(){
                this.getNewsList(1);
            },
            //0 未读，1 已读
            getNewsList(state){
                const url = this.api.getLogList;
                const postJson = {
                    pageIndex: 1,
                    pageSize: 10,
                    status: state
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        console.log(res);
                        if(res.code == 0){
                           if(state == 0){
                             this.unReadList = res.data.result;
                           }else{
                             this.alreadyReadList = res.data.result; 
                           }
                        }
                    }
                });
            },
            batchReadMsg(){
                let promise =new Promise((resolve,reject)=>{
                    const url = this.api.batchReadMsg;
                    const postJson = {
                    };
                    this.utils.ajax({
                        url: url,
                        method: "POST",
                        data: postJson,
                        success: res => {
                            console.log(res);
                            if(res.code == 0){
                                resolve();
                            }else{
                                reject();
                            }
                        }
                    });
                })
                return promise;
                
            },
            onClickLeft(){
                this.batchReadMsg().then((res)=>{
                    this.$router.back(-1); 
                }).catch(error=>{
                    this.$router.back(-1); 
                })
            },
        },
        computed:{

        },
        created(){
           this.getUnReadList();

        },
        mounted(){
            this.contentId = this.$route.query.contentId;
        }
    }
</script>

<style scoped>
    .wrapper /deep/ .van-nav-bar__text{
        color:#1DA29A;
    }
    .wrapper /deep/ .van-icon-arrow-left{
        color:#1DA29A;
    }

        .wrapper{
            width:100%;
            height:100%;
            position: absolute;
            left:0;
            right:0;
            bottom:0;
            top:0;
            background:#fff;
            flex-direction: column;

        }
        .newsHeader{
            position: absolute;
            left:0;
            top:0;
            right:0;
            bottom:0;
        }
        .section{
            min-width:337px;
            height:100%;
            position: absolute;
            top:2.875rem;
            left:0;
            bottom:0;
            right:0;
            flex-direction: column;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            flex:1;
            margin:0 19px;

        }
        /* 消息列表 */
        .newsListBox{
            position: absolute;
            top: 30px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            padding-top:10px;
        }
        .newsItemBox{
            height: 56px;
            padding-left: 5px;
            align-items: center;
        }
        .newsItemBox .van-icon{
            font-size: 28px;
        }
        .newsItemText{
            padding-left: 10px;
            font-size: 14px;
        }
        .newsContent{
            text-indent: -6px;
        }
</style>