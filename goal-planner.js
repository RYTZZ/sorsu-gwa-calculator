function calculateRequiredGWA() {
    const currentGWA = parseFloat(document.getElementById('currentGWA').value);
    const unitsCompleted = parseFloat(document.getElementById('unitsCompleted').value);
    const unitsRemaining = parseFloat(document.getElementById('unitsRemaining').value);
    const targetHonor = document.getElementById('targetHonor');
    const targetGWA = parseFloat(targetHonor.value);
    const targetText = targetHonor.options[targetHonor.selectedIndex].text;

    // Validation
    if (!currentGWA || !unitsCompleted || !unitsRemaining || !targetGWA) {
        alert('Please fill in all fields');
        return;
    }

    if (currentGWA < 1.00 || currentGWA > 5.00) {
        alert('Current GWA must be between 1.00 and 5.00');
        return;
    }

    if (unitsCompleted <= 0 || unitsRemaining <= 0) {
        alert('Units must be greater than 0');
        return;
    }

    // Calculate total units
    const totalUnits = unitsCompleted + unitsRemaining;

    // Calculate required GWA
    // Formula: (Target × Total Units) - (Current × Completed Units) / Remaining Units
    const requiredGWA = ((targetGWA * totalUnits) - (currentGWA * unitsCompleted)) / unitsRemaining;

    // Display results
    document.getElementById('resultTarget').textContent = targetText;
    document.getElementById('resultTotalUnits').textContent = totalUnits + ' units';
    document.getElementById('resultRequiredGWA').textContent = requiredGWA.toFixed(3);

    // Determine status and message
    const statusDiv = document.getElementById('goalStatus');
    const messageP = document.getElementById('goalMessage');

    if (requiredGWA < 1.00) {
        statusDiv.className = 'goal-status impossible';
        statusDiv.textContent = '❌ Target Already Achieved!';
        messageP.textContent = `Great news! Your current GWA of ${currentGWA.toFixed(2)} already qualifies for ${targetText.split(' (')[0]}. Keep up the excellent work!`;
    } else if (requiredGWA <= 1.00) {
        statusDiv.className = 'goal-status achievable';
        statusDiv.textContent = '✅ Achievable!';
        messageP.textContent = `You need a GWA of ${requiredGWA.toFixed(3)} in your remaining ${unitsRemaining} units to achieve ${targetText.split(' (')[0]}. This goal is definitely achievable with consistent effort!`;
    } else if (requiredGWA <= 2.00) {
        statusDiv.className = 'goal-status challenging';
        statusDiv.textContent = '⚠️ Challenging but Possible';
        messageP.textContent = `You need a GWA of ${requiredGWA.toFixed(3)} in your remaining ${unitsRemaining} units to achieve ${targetText.split(' (')[0]}. This will require dedicated effort, but it's still within reach!`;
    } else if (requiredGWA <= 3.00) {
        statusDiv.className = 'goal-status impossible';
        statusDiv.textContent = '❌ Very Difficult';
        messageP.textContent = `You need a GWA of ${requiredGWA.toFixed(3)} in your remaining ${unitsRemaining} units. This is extremely challenging. Consider setting a more achievable target or focus on improving your overall performance.`;
    } else {
        statusDiv.className = 'goal-status impossible';
        statusDiv.textContent = '❌ Not Achievable';
        messageP.textContent = `Unfortunately, achieving ${targetText.split(' (')[0]} is not mathematically possible with your current GWA. Consider setting a different goal or focus on finishing strong!`;
    }

    // Show result section
    document.getElementById('goalResult').style.display = 'block';
    
    // Scroll to result
    document.getElementById('goalResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}