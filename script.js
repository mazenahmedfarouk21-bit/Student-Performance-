// Dataset Source (Embedded directly from uploaded file context)
const rawStudentData = [
    { StudentID: "S001", StudentName: "Alice Smith", Department: "Computer Science", Gender: "Female", AcademicYear: "Year 1", FinalScore: 88, AttendancePct: 92, AssignmentAvg: 90, ExamScore: 86, InternetAccess: "Yes" },
    { StudentID: "S002", StudentName: "Bob Jones", Department: "Engineering", Gender: "Male", AcademicYear: "Year 2", FinalScore: 42, AttendancePct: 65, AssignmentAvg: 48, ExamScore: 38, InternetAccess: "No" },
    { StudentID: "S003", StudentName: "Charlie Brown", Department: "Business", Gender: "Male", AcademicYear: "Year 3", FinalScore: 74, AttendancePct: 85, AssignmentAvg: 76, ExamScore: 72, InternetAccess: "Yes" },
    { StudentID: "S004", StudentName: "Diana Prince", Department: "Computer Science", Gender: "Female", AcademicYear: "Year 1", FinalScore: 95, AttendancePct: 98, AssignmentAvg: 94, ExamScore: 96, InternetAccess: "Yes" },
    { StudentID: "S005", StudentName: "Ethan Hunt", Department: "Arts", Gender: "Male", AcademicYear: "Year 4", FinalScore: 61, AttendancePct: 78, AssignmentAvg: 65, ExamScore: 58, InternetAccess: "Yes" },
    { StudentID: "S006", StudentName: "Fiona Gallagher", Department: "Engineering", Gender: "Female", AcademicYear: "Year 2", FinalScore: 48, AttendancePct: 70, AssignmentAvg: 52, ExamScore: 45, InternetAccess: "No" },
    { StudentID: "S007", StudentName: "George Clark", Department: "Business", Gender: "Male", AcademicYear: "Year 3", FinalScore: 81, AttendancePct: 89, AssignmentAvg: 83, ExamScore: 80, InternetAccess: "Yes" },
    { StudentID: "S008", StudentName: "Hannah Abbott", Department: "Arts", Gender: "Female", AcademicYear: "Year 4", FinalScore: 35, AttendancePct: 55, AssignmentAvg: 40, ExamScore: 32, InternetAccess: "No" },
    { StudentID: "S009", StudentName: "Ian Malcolm", Department: "Computer Science", Gender: "Male", AcademicYear: "Year 1", FinalScore: 78, AttendancePct: 88, AssignmentAvg: 80, ExamScore: 76, InternetAccess: "Yes" },
    { StudentID: "S010", StudentName: "Julia Roberts", Department: "Engineering", Gender: "Female", AcademicYear: "Year 2", FinalScore: 67, AttendancePct: 82, AssignmentAvg: 70, ExamScore: 65, InternetAccess: "Yes" },
    { StudentID: "S011", StudentName: "Kevin Bacon", Department: "Business", Gender: "Male", AcademicYear: "Year 3", FinalScore: 53, AttendancePct: 72, AssignmentAvg: 58, ExamScore: 50, InternetAccess: "Yes" },
    { StudentID: "S012", StudentName: "Laura Croft", Department: "Arts", Gender: "Female", AcademicYear: "Year 4", FinalScore: 91, AttendancePct: 95, AssignmentAvg: 92, ExamScore: 90, InternetAccess: "Yes" }
];

// Calculated Derived Data
function processData(data) {
    return data.map(item => {
        const passStatus = item.FinalScore >= 50 ? 'Passed' : 'Failed';
        let band = 'Low Performance';
        if (item.FinalScore >= 75) {
            band = 'High Performance';
        } else if (item.FinalScore >= 50) {
            band = 'Moderate Performance';
        }
        return { ...item, PassStatus: passStatus, PerformanceBand: band };
    });
}

const studentData = processData(rawStudentData);

// Chart References
let chartBand, chartDept, chartPassYear, chartAttendance, chartAssignmentExam;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateFilterDropdowns();
    setupEventListeners();
    updateDashboard();
});

function populateFilterDropdowns() {
    const depts = [...new Set(studentData.map(d => d.Department))];
    const years = [...new Set(studentData.map(d => d.AcademicYear))];
    const genders = [...new Set(studentData.map(d => d.Gender))];

    const fillSelect = (id, options) => {
        const select = document.getElementById(id);
        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt;
            el.textContent = opt;
            select.appendChild(el);
        });
    };

    fillSelect('filter-department', depts);
    fillSelect('filter-year', years);
    fillSelect('filter-gender', genders);
}

function setupEventListeners() {
    const filters = [
        'filter-department', 'filter-year', 'filter-band',
        'filter-status', 'filter-gender', 'filter-internet'
    ];

    filters.forEach(id => {
        document.getElementById(id).addEventListener('change', updateDashboard);
    });

    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        filters.forEach(id => document.getElementById(id).value = 'ALL');
        updateDashboard();
    });
}

function getFilteredData() {
    const dept = document.getElementById('filter-department').value;
    const year = document.getElementById('filter-year').value;
    const band = document.getElementById('filter-band').value;
    const status = document.getElementById('filter-status').value;
    const gender = document.getElementById('filter-gender').value;
    const internet = document.getElementById('filter-internet').value;

    return studentData.filter(d => {
        return (dept === 'ALL' || d.Department === dept) &&
               (year === 'ALL' || d.AcademicYear === year) &&
               (band === 'ALL' || d.PerformanceBand === band) &&
               (status === 'ALL' || d.PassStatus === status) &&
               (gender === 'ALL' || d.Gender === gender) &&
               (internet === 'ALL' || d.InternetAccess === internet);
    });
}

function updateDashboard() {
    const data = getFilteredData();
    updateKPIs(data);
    renderCharts(data);
}

function updateKPIs(data) {
    const total = data.length;
    if (total === 0) {
        document.getElementById('kpi-total-students').textContent = '0';
        document.getElementById('kpi-avg-score').textContent = '0.0%';
        document.getElementById('kpi-pass-rate').textContent = '0.0%';
        document.getElementById('kpi-avg-attendance').textContent = '0.0%';
        document.getElementById('kpi-avg-assignment').textContent = '0.0%';
        return;
    }

    const avgScore = (data.reduce((acc, d) => acc + d.FinalScore, 0) / total).toFixed(1);
    const passedCount = data.filter(d => d.PassStatus === 'Passed').length;
    const passRate = ((passedCount / total) * 100).toFixed(1);
    const avgAttendance = (data.reduce((acc, d) => acc + d.AttendancePct, 0) / total).toFixed(1);
    const avgAssignment = (data.reduce((acc, d) => acc + d.AssignmentAvg, 0) / total).toFixed(1);

    document.getElementById('kpi-total-students').textContent = total;
    document.getElementById('kpi-avg-score').textContent = `${avgScore}%`;
    document.getElementById('kpi-pass-rate').textContent = `${passRate}%`;
    document.getElementById('kpi-avg-attendance').textContent = `${avgAttendance}%`;
    document.getElementById('kpi-avg-assignment').textContent = `${avgAssignment}%`;
}

function renderCharts(data) {
    // Destroy previous chart instances
    [chartBand, chartDept, chartPassYear, chartAttendance, chartAssignmentExam].forEach(c => c && c.destroy());

    // 1. Performance Band Distribution (Bar Chart)
    const bandCounts = { 'High Performance': 0, 'Moderate Performance': 0, 'Low Performance': 0 };
    data.forEach(d => bandCounts[d.PerformanceBand]++);

    chartBand = new Chart(document.getElementById('chart-performance-band'), {
        type: 'bar',
        data: {
            labels: Object.keys(bandCounts),
            datasets: [{
                data: Object.values(bandCounts),
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });

    // 2. Department Average Score (Horizontal Bar Chart)
    const deptScores = {};
    const deptCounts = {};
    data.forEach(d => {
        deptScores[d.Department] = (deptScores[d.Department] || 0) + d.FinalScore;
        deptCounts[d.Department] = (deptCounts[d.Department] || 0) + 1;
    });

    const deptLabels = Object.keys(deptScores);
    const deptAvgs = deptLabels.map(dept => (deptScores[dept] / deptCounts[dept]).toFixed(1));

    chartDept = new Chart(document.getElementById('chart-dept-performance'), {
        type: 'bar',
        data: {
            labels: deptLabels,
            datasets: [{
                label: 'Avg Final Score (%)',
                data: deptAvgs,
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { min: 0, max: 100 } }
        }
    });

    // 3. Pass/Fail Ratio by Academic Year (Stacked Bar Chart)
    const years = [...new Set(studentData.map(d => d.AcademicYear))].sort();
    const passByYear = years.map(y => data.filter(d => d.AcademicYear === y && d.PassStatus === 'Passed').length);
    const failByYear = years.map(y => data.filter(d => d.AcademicYear === y && d.PassStatus === 'Failed').length);

    chartPassYear = new Chart(document.getElementById('chart-pass-year'), {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                { label: 'Passed', data: passByYear, backgroundColor: '#10b981' },
                { label: 'Failed', data: failByYear, backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });

    // 4. Attendance vs. Final Score Correlation (Scatter Plot)
    const scatterPoints = data.map(d => ({ x: d.AttendancePct, y: d.FinalScore }));

    chartAttendance = new Chart(document.getElementById('chart-attendance-correlation'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Student Metrics',
                data: scatterPoints,
                backgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Attendance (%)' }, min: 40, max: 100 },
                y: { title: { display: true, text: 'Final Score (%)' }, min: 0, max: 100 }
            }
        }
    });

    // 5. Assignment Avg vs Exam Score (Grouped Bar Chart)
    const assignmentAvgs = deptLabels.map(dept => {
        const items = data.filter(d => d.Department === dept);
        return items.length ? (items.reduce((acc, d) => acc + d.AssignmentAvg, 0) / items.length).toFixed(1) : 0;
    });

    const examAvgs = deptLabels.map(dept => {
        const items = data.filter(d => d.Department === dept);
        return items.length ? (items.reduce((acc, d) => acc + d.ExamScore, 0) / items.length).toFixed(1) : 0;
    });

    chartAssignmentExam = new Chart(document.getElementById('chart-assignment-exam'), {
        type: 'bar',
        data: {
            labels: deptLabels,
            datasets: [
                { label: 'Avg Assignment Score', data: assignmentAvgs, backgroundColor: '#8b5cf6' },
                { label: 'Avg Exam Score', data: examAvgs, backgroundColor: '#06b6d4' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 100 } }
        }
    });
}