document.addEventListener("DOMContentLoaded", () => {
    const reportsContainer = document.getElementById("reportsContainer");

    function loadReports() {
        reportsContainer.innerHTML = "";
        let reports = JSON.parse(localStorage.getItem("reports")) || [];

        reports.forEach((report, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${report.timestamp}</td>
                <td>${report.description}</td>
                <td>${report.status}</td>
                <td>
                    ${report.status === "Open" ? `<button onclick="closeReport(${index})">Close</button>` : "Closed"}
                </td>
            `;

            reportsContainer.appendChild(row);
        });
    }

    window.closeReport = (index) => {
        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports[index].status = "Closed";
        localStorage.setItem("reports", JSON.stringify(reports));
        loadReports();
    };

    loadReports();
});
