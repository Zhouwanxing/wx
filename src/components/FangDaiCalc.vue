<template>
    <div class="fang-dai-page">
        <div class="toolbar">
            <PageBack/>
            <h2>贷款还款计算器</h2>
        </div>
        <div class="fang-dai-calc">
            <label for="loanAmount">贷款金额（元）：</label>
            <input type="number" inputmode="decimal" v-model="loanAmount" value="900000" step="10000">

            <label for="annualRate">年利率（%）：</label>
            <input type="number" inputmode="decimal" v-model="annualRate" value="2.6" step="0.01">

            <label for="years">贷款年限（年）：</label>
            <input type="number" inputmode="numeric" v-model="years" value="30">

            <div class="repay-type">
                <label class="radio-label"><input type="radio" v-model="repayType" value="equalPrincipalAndInterest" checked style="height: auto;"> 等额本息</label>
                <label class="radio-label"><input type="radio" v-model="repayType" value="equalPrincipal" style="height: auto;"> 等额本金</label>
            </div>

            <button @click="calculate">计算</button>

            <div class="result sticky-result" id="result" style="display: none;"></div>
            <div class="details" id="details" style="display: none;"></div>
        </div>
    </div>
</template>

<script>
import PageBack from "./common/PageBack.vue";

export default {
    name: "FangDaiCalc",
    components: { PageBack },
    data() {
        return {
            loanAmount: 900000,
            annualRate: 2.6,
            years: 30,
            repayType: "equalPrincipalAndInterest"
        }
    },
    mounted() {
        const self = this;

    },
    methods: {
        calculate: function () {
            const self = this;
            const loanAmount = self.loanAmount;
            const annualRate = self.annualRate;
            const years = this.years;
            const months = years * 12;
            const monthlyRate = annualRate / 100 / 12;

            const resultDiv = document.getElementById("result");
            const detailsDiv = document.getElementById("details");

            resultDiv.style.display = "block";
            detailsDiv.style.display = "none"; // 默认隐藏明细

            if (self.repayType === "equalPrincipalAndInterest") {
                // 等额本息
                const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months);
                const denominator = Math.pow(1 + monthlyRate, months) - 1;
                const monthlyPayment = numerator / denominator;
                const totalPayment = monthlyPayment * months;

                resultDiv.innerHTML = `
          <strong>还款方式：</strong>等额本息<br>
          <strong>每月还款：</strong>￥${monthlyPayment.toFixed(2)}<br>
          <strong>总还款金额：</strong>￥${totalPayment.toFixed(2)}
        `;
            } else if (self.repayType === "equalPrincipal") {
                // 等额本金
                const monthlyPrincipal = loanAmount / months;
                let totalPayment = 0;
                let tableRows = "";

                for (let i = 0; i < months; i++) {
                    const remainingPrincipal = loanAmount - monthlyPrincipal * i;
                    const interest = remainingPrincipal * monthlyRate;
                    const monthlyPayment = monthlyPrincipal + interest;
                    totalPayment += monthlyPayment;

                    tableRows += `<tr><td>${i + 1}</td><td>￥${monthlyPayment.toFixed(2)}</td></tr>`;
                }

                const firstMonthPayment = monthlyPrincipal + loanAmount * monthlyRate;

                resultDiv.innerHTML = `
          <strong>还款方式：</strong>等额本金<br>
          <strong>首月还款：</strong>￥${firstMonthPayment.toFixed(2)}<br>
          <strong>总还款金额：</strong>￥${totalPayment.toFixed(2)}
        `;

                detailsDiv.style.display = "block";
                detailsDiv.innerHTML = `
          <table>
            <thead>
              <tr><th>期数</th><th>当月还款</th></tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;
            }
        }
    }
}
</script>

<style scoped>
.fang-dai-page {
    min-height: 100%;
    padding: calc(8px + env(safe-area-inset-top, 0)) calc(12px + env(safe-area-inset-right, 0)) calc(16px + env(safe-area-inset-bottom, 0)) calc(12px + env(safe-area-inset-left, 0));
    background: #f5f5f5;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.toolbar h2 {
    margin: 0;
    font-size: 18px;
}

.fang-dai-calc {
    background-color: #fff;
    padding: 16px;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fang-dai-calc label {
    display: block;
    margin-top: 12px;
}

.fang-dai-calc input[type="number"] {
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    margin-top: 5px;
    box-sizing: border-box;
    font-size: 16px;
}

.fang-dai-calc .repay-type {
    margin-top: 12px;
    display: flex;
    gap: 12px;
}

.radio-label {
    flex: 1;
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    margin-top: 0 !important;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
}

.fang-dai-calc button {
    width: 100%;
    margin-top: 20px;
    min-height: 48px;
    padding: 12px;
    font-size: 16px;
    background-color: #0078d4;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.fang-dai-calc .result, .fang-dai-calc .details {
    margin-top: 20px;
    background: #e3f2fd;
    padding: 15px;
    border-radius: 8px;
}

.sticky-result {
    position: sticky;
    top: 0;
    z-index: 2;
}

.fang-dai-calc .details {
    max-height: 50vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.fang-dai-calc table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
}

.fang-dai-calc th, .fang-dai-calc td {
    border: 1px solid #ccc;
    padding: 6px 10px;
    text-align: right;
}

.fang-dai-calc th {
    background-color: #bbdefb;
}
</style>