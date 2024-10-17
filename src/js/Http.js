import axios from 'axios'

export default {
    sendGet: function (path, callback) {
        let tokenName = localStorage.getItem("tokenName"), tokenValue = localStorage.getItem("tokenValue");
        if (tokenName && tokenValue) {
            axios.defaults.headers.common[tokenName] = tokenValue;
        }
        document.getElementById("loading-indicator-id").style.display = "block";
        axios.get(import.meta.env.VITE_BASE_URL + path).then((response) => {
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
    },
    sendPost: function (path, data, callback) {
        let tokenName = localStorage.getItem("tokenName"), tokenValue = localStorage.getItem("tokenValue");
        if (tokenName && tokenValue) {
            axios.defaults.headers.common[tokenName] = tokenValue;
        }
        document.getElementById("loading-indicator-id").style.display = "block";
        axios.post(import.meta.env.VITE_BASE_URL + path, data).then((response) => {
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