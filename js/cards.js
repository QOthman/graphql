
export function formatXP(totalXP) {
    if (totalXP >= 1000000) {
        return (totalXP / 1000000).toFixed(2) + " MB";
    } else if (totalXP >= 1000) {
        return (totalXP / 1000).toFixed(2) + " KB";
    } else {
        return totalXP + " bytes";
    }
}


export function calculateAuditStats(auditTransactions) {
    const upAudits = auditTransactions.filter(t => t.type === 'up');
    const downAudits = auditTransactions.filter(t => t.type === 'down');

    const totalUpPoints = upAudits.reduce((sum, t) => sum + t.amount, 0);
    const totalDownPoints = downAudits.reduce((sum, t) => sum + t.amount, 0);

    const auditRatio = totalUpPoints / (totalDownPoints || 1);

    return { totalUpPoints, totalDownPoints, auditRatio };
}



export function createCardsElement(auditStats, user, totalXP, completedProjects, notCompletedProjects) {
    const div = document.createElement('div');
    div.className = 'card-container';

    const incompleteProjectsList = notCompletedProjects.length > 0
        ? `<ul>${notCompletedProjects.map(p => `<li>${p.object.name}</li>`).join('')}</ul>`
        : '<span>All started projects are completed! 🎉</span>';

    div.innerHTML = `
          <div class="card">
              <h2>User Info</h2>
              <p><strong>Nickname:</strong> ${user.login}</p>
              <p><strong>Name:</strong> ${user.attrs.firstName} ${user.attrs.lastName}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Campus:</strong> ${user.campus}</p>
          </div>
  
          <div class="card">
            <h2>Audit Stats</h2>
            <p><strong>Total Up Points:</strong> ${formatXP(auditStats.totalUpPoints)}</p>
            <p><strong>Total Down Points:</strong> ${formatXP(auditStats.totalDownPoints)}</p>
            <p><strong>Audit Ratio:</strong> ${auditStats.auditRatio.toFixed(1)}</p>
          </div>
  
          <div class="card">
            <h2>User Dashboard</h2>
            <p><strong>Total Xp:</strong> ${formatXP(totalXP)}</p>
            <p><strong>Projects Completed:</strong> ${completedProjects} Projects ✅</p>    
            <p><strong>Projects Started & Not Completed:</strong> ${incompleteProjectsList}</p>
          </div>
  
        
    `;

    return div;
}

