import axios from "axios";
import { Toast, ImagePreview } from "vant";
import Vue from 'vue'
import router from '@/router/index.js'
import webApp from '@/webApp/index'


export default{
    isInApp() {
        if (typeof Elf.AppCallWeb != "undefined") {
        return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
        }
    },
    ajax(options,isFlag){
        if (!isFlag) {
            Toast.loading({
                mask: true,
                message: '加载中...'
            });
        }
        options.data = options.data || {};
        axios(options).then(result => {
            Toast.clear();
            const res = result.data;
            if(res.code == 0){
                options.success && options.success(res);
            }else if(res.code == 81){
                Toast("登录失效，请重新登录");
                setTimeout(()=>{
                    if(this.isInApp()){
                      if(this.$store.state.urlObj.source){
                        router.push({ name: "login"});
                      }
                        webApp.WebCallApp("UserLogout", {}, (res) => {});
                     }else{
                        router.push({ name: "login"});
                     }
                },200)
            }else{
                options.success(res);
            }

          }).catch(
            error => {
                Toast.clear();
                if (options.catch) {
                    options.catch && options.catch(error);
                } else {
                    // Toast(error.message);
                }
            }
          );
    },
    formatDate(time, type, format) {
        /**
         * time 时间
         * type 类型（默认'yyyy-MM-dd HH:mm'）
         */
        if (!time) return time;
        var date = "";
        if (format) {
            date = time;
        } else {
            if (typeof time !== "number") {
                time = time.replace(/-/g, "/");
            }
            date = new Date(time);
        }
        type = type ? type : "yyyy-MM-dd HH:mm";
        var seperator1 = "-";
        var seperator2 = ":";
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        month = month.length === 1 ? ("0" + month) : month;
        day = day.length === 1 ? ("0" + day) : day;
        hours = hours.length === 1 ? ("0" + hours) : hours;
        minutes = minutes.length === 1 ? ("0" + minutes) : minutes;
        seconds = seconds.length === 1 ? ("0" + seconds) : seconds;
        if (type === "yyyy-MM-dd HH:mm:ss") {
            return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + seperator2 + minutes + seperator2 + seconds;
        } else if (type === "yyyy-MM-dd HH:mm") {
            return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours;
        } else if (type === "yyyy-MM-dd") {
            return date.getFullYear() + seperator1 + month + seperator1 + day;
        } else if (type === "yyyy-MM") {
            return date.getFullYear() + seperator1 + month;
        } else if (type === "HH:mm") {
            return hours + seperator2 + minutes;
        }
    },
    /*弹窗日期*/
    pickerType(type, value) {
        switch (type) {
            case "year":
                return `${value}年`;
            case "month":
                return `${value}月`;
            case "day":
                return `${value}日`;
            case "hour":
                return value;
            case "minute":
                return value;
        }
        return value;
    },

    imagePreview(images, position, timer) {
        /**
         * 显示附件、图片进行预览，文件进行下载
         * @param images {array}
         * @param position
         * @param timer
         */
        const instance = ImagePreview({
            images,
            asyncClose: !!timer,
            startPosition: typeof position === "number" ? position : 0
        });

        if (timer) {
            setTimeout(() => {
                instance.close();
            }, timer);
        }
    },
    checkSuffix(fileName) {
        /**
         * 检查是不是图片
         * @param fileName
         * @returns {boolean}
         */
        const imgSuffixs = ["bmp", "jpg", "jpeg", "png", "gif"];
        const index = fileName.lastIndexOf(".");
        const suffix = fileName.substr(index + 1).toLowerCase();

        if (!suffix) {
            return false;
        }
        return imgSuffixs.includes(suffix);
    },
}
