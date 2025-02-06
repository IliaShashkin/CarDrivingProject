document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reportModal");
    const reportBtn = document.getElementById("reportBtn");
    const closeBtn = document.querySelector(".close");
    const submitBtn = document.getElementById("submitReport");

    reportBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";

    submitBtn.onclick = async () => {
        const reportText = document.getElementById("reportText").value.trim();
        if (!reportText) {
            alert("Please enter a report!");
            return;
        }

        try {
            await fetch("/submit-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: reportText })
            });

            alert("Report submitted!");
            modal.style.display = "none";
            document.getElementById("reportText").value = "";
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };
});
