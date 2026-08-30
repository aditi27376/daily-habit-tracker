// ============================================
// DAILY HABIT TRACKER
// ============================================


// ============================================
// GET HTML ELEMENTS
// ============================================

const habitForm =
    document.getElementById("habitForm");

const habitInput =
    document.getElementById("habitInput");

const categoryInput =
    document.getElementById("categoryInput");

const priorityInput =
    document.getElementById("priorityInput");

const habitList =
    document.getElementById("habitList");

const emptyState =
    document.getElementById("emptyState");

const noResults =
    document.getElementById("noResults");

const searchInput =
    document.getElementById("searchInput");

const totalHabits =
    document.getElementById("totalHabits");

const completedHabits =
    document.getElementById("completedHabits");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const streakElement =
    document.getElementById("streak");

const filterSelect =
    document.getElementById("filterSelect");

const themeBtn =
    document.getElementById("themeBtn");

const todayDate =
    document.getElementById("todayDate");

const weeklyChart =
    document.getElementById("weeklyChart");


// ============================================
// HABITS DATA
// ============================================

let habits =
    JSON.parse(
        localStorage.getItem("habits")
    ) || [];


// ============================================
// FIX OLD HABITS
// ============================================

habits.forEach(function (habit) {

    if (!habit.priority) {

        habit.priority = "Medium";

    }


    if (!habit.completedDates) {

        habit.completedDates = [];

    }

});


// ============================================
// START APPLICATION
// ============================================

showDate();

renderHabits();

updateStats();

renderWeeklyChart();

loadTheme();


// ============================================
// ADD HABIT
// ============================================

habitForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            habitInput.value.trim();


        const category =
            categoryInput.value;


        const priority =
            priorityInput.value;


        if (name === "") {

            alert("Please enter a habit.");

            return;

        }


        const newHabit = {

            id: Date.now(),

            name: name,

            category: category,

            priority: priority,

            completedDates: []

        };


        habits.push(newHabit);


        saveHabits();


        habitInput.value = "";


        renderHabits();

        updateStats();

        renderWeeklyChart();

    }
);


// ============================================
// DISPLAY HABITS
// ============================================

function renderHabits() {

    habitList.innerHTML = "";


    const filter =
        filterSelect.value;


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredHabits =
        habits.filter(function (habit) {

            const completed =
                isCompletedToday(habit);


            // FILTER
            if (
                filter === "completed" &&
                !completed
            ) {

                return false;

            }


            if (
                filter === "pending" &&
                completed
            ) {

                return false;

            }


            // SEARCH
            const matchesSearch =
                habit.name
                    .toLowerCase()
                    .includes(searchText);


            return matchesSearch;

        });


    // NO HABITS AT ALL
    if (habits.length === 0) {

        emptyState.style.display =
            "block";

        noResults.style.display =
            "none";

        return;

    }


    emptyState.style.display =
        "none";


    // SEARCH HAS NO RESULT
    if (
        filteredHabits.length === 0
    ) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    // CREATE HABITS
    filteredHabits.forEach(
        function (habit) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "habit-item";


            if (
                isCompletedToday(habit)
            ) {

                item.classList.add(
                    "completed"
                );

            }


            const priorityClass =
                getPriorityClass(
                    habit.priority
                );


            item.innerHTML = `

                <div class="habit-left">

                    <button
                        class="check-btn"
                        onclick="toggleHabit(${habit.id})"
                        title="Complete habit"
                    >
                        ${
                            isCompletedToday(habit)
                                ? "✓"
                                : ""
                        }
                    </button>


                    <div>

                        <div class="habit-name">

                            ${escapeHTML(
                                habit.name
                            )}

                        </div>


                        <div class="habit-category">

                            ${getCategoryIcon(
                                habit.category
                            )}

                            ${escapeHTML(
                                habit.category
                            )}

                            <span
                                class="priority ${priorityClass}"
                            >

                                ${getPriorityIcon(
                                    habit.priority
                                )}

                                ${escapeHTML(
                                    habit.priority
                                )}

                            </span>

                        </div>

                    </div>

                </div>


                <div>

                    <button
                        class="edit-btn"
                        onclick="editHabit(${habit.id})"
                        title="Edit habit"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteHabit(${habit.id})"
                        title="Delete habit"
                    >
                        🗑️
                    </button>

                </div>

            `;


            habitList.appendChild(item);

        }
    );

}


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    function () {

        renderHabits();

    }
);


// ============================================
// COMPLETE / UNCOMPLETE
// ============================================

function toggleHabit(id) {

    const habit =
        habits.find(function (habit) {

            return habit.id === id;

        });


    if (!habit) {

        return;

    }


    const today =
        getDateKey(new Date());


    const index =
        habit.completedDates.indexOf(
            today
        );


    if (index === -1) {

        habit.completedDates.push(
            today
        );

    } else {

        habit.completedDates.splice(
            index,
            1
        );

    }


    saveHabits();


    renderHabits();

    updateStats();

    renderWeeklyChart();

}


// ============================================
// EDIT HABIT
// ============================================

function editHabit(id) {

    const habit =
        habits.find(function (habit) {

            return habit.id === id;

        });


    if (!habit) {

        return;

    }


    const newName =
        prompt(
            "Enter the new habit name:",
            habit.name
        );


    if (newName === null) {

        return;

    }


    const trimmedName =
        newName.trim();


    if (trimmedName === "") {

        alert(
            "Habit name cannot be empty."
        );

        return;

    }


    habit.name =
        trimmedName;


    saveHabits();


    renderHabits();

}


// ============================================
// DELETE HABIT
// ============================================

function deleteHabit(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this habit?"
        );


    if (!confirmed) {

        return;

    }


    habits =
        habits.filter(
            function (habit) {

                return habit.id !== id;

            }
        );


    saveHabits();


    renderHabits();

    updateStats();

    renderWeeklyChart();

}


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStats() {

    const total =
        habits.length;


    const completed =
        habits.filter(
            function (habit) {

                return isCompletedToday(
                    habit
                );

            }
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    totalHabits.textContent =
        total;


    completedHabits.textContent =
        completed;


    progressPercent.textContent =
        percentage + "%";


    progressText.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    const currentStreak =
        calculateStreak();


    streakElement.textContent =
        currentStreak +
        " day" +
        (
            currentStreak === 1
                ? ""
                : "s"
        );

}


// ============================================
// STREAK
// ============================================

function calculateStreak() {

    if (habits.length === 0) {

        return 0;

    }


    let streak = 0;

    let date = new Date();


    while (true) {

        const dateKey =
            getDateKey(date);


        const allCompleted =
            habits.every(
                function (habit) {

                    return habit
                        .completedDates
                        .includes(
                            dateKey
                        );

                }
            );


        if (!allCompleted) {

            break;

        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;

}


// ============================================
// WEEKLY CHART
// ============================================

function renderWeeklyChart() {

    weeklyChart.innerHTML = "";


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const dateKey =
            getDateKey(date);


        let completed = 0;


        habits.forEach(
            function (habit) {

                if (
                    habit.completedDates
                        .includes(dateKey)
                ) {

                    completed++;

                }

            }
        );


        let percentage = 0;


        if (habits.length > 0) {

            percentage =
                Math.round(
                    (completed / habits.length)
                    * 100
                );

        }


        const column =
            document.createElement(
                "div"
            );


        column.className =
            "day-column";


        column.innerHTML = `

            <strong>
                ${percentage}%
            </strong>


            <div
                class="day-bar-container"
            >

                <div
                    class="day-bar"
                    style="height: ${percentage}%"
                ></div>

            </div>


            <span class="day-name">

                ${date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                )}

            </span>

        `;


        weeklyChart.appendChild(
            column
        );

    }

}


// ============================================
// FILTER
// ============================================

filterSelect.addEventListener(
    "change",
    function () {

        renderHabits();

    }
);


// ============================================
// LOCAL STORAGE
// ============================================

function saveHabits() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

}


// ============================================
// DATE
// ============================================

function getDateKey(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function isCompletedToday(habit) {

    const today =
        getDateKey(
            new Date()
        );


    return habit
        .completedDates
        .includes(today);

}


// ============================================
// TODAY'S DATE
// ============================================

function showDate() {

    const today =
        new Date();


    todayDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


// ============================================
// CATEGORY ICON
// ============================================

function getCategoryIcon(category) {

    const icons = {

        Study: "📚",

        Health: "💪",

        Fitness: "🏃",

        Personal: "🌱"

    };


    return icons[category] || "⭐";

}


// ============================================
// PRIORITY ICON
// ============================================

function getPriorityIcon(priority) {

    const icons = {

        High: "🔴",

        Medium: "🟡",

        Low: "🟢"

    };


    return icons[priority] || "🟡";

}


function getPriorityClass(priority) {

    const classes = {

        High: "priority-high",

        Medium: "priority-medium",

        Low: "priority-low"

    };


    return classes[priority]
        || "priority-medium";

}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


// ============================================
// DARK MODE
// ============================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            isDark
        );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }
);


// ============================================
// LOAD THEME
// ============================================

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark"
        );


        themeBtn.textContent =
            "☀️";

    }

}