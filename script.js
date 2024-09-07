// Course Information
const weightings = {
    a1: 6.25,
    a2: 6.25,
    a3: 6.25,
    a4: 6.25,
    midterm: 25,
    final: 50,
};

// Autofill form fields from URL query string
new URL(window.location.href).searchParams.forEach((x, y) => (document.getElementById(y).value = x));

document.getElementById("calculate").addEventListener("click", function (e) {
    e.preventDefault();

    // Get form data
    const data = Object.fromEntries(new FormData(document.querySelector("form")));

    // Calculate completion percentage
    let completionPercentage = 0;
    for (const key in data) {
        if (data[key] !== "") {
            completionPercentage += weightings[key];
        }
    }

    // Calculate weight achieved
    let weightAchieved = 0;
    for (const key in data) {
        if (data[key] !== "") {
            weightAchieved += (parseFloat(data[key]) / 100) * weightings[key];
        }
    }

    // Calculate current grade
    const currentGrade = (weightAchieved / completionPercentage) * 100;

    // Calculate grade needed for 90% (A+)
    let gradeNeededAPlus = (100 * (90 - weightAchieved)) / (100 - completionPercentage);

    // Calculate grade needed for 85% (A)
    let gradeNeededA = (100 * (85 - weightAchieved)) / (100 - completionPercentage);

    // Calculate grade needed for 80% (A-)
    let gradeNeededAMinus = (100 * (80 - weightAchieved)) / (100 - completionPercentage);

    if (completionPercentage === 100) {
        gradeNeededAPlus = 0;
        gradeNeededA = 0;
        gradeNeededAMinus = 0;
    }

    // Fill in results
    document.getElementById("completed").innerText = completionPercentage.toFixed(2);
    document.getElementById("earned").innerText = weightAchieved.toFixed(2);
    document.getElementById("current").innerText = currentGrade.toFixed(2);
    document.getElementById("a-plus").innerText = gradeNeededAPlus.toFixed(2);
    document.getElementById("a").innerText = gradeNeededA.toFixed(2);
    document.getElementById("a-minus").innerText = gradeNeededAMinus.toFixed(2);

    // Copy form data to URL query string
    const url = new URL(window.location.href);
    for (const key in data) {
        if (data[key] === "") {
            url.searchParams.delete(key);
            continue;
        }
        url.searchParams.set(key, data[key]);
    }
    document.getElementById("copy-link").value = url.href;

    // Make results visible and scroll to bottom
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});
