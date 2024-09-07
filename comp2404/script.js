// Course Information
let weightings = {
    t1: 1.25,
    t2: 1.25,
    t3: 1.25,
    t4: 1.25,
    t5: 1.25,
    t6: 1.25,
    t7: 1.25,
    t8: 1.25,
    t9: 1.25,
    t10: 1.25,
    a1: 9,
    a2: 9,
    a3: 9,
    a4: 9,
    a5: 9,
    midterm: 15,
    final: 35,
};

// Autofill form fields from URL query string
new URL(window.location.href).searchParams.forEach((x, y) => (document.getElementById(y).value = x));

document.getElementById("calculate").addEventListener("click", function (e) {
    e.preventDefault();

    // Get form data
    let data = Object.fromEntries(new FormData(document.querySelector("form")));

    // Remove all entries with -1
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== "-1"));

    // If more than 8 tutorials exist, only keep the top 8
    let tutorialKeys = Object.keys(data).filter((key) => key.startsWith("t"));
    let keysToRemove = [];
    if (tutorialKeys.length > 8) {
        tutorialKeys = tutorialKeys.sort((a, b) => parseFloat(data[b]) - parseFloat(data[a]));
        keysToRemove = tutorialKeys.slice(8);
    }
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => !keysToRemove.includes(key)));

    // Set the weighting of the lowest assignment to 4
    const assignmentKeys = Object.keys(data).filter((key) => key.startsWith("a"));
    if (assignmentKeys.length > 0) {
        const sortedKeys = assignmentKeys.sort((a, b) => parseFloat(data[b]) - parseFloat(data[a]));
        weightings[sortedKeys[sortedKeys.length - 1]] = 4;
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
