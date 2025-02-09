```shell
mkdir reports_app && cd reports_app
npm init -y
npm install express cors body-parser fs
```


# server.js
```javascript
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const FILE_PATH = "reports.json";

app.use(cors());
app.use(bodyParser.json());

//reading
const readReports = () => {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
};

//saving
const saveReports = (reports) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(reports, null, 2));
};

//getting reports
app.get("/reports", (req, res) => {
    res.json(readReports());
});

// Adding a new report
app.post("/reports", (req, res) => {
    const reports = readReports();
    const newReport = {
        timestamp: new Date().toLocaleString(),
        description: req.body.description,
        status: "Open"
    };
    reports.push(newReport);
    saveReports(reports);
    res.json({ message: "Report saved", report: newReport });
});

// Closing a report
app.put("/reports/:index", (req, res) => {
    const reports = readReports();
    const index = req.params.index;

    if (reports[index]) {
        reports[index].status = "Closed";
        saveReports(reports);
        res.json({ message: "Report closed", report: reports[index] });
    } else {
        res.status(404).json({ message: "Report not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

# Run the server
```shell
node server.js
```

# report.js
```javascript
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reportModal");
    const reportBtn = document.getElementById("reportBtn");
    const closeBtn = document.querySelector(".close");
    const submitBtn = document.getElementById("submitReport");

    reportBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";

    submitBtn.onclick = async () => {
        const reportText = document.getElementById("reportText").value.trim();
        if (!reportText) return alert("Report cannot be empty!");

        const response = await fetch("http://localhost:3000/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: reportText })
        });

        const data = await response.json();
        alert(data.message);
        modal.style.display = "none";
        document.getElementById("reportText").value = "";
    };
});
```

# reportPageScript.js
```javascript
document.addEventListener("DOMContentLoaded", async () => {
    const reportsContainer = document.getElementById("reportsContainer");

    async function loadReports() {
        reportsContainer.innerHTML = "";
        const response = await fetch("http://localhost:3000/reports");
        const reports = await response.json();

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

    window.closeReport = async (index) => {
        await fetch(`http://localhost:3000/reports/${index}`, { method: "PUT" });
        loadReports();
    };

    loadReports();
});
```

# Access the app

http://localhost:3000/reports
