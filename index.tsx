 // Role Configuration Logic
    const ROLES = {
        DEVELOPER: { 
            id: 'developer', 
            label: 'Developer', 
            contributesToStories: true, 
            color: 'green',
            bg: 'bg-green-50',
            border: 'border-green-100',
            text: 'text-green-700'
        },
        QA: { 
            id: 'qa', 
            label: 'QA / Tester', 
            contributesToStories: false, 
            color: 'blue',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-700'
        }
    };

    let developers = [];
    let devCounter = 0;
    
    // Configuration Elements
    const els = {
        defaultDays: document.getElementById('defaultDays'),
        hoursPerDay: document.getElementById('hoursPerDay'),
        avgStories: document.getElementById('avgStories'),
        defaultAvailability: document.getElementById('defaultAvailability'),
        newSprint: document.getElementById('newSprint'),
        velocity1: document.getElementById('velocity1'),
        velocity2: document.getElementById('velocity2'),
        velocity3: document.getElementById('velocity3'),
        container: document.getElementById('developersContainer'),
        summary: {
            totalHours: document.getElementById('totalHours'),
            teamSize: document.getElementById('teamSize'),
            teamBreakdown: document.getElementById('teamBreakdown'),
            teamVelocity: document.getElementById('teamVelocity'),
            maxStoryCapacity: document.getElementById('maxStoryCapacity'),
            warning: document.getElementById('deliveryWarning')
        }
    };

    function addDeveloper() {
        const defaultDays = parseInt(els.defaultDays.value) || 10;
        const defaultAvail = parseInt(els.defaultAvailability.value) || 80;
        
        const dev = {
            id: ++devCounter,
            name: '',
            role: ROLES.DEVELOPER.id, // Default to Developer
            workingDays: defaultDays,
            availability: defaultAvail
        };
        developers.push(dev);
        renderDevelopers();
        calculateSummary();
    }
    
    function removeDeveloper(id) {
        developers = developers.filter(d => d.id !== id);
        renderDevelopers();
        calculateSummary();
    }
    
    function updateDeveloper(id, field, value) {
        const dev = developers.find(d => d.id === id);
        if (dev) {
            dev[field] = value;
            calculateSummary();
            // If changing role, we need to re-render to update the visual theme
            if (field === 'role') renderDevelopers();
        }
    }
    
    function calculateDeveloperCapacity(dev) {
        const hoursPerDay = parseFloat(els.hoursPerDay.value) || 8;
        const totalHours = dev.workingDays * hoursPerDay * (dev.availability / 100);
        return totalHours;
    }
    
    function renderDevelopers() {
        const hoursPerDay = parseFloat(els.hoursPerDay.value) || 8;
        
        els.container.innerHTML = developers.map(dev => {
            const capacity = calculateDeveloperCapacity(dev);
            const days = (capacity / hoursPerDay) || 0;
            
            // Get role config, fallback to DEVELOPER if not found
            const roleConfig = Object.values(ROLES).find(r => r.id === dev.role) || ROLES.DEVELOPER;
            
            return `
                <div class="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm group">
                    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        
                         <!-- Role Select -->
                         <div class="w-full md:w-32">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                            <select onchange="updateDeveloper(${dev.id}, 'role', this.value)" 
                                    class="w-full bg-slate-50 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                                ${Object.values(ROLES).map(r => `
                                    <option value="${r.id}" ${dev.role === r.id ? 'selected' : ''}>${r.label}</option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Name -->
                        <div class="flex-grow w-full md:w-auto">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                            <input type="text" value="${dev.name}" 
                                   placeholder="Enter name..."
                                   onchange="updateDeveloper(${dev.id}, 'name', this.value)"
                                   class="w-full text-lg font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-colors placeholder-slate-300">
                        </div>

                        <!-- Inputs -->
                        <div class="flex gap-4 w-full md:w-auto">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Working Days</label>
                                <input type="number" value="${dev.workingDays}" min="0" max="30"
                                       onchange="updateDeveloper(${dev.id}, 'workingDays', parseInt(this.value))"
                                       class="bg-white text-slate-900 w-24 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Avail %</label>
                                <input type="number" value="${dev.availability}" min="0" max="100"
                                       onchange="updateDeveloper(${dev.id}, 'availability', parseInt(this.value))"
                                       class="bg-white text-slate-900 w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right font-mono">
                            </div>
                        </div>

                        <!-- Result Pill -->
                        <div class="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center ${roleConfig.bg} px-4 py-2 rounded-lg border ${roleConfig.border} min-w-[120px]">
                            <span class="text-[10px] font-bold ${roleConfig.text} uppercase">Effective Capacity</span>
                            <div class="text-right">
                                <span class="text-xl font-bold ${roleConfig.text}">${capacity.toFixed(1)}h</span>
                                <span class="text-xs ${roleConfig.text} opacity-80 block">~${days.toFixed(1)} days ${roleConfig.contributesToStories ? '' : '(QA)'}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <button onclick="removeDeveloper(${dev.id})" class="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" title="Remove Member">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function calculateSummary() {
        const avgStoriesPerDay = parseFloat(els.avgStories.value) || 0;
        const newSprint = parseInt(els.newSprint.value) || 0;
        const velocity1 = parseInt(els.velocity1.value) || 0;
        const velocity2 = parseInt(els.velocity2.value) || 0;
        const velocity3 = parseInt(els.velocity3.value) || 0;
        
        // 1. Total hours includes EVERYONE (QA + Dev)
        const totalHours = developers.reduce((sum, dev) => sum + calculateDeveloperCapacity(dev), 0);
        const teamVelocity = ((velocity1 + velocity2 + velocity3) / 3).toFixed(1);
        
        // 2. Max Story Capacity ONLY includes those contributing to stories (Devs)
        const maxStoryCapacity = developers.reduce((sum, dev) => {
            const roleConfig = Object.values(ROLES).find(r => r.id === dev.role) || ROLES.DEVELOPER;
            
            if (roleConfig.contributesToStories) {
                const effectiveDays = dev.workingDays * (dev.availability / 100);
                return sum + (effectiveDays * avgStoriesPerDay);
            }
            return sum;
        }, 0);
        
        // 3. Team Breakdown
        const devCount = developers.filter(d => d.role === ROLES.DEVELOPER.id).length;
        const qaCount = developers.filter(d => d.role === ROLES.QA.id).length;
        let breakdownText = "";
        if (qaCount > 0) breakdownText = `${devCount} Devs, ${qaCount} QA`;
        else breakdownText = `${devCount} Devs`;

        els.summary.totalHours.textContent = totalHours.toFixed(1);
        els.summary.teamSize.textContent = developers.length;
        els.summary.teamBreakdown.textContent = breakdownText;
        els.summary.teamVelocity.textContent = teamVelocity;
        els.summary.maxStoryCapacity.textContent = maxStoryCapacity.toFixed(1);
        
        // Warnings
        const warningDiv = els.summary.warning;
        const avgVelocity = parseFloat(teamVelocity);
        
        if (newSprint > 0) {
            warningDiv.classList.remove('hidden');
            
            let title, msg, bgClass, borderClass;

            if (newSprint > maxStoryCapacity) {
                 // Danger: Exceeds capacity (most critical)
                title = "⚠️ Capacity Alert";
                msg = `The planned sprint (${newSprint} pts) exceeds your team's calculated capacity of ${maxStoryCapacity.toFixed(1)} stories based on current availability.`;
                bgClass = "bg-red-500/20";
                borderClass = "border-red-400/30";
            } else if (newSprint > avgVelocity) {
                 // Warning: Exceeds historical velocity
                title = "⚡ Velocity Warning";
                msg = `Planned sprint is within theoretical capacity but exceeds your historical average velocity (${teamVelocity} pts). Risk of carry-over.`;
                bgClass = "bg-yellow-500/20";
                borderClass = "border-yellow-400/30";
            } else {
                // Good
                title = "✓ Sprint Feasible";
                msg = `The plan (${newSprint} pts) fits comfortably within both your calculated capacity and historical velocity.`;
                bgClass = "bg-green-500/20";
                borderClass = "border-green-400/30";
            }
            
            warningDiv.className = `mt-6 p-4 rounded-lg border backdrop-blur-md transition-all ${bgClass} ${borderClass}`;
            warningDiv.innerHTML = `
                <div class="font-bold text-lg mb-1">${title}</div>
                <div class="text-sm opacity-90 leading-relaxed">${msg}</div>
            `;
        } else {
            warningDiv.classList.add('hidden');
        }
    }
    
    // Listeners
    const inputs = [
        els.defaultDays, els.hoursPerDay, els.avgStories, els.defaultAvailability,
        els.newSprint, els.velocity1, els.velocity2, els.velocity3
    ];
    
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            // If global HoursPerDay changes, re-render to update the calculated displays in cards
            if(input === els.hoursPerDay) renderDevelopers();
            calculateSummary();
        });
    });
    
    // Init
    addDeveloper();
    addDeveloper();
