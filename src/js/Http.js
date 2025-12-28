import axios from 'axios'

export default {
    currentHost: "",
    sendGet: function (path, callback, isNotShowLoading) {
        let tokenName = localStorage.getItem("tokenName"), tokenValue = localStorage.getItem("tokenValue");
        /*if (tokenName && tokenValue) {
            axios.defaults.headers.common[tokenName] = tokenValue;
        }*/
        if (!isNotShowLoading) {
            document.getElementById("loading-indicator-id").style.display = "block";
        }
        axios.get((this.currentHost || import.meta.env.VITE_BASE_URL) + path, {
            timeout: 5000,
            headers: {[tokenName]: tokenValue}
        }).then((response) => {
            if (!isNotShowLoading) {
                document.getElementById("loading-indicator-id").style.display = "none";
            }
            let data = response.data || {};
            if (data.code === 401) {
                window.location.href = "./"
                return;
            }
            callback(data);
        }).catch((e) => {
            console.error(e);
            if (!isNotShowLoading) {
                document.getElementById("loading-indicator-id").style.display = "none";
            }
            callback({code: 501});
        });
    },
    sendPost: function (path, data, callback, timeout = 5000) {
        let tokenName = localStorage.getItem("tokenName"), tokenValue = localStorage.getItem("tokenValue");
        /*if (tokenName && tokenValue) {
            axios.defaults.headers.common[tokenName] = tokenValue;
        }*/
        document.getElementById("loading-indicator-id").style.display = "block";
        axios.post((this.currentHost || import.meta.env.VITE_BASE_URL) + path, data, {
            timeout: timeout,
            headers: {[tokenName]: tokenValue}
        }).then((response) => {
            document.getElementById("loading-indicator-id").style.display = "none";
            let data = response.data || {};
            if (data.code === 401) {
                window.location.href = "./"
                return;
            }
            callback(data);
        }).catch((e) => {
            console.error(e);
            document.getElementById("loading-indicator-id").style.display = "none";
            callback({code: 501});
        });
    }
}