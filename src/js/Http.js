import axios from 'axios'

export default {
    sendGet: function (path, callback) {
        document.getElementById("loading-indicator-id").style.display = "block";
        axios.get(import.meta.env.VITE_BASE_URL + path).then((response) => {
            document.getElementById("loading-indicator-id").style.display = "none";
            callback(response.data || {});
        }).catch((e) => {
            console.error(e);
            document.getElementById("loading-indicator-id").style.display = "none";
            callback({error: true});
        });
    },
    sendPost: function (path, data, callback) {
        document.getElementById("loading-indicator-id").style.display = "block";
        axios.post(import.meta.env.VITE_BASE_URL + path, data).then((response) => {
            document.getElementById("loading-indicator-id").style.display = "none";
            callback(response.data || {});
        }).catch((err) => {
            console.error(e);
            document.getElementById("loading-indicator-id").style.display = "none";
            callback({error: true});
        });
    }
}