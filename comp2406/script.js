// Course Information
let weightings = {
    t1: 20 / 9,
    t2: 20 / 9,
    t3: 20 / 9,
    t4: 20 / 9,
    t5: 20 / 9,
    t6: 20 / 9,
    t7: 20 / 9,
    t8: 20 / 9,
    t9: 20 / 9,
    a1: 4,
    a2: 4,
    a3: 4,
    a4: 4,
    q: 10,
    midterm: 24,
    final: 30,
};

// Autofill form fields from URL query string
new URL(window.location.href).searchParams.forEach((x, y) => (document.getElementById(y).value = x));

document.getElementById("calculate").addEventListener("click", function (e) {
    e.preventDefault();

    // Get form data
    let data = Object.fromEntries(new FormData(document.querySelector("form")));

    // Check if midterm grade is lower than final
    if (data.midterm !== "" && data.final !== "" && parseFloat(data.midterm) < parseFloat(data.final)) {
        alert("Your midterm grade will be replaced by your final grade.");
        weightings.final += weightings.midterm;
        weightings.midterm = 0;
    }

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

    // If completion percentage is 100%, set all grade needed to 0
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
