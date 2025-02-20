class ClickerGame {
    constructor() {
        this.clicks = 0;
        this.ranks = [
            { name: 'Novice Goon', threshold: 0 },
            { name: 'Apprentice Goon', threshold: 100 },
            { name: 'Elite Goon', threshold: 500 },
            { name: 'Super Goon', threshold: 1000 },
            { name: 'Mega Goon', threshold: 5000 },
            { name: 'Ultimate Goon', threshold: 10000 }
        ];

        this.initializeElements();
        this.loadProgress();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.robot = document.getElementById('robot');
        this.clickCounter = document.getElementById('clickCounter');
        this.rankBadge = document.getElementById('currentRank');
        this.rankProgress = document.getElementById('rankProgress');
        this.clickButton = document.getElementById('clickButton');
    }

    loadProgress() {
        const savedClicks = localStorage.getItem('clicks');
        if (savedClicks) {
            this.clicks = parseInt(savedClicks);
        }
    }

    setupEventListeners() {
        this.clickButton.addEventListener('click', () => this.handleClick());
    }

    handleClick() {
        this.clicks++;
        this.saveProgress();
        this.animateRobot();
        this.updateUI();
    }

    saveProgress() {
        localStorage.setItem('clicks', this.clicks.toString());
    }

    animateRobot() {
        this.robot.classList.add('jump');
        setTimeout(() => {
            this.robot.classList.remove('jump');
        }, 200);
    }

    getCurrentRank() {
        for (let i = this.ranks.length - 1; i >= 0; i--) {
            if (this.clicks >= this.ranks[i].threshold) {
                return this.ranks[i];
            }
        }
        return this.ranks[0];
    }

    getNextRank() {
        const currentRankIndex = this.ranks.findIndex(rank => rank.name === this.getCurrentRank().name);
        return this.ranks[currentRankIndex + 1] || this.ranks[currentRankIndex];
    }

    calculateProgress() {
        const currentRank = this.getCurrentRank();
        const nextRank = this.getNextRank();

        if (currentRank === nextRank) return 100;

        const progressInRank = this.clicks - currentRank.threshold;
        const rankRange = nextRank.threshold - currentRank.threshold;
        return Math.min((progressInRank / rankRange) * 100, 100);
    }

    updateUI() {
        this.clickCounter.textContent = this.clicks;
        const currentRank = this.getCurrentRank();
        this.rankBadge.textContent = currentRank.name;

        const progress = this.calculateProgress();
        this.rankProgress.style.width = `${progress}%`;

        // Update rank badge color based on rank
        const rankIndex = this.ranks.findIndex(rank => rank.name === currentRank.name);
        const colors = ['secondary', 'info', 'warning', 'primary', 'info', 'danger'];
        this.rankBadge.className = `badge bg-${colors[rankIndex]}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ClickerGame();
});