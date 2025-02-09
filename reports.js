document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reportModal");
    const reportBtn = document.getElementById("reportBtn");
    const closeBtn = document.querySelector(".close");
    const submitBtn = document.getElementById("submitReport");

    reportBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";

    submitBtn.onclick = () => {
        const reportText = document.getElementById("reportText").value.trim();
        if (!reportText) return alert("Report cannot be empty!");


        const newReport = {
            timestamp: new Date().toLocaleString(),
            description: reportText,
            status: "Open"
        };
        //saved in localstorage for now XD
        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push(newReport);
        localStorage.setItem("reports", JSON.stringify(reports));

        alert("Report submitted!");
        modal.style.display = "none";
        document.getElementById("reportText").value = "";
    };
});
