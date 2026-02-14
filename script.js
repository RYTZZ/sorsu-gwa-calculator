let subjectCount = 1;
const maxSubjects = 8;

function addSubject() {
    if (subjectCount >= maxSubjects) {
        return;
    }

    subjectCount++;
    
    const gradesContainer = document.getElementById('gradesContainer');
    const gradeWrapper = document.createElement('div');
    gradeWrapper.className = 'grade-input-wrapper';
    
    gradeWrapper.innerHTML = `
        <input type="number" class="grade-input" placeholder="Enter grade (1.00 - 5.00)" min="1.00" max="5.00" step="0.01">
        <button class="remove-btn" onclick="removeGrade(this)">×</button>
    `;
    
    gradesContainer.appendChild(gradeWrapper);
    updateUI();
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
    const gradeInputs = document.querySelectorAll('.grade-input');
    const grades = [];
    let hasError = false;
    
    gradeInputs.forEach((input, index) => {
        const value = parseFloat(input.value);
        
        if (!input.value || isNaN(value)) {
            input.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        } else if (value < 1.00 || value > 5.00) {
            input.style.borderColor = 'var(--maroon-primary)';
            hasError = true;
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        } else {
            grades.push(value);
        }
    });
    
    if (hasError || grades.length === 0) {
        alert('Please enter valid grades for all subjects (1.00 - 5.00)');
        return;
    }
    
    const gwa = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const roundedGWA = Math.round(gwa * 100) / 100;
    
    const semester = document.querySelector('input[name="semester"]:checked').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    
    const honor = determineHonor(roundedGWA, status, grades);
    
    displayResult(semester, roundedGWA, honor);
}

function determineHonor(gwa, status, grades) {
    if (status === 'non-graduating') {
        const hasLowGrade = grades.some(grade => grade < 2.2);
        
        if (hasLowGrade) {
            return 'Disqualified';
        }
        
        if (gwa >= 1.00 && gwa <= 1.50) {
            return "President's Lister";
        } else if (gwa >= 1.51 && gwa <= 1.75) {
            return "Dean's Lister";
        } else {
            return 'No Academic Honor';
        }
    } else {
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
}

function displayResult(semester, gwa, honor) {
    document.getElementById('resultSemester').textContent = semester;
    document.getElementById('resultGWA').textContent = gwa.toFixed(2);
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