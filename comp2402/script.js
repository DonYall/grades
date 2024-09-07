// Course Information
const weightings = {
    q1: 15 / 9,
    q2: 15 / 9,
    q3: 15 / 9,
    q4: 15 / 9,
    q5: 15 / 9,
    q6: 15 / 9,
    q7: 15 / 9,
    q8: 15 / 9,
    q9: 15 / 9,
    q10: 15 / 9,
    q11: 15 / 9,
    a1: 10,
    a2: 10,
    a3: 10,
    a4: 10,
    a5: 10,
    bonus: 100,
    midterm: 15,
    final: 30,
};

// Autofill form fields from URL query string
new URL(window.location.href).searchParams.forEach((x, y) => (document.getElementById(y).value = x));

document.getElementById("calculate").addEventListener("click", function (e) {
    e.preventDefault();

    // Get form data
    const formData = Object.fromEntries(new FormData(document.querySelector("form")));
    let data = Object.fromEntries(Object.entries(formData).filter(([key, value]) => key !== "bonus"));
    const bonusAchieved = parseFloat(formData.bonus) || 0;

    // Remove all entries with -1
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== "-1"));

    // If more than 9 quizzes exist, only keep the top 9
    let quizKeys = Object.keys(data).filter((key) => key.startsWith("q"));
    let keysToRemove = [];
    if (quizKeys.length > 9) {
        quizKeys = quizKeys.sort((a, b) => parseFloat(data[b]) - parseFloat(data[a]));
        keysToRemove = quizKeys.slice(9);
    }
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => !keysToRemove.includes(key)));

    // If more than 4 assignments exist, only keep the top 4
    const assignmentKeys = Object.keys(data).filter((key) => key.startsWith("a"));
    if (assignmentKeys.length > 4) {
        const sortedKeys = assignmentKeys.sort((a, b) => parseFloat(data[b]) - parseFloat(data[a]));
        keysToRemove = sortedKeys.slice(4);
    }
    data = Object.fromEntries(Object.entries(data).filter(([key, value]) => !keysToRemove.includes(key)));

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
    const currentGrade = (weightAchieved / completionPercentage) * 100 + bonusAchieved;

    // Calculate grade needed for 90% (A+)
    let gradeNeededAPlus = (100 * (90 - weightAchieved - bonusAchieved)) / (100 - completionPercentage);

    // Calculate grade needed for 85% (A)
    let gradeNeededA = (100 * (85 - weightAchieved - bonusAchieved)) / (100 - completionPercentage);

    // Calculate grade needed for 80% (A-)
    let gradeNeededAMinus = (100 * (80 - weightAchieved - bonusAchieved)) / (100 - completionPercentage);

    // If completion percentage is 100%, set all grade needed to 0
    if (completionPercentage === 100) {
        gradeNeededAPlus = 0;
        gradeNeededA = 0;
        gradeNeededAMinus = 0;
    }

    // Fill in results
    document.getElementById("completed").innerText = completionPercentage.toFixed(2);
    document.getElementById("earned").innerText = weightAchieved.toFixed(2);
    document.getElementById("bonus-earned").innerText = bonusAchieved.toFixed(2);
    document.getElementById("current").innerText = currentGrade.toFixed(2);
    document.getElementById("a-plus").innerText = gradeNeededAPlus.toFixed(2);
    document.getElementById("a").innerText = gradeNeededA.toFixed(2);
    document.getElementById("a-minus").innerText = gradeNeededAMinus.toFixed(2);

    // Copy form data to URL query string
    const url = new URL(window.location.href);
    for (const key in formData) {
        if (formData[key] === "") {
            url.searchParams.delete(key);
            continue;
        }
        url.searchParams.set(key, formData[key]);
    }
    document.getElementById("copy-link").value = url.href;

    // Make results visible and scroll to bottom
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
});
