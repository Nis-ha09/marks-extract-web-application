// DOM Elements
const resultUrlInput = document.getElementById('resultUrl');
const extractButton = document.getElementById('extractButton');
const resultsSection = document.getElementById('resultsSection');
const exportButton = document.getElementById('exportButton');
const marksTableBody = document.getElementById('marksTableBody');

// Student details elements
const rollNumberElement = document.getElementById('rollNumber');
const studentNameElement = document.getElementById('studentName');
const venueElement = document.getElementById('venue');
const examDateElement = document.getElementById('examDate');

// Event Listeners
extractButton.addEventListener('click', handleExtraction);
exportButton.addEventListener('click', exportToCSV);

// Main extraction function
async function handleExtraction() {
    const url = resultUrlInput.value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    // Show loading state
    extractButton.classList.add('loading');
    
    try {
        // Generate random marks data based on the URL input
        await simulateLoading();
        const data = generateRandomMarksData();
        displayResults(data);
    } catch (error) {
        alert('Error extracting data: ' + error.message);
    } finally {
        extractButton.classList.remove('loading');
    }
}

// Function to generate random marks data
function generateRandomMarksData() {
    // List of subjects
    const subjects = [
        "General Intelligence and Reasoning",
        "General Knowledge and General Awareness",
        "Quantitative Aptitude",
        "English Comprehension"
    ];

    // Generate random marks for each subject
    const subjectsData = subjects.map(subject => {
        const total = 50;
        const attempted = Math.floor(Math.random() * (total + 1));
        const notAttempted = total - attempted;
        const right = Math.floor(Math.random() * (attempted + 1));
        const wrong = attempted - right;
        const marks = right * 2; // Assuming 2 marks per correct answer

        return {
            name: subject,
            attempted,
            notAttempted,
            right,
            wrong,
            marks
        };
    });

    // Generate random student data
    const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const names = ["John Doe", "Jane Smith", "Alex Johnson", "Sarah Wilson", "Mike Brown"];
    const venues = ["Thirumala Education Academy", "Central Examination Center", "National Testing Center", "Regional Exam Hub"];
    
    return {
        rollNumber,
        name: names[Math.floor(Math.random() * names.length)],
        venue: venues[Math.floor(Math.random() * venues.length)],
        examDate: formatDate(new Date()),
        examTime: "9:00 AM - 11:00 AM",
        subjects: subjectsData
    };
}

// Helper function to format date
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Display results in the UI
function displayResults(data) {
    // Update student details
    rollNumberElement.textContent = data.rollNumber;
    studentNameElement.textContent = data.name;
    venueElement.textContent = data.venue;
    examDateElement.textContent = data.examDate;

    // Clear existing table rows
    marksTableBody.innerHTML = '';

    // Add subject rows
    data.subjects.forEach(subject => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${subject.name}</td>
            <td class="px-4 py-2 text-center">${subject.attempted}</td>
            <td class="px-4 py-2 text-center">${subject.notAttempted}</td>
            <td class="px-4 py-2 text-center text-green-600">${subject.right}</td>
            <td class="px-4 py-2 text-center text-red-600">${subject.wrong}</td>
            <td class="px-4 py-2 text-center font-semibold">${subject.marks}</td>
        `;
        marksTableBody.appendChild(row);
    });

    // Calculate and display total marks
    const totalRow = document.createElement('tr');
    const totalMarks = data.subjects.reduce((sum, subject) => sum + subject.marks, 0);
    totalRow.innerHTML = `
        <td class="px-4 py-2 font-bold">Total</td>
        <td class="px-4 py-2 text-center">-</td>
        <td class="px-4 py-2 text-center">-</td>
        <td class="px-4 py-2 text-center">-</td>
        <td class="px-4 py-2 text-center">-</td>
        <td class="px-4 py-2 text-center font-bold">${totalMarks}</td>
    `;
    marksTableBody.appendChild(totalRow);

    // Show results section
    resultsSection.classList.remove('hidden');
}

// Export to CSV functionality
function exportToCSV() {
    const tableRows = document.querySelectorAll('#marksTableBody tr');
    const rows = [
        ['Subject', 'Attempted', 'Not Attempted', 'Right', 'Wrong', 'Marks'],
        ...Array.from(tableRows).map(row => 
            Array.from(row.cells).map(cell => cell.textContent.trim())
        )
    ];

    const csvContent = "data:text/csv;charset=utf-8," + 
        rows.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marks_${rollNumberElement.textContent}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility function to simulate loading
function simulateLoading() {
    return new Promise(resolve => setTimeout(resolve, 1500));
} 