let subjectCount = 1;
const maxSubjects = 10;

let pendingSubjectAdd = false;

function addSubject() {
    if (subjectCount >= maxSubjects) {
        return;
    }

    // Show confirmation for 9th and 10th subject
    if (subjectCount === 8) {
        showConfirmation(
            'Adding 9th Subject',
            'You are about to add your 9th subject.\n\nMaximum is 10 subjects.\n\nAre you sure you want to continue?'
        );
        return;
    } else if (subjectCount === 9) {
        showConfirmation(
            'Adding 10th Subject (Final)',
            'You are about to add your 10th and FINAL subject.\n\nThis is the maximum number of subjects allowed.\n\nAre you sure you want to continue?'
        );
        return;
    }

    // Add subject directly if not 9th or 10th
    addSubjectField();
}

function addSubjectField() {
    subjectCount++;
    
    const gradesContainer = document.getElementById('gradesContainer');
    const gradeWrapper = document.createElement('div');
    gradeWrapper.className = 'grade-input-wrapper';
    
    gradeWrapper.innerHTML = `
        <input type="number" class="grade-input" placeholder="Grade (1.00 - 5.00)" min="1.00" max="5.00" step="0.01">
        <input type="number" class="units-input" placeholder="Units" min="0.5" max="10" step="0.5">
        <button class="remove-btn" onclick="removeGrade(this)">×</button>
    `;
    
    gradesContainer.appendChild(gradeWrapper);
    updateUI();
}

function showConfirmation(title, message) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmationModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    pendingSubjectAdd = true;
}

function proceedAddSubject() {
    document.getElementById('confirmationModal').classList.remove('show');
    document.body.style.overflow = '';
    if (pendingSubjectAdd) {
        addSubjectField();
        pendingSubjectAdd = false;
    }
}

function cancelAddSubject() {
    document.getElementById('confirmationModal').classList.remove('show');
    document.body.style.overflow = '';
    pendingSubjectAdd = false;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'subject-notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function removeGrade(button) {
    if (subjectCount <= 1) {
        return;
    }
    
    const wrapper = button.parentElement;
    wrapper.style.animation = 'slideOut 0.3s ease-out';
    
    setTimeout(() => {
        wrapper.remove();
        subjectCount--;
        updateUI();
    }, 300);
}

function updateUI() {
    const addBtn = document.getElementById('addSubjectBtn');
    const counter = document.getElementById('subjectCounter');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    addBtn.disabled = subjectCount >= maxSubjects;
    counter.textContent = `${subjectCount} of ${maxSubjects} subjects`;
    
    removeButtons.forEach(btn => {
        btn.disabled = subjectCount <= 1;
    });
}

function calculateGWA() {
    const gradeWrappers = document.querySelectorAll('.grade-input-wrapper');
    const subjects = [];
    let hasError = false;
    
    gradeWrappers.forEach((wrapper) => {
        const gradeInput = wrapper.querySelector('.grade-input');
        const unitsInput = wrapper.querySelector('.units-input');
        
        const grade = parseFloat(gradeInput.value);
        const units = parseFloat(unitsInput.value);
        
        if (!gradeInput.value || isNaN(grade)) {
            gradeInput.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                gradeInput.style.borderColor = '';
            }, 2000);
        } else if (grade < 1.00 || grade > 5.00) {
            gradeInput.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                gradeInput.style.borderColor = '';
            }, 2000);
        }
        
        if (!unitsInput.value || isNaN(units)) {
            unitsInput.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                unitsInput.style.borderColor = '';
            }, 2000);
        } else if (units < 0.5 || units > 10) {
            unitsInput.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                unitsInput.style.borderColor = '';
            }, 2000);
        }
        
        if (!hasError && !isNaN(grade) && !isNaN(units)) {
            subjects.push({ grade, units });
        }
    });
    
    if (hasError || subjects.length === 0) {
        alert('Please enter valid grades (1.00 - 5.00) and units for all subjects');
        return;
    }
    
    const totalWeightedGrades = subjects.reduce((sum, subject) => sum + (subject.grade * subject.units), 0);
    const totalUnits = subjects.reduce((sum, subject) => sum + subject.units, 0);
    
    const rawGWA = totalWeightedGrades / totalUnits;
    
    const semester = document.querySelector('input[name="semester"]:checked').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const campus = document.getElementById('campusSelect').value;
    
    const grades = subjects.map(s => s.grade);
    
    let officialGWA, displayGWA, honor;
    
    if (status === 'non-graduating') {
        officialGWA = Math.round(rawGWA * 100) / 100;
        displayGWA = officialGWA.toFixed(2);
        honor = determineNonGraduatingHonor(officialGWA, grades);
    } else {
        const rounded4 = Math.round(rawGWA * 10000) / 10000;
        officialGWA = Math.floor(rounded4 * 1000) / 1000;
        displayGWA = officialGWA.toFixed(3);
        honor = determineGraduatingHonor(officialGWA, grades);
    }
    
    displayResult(campus, semester, displayGWA, honor);
}

function determineNonGraduatingHonor(gwa, grades) {
    const hasDisqualifyingGrade = grades.some(grade => grade > 2.2);
    
    if (hasDisqualifyingGrade) {
        return 'Disqualified';
    }
    
    if (gwa >= 1.00 && gwa <= 1.50) {
        return "President's Lister";
    } else if (gwa >= 1.51 && gwa <= 1.75) {
        return "Dean's Lister";
    } else {
        return 'No Academic Honor';
    }
}

function determineGraduatingHonor(gwa, grades) {
    const hasDisqualifyingGrade = grades.some(grade => grade > 2.2);
    
    if (hasDisqualifyingGrade) {
        return 'No Latin Honor';
    }
    
    if (gwa >= 1.00 && gwa <= 1.20) {
        return 'Summa Cum Laude';
    } else if (gwa >= 1.21 && gwa <= 1.50) {
        return 'Magna Cum Laude';
    } else if (gwa >= 1.51 && gwa <= 1.75) {
        return 'Cum Laude';
    } else {
        return 'No Latin Honor';
    }
}

function displayResult(campus, semester, gwa, honor) {
    document.getElementById('resultCampus').textContent = campus;
    document.getElementById('resultSemester').textContent = semester;
    document.getElementById('resultGWA').textContent = gwa;
    document.getElementById('resultHonor').textContent = honor;
    
    const modal = document.getElementById('resultModal');
    modal.classList.add('show');
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function downloadResult() {
    const resultCard = document.getElementById('resultCard');
    
    const downloadBtn = document.querySelector('.download-btn');
    downloadBtn.textContent = 'Generating...';
    downloadBtn.disabled = true;
    
    html2canvas(resultCard, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'SORSU_GWA_Result.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        downloadBtn.textContent = 'Download as Image';
        downloadBtn.disabled = false;
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Please try again.');
        downloadBtn.textContent = 'Download as Image';
        downloadBtn.disabled = false;
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);

updateUI();