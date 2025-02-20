class ClickerGame {
    constructor() {
        this.clicks = 0;
        this.ranks = [
            { name: 'Bronze beater', threshold: 0 },
            { name: 'Silver stroker', threshold: 1000 },
            { name: 'Golden gooner', threshold: 2000 },
            { name: 'Platinum puller', threshold: 5000 },
            { name: 'Emerald edger', threshold: 8000 },
            { name: 'Grandmaster baiter', threshold: 10000 }
        ];

        this.initializeElements();
        if (this.isValidSetup()) {
            this.loadProgress();
            this.setupEventListeners();
            this.updateUI();
        }
    }

    initializeElements() {
        this.robot = document.getElementById('robot');
        this.clickCounter = document.getElementById('clickCounter');
        this.rankBadge = document.getElementById('currentRank');
        this.rankProgress = document.getElementById('rankProgress');
        this.clickButton = document.getElementById('clickButton');
    }

    isValidSetup() {
        if (!this.robot || !this.clickCounter || !this.rankBadge || !this.rankProgress || !this.clickButton) {
            console.error("❌ ERROR: One or more game elements are missing! Check your HTML IDs.");
            return false;
        }
        return true;
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
        if (this.robot) {
            this.robot.classList.add('jump');
            setTimeout(() => {
                this.robot.classList.remove('jump');
            }, 200);
        }
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
        return this.ranks[currentRankIndex + 1] || null;
    }

    calculateProgress() {
        const currentRank = this.getCurrentRank();
        const nextRank = this.getNextRank();

        if (!nextRank) return 100;

        const progressInRank = this.clicks - currentRank.threshold;
        const rankRange = nextRank.threshold - currentRank.threshold;
        return Math.min((progressInRank / rankRange) * 100, 100);
    }

    updateUI() {
        if (this.clickCounter) {
            this.clickCounter.textContent = this.clicks;
        }

        const currentRank = this.getCurrentRank();
        if (this.rankBadge) {
            this.rankBadge.textContent = currentRank.name;
        }

        const progress = this.calculateProgress();
        if (this.rankProgress) {
            this.rankProgress.style.width = `${progress}%`;
        }

        this.updateRankBadgeColor(currentRank);
    }

    updateRankBadgeColor(currentRank) {
        if (!this.rankBadge) return;

        const rankIndex = this.ranks.findIndex(rank => rank.name === currentRank.name);
        const colors = ['secondary', 'info', 'warning', 'primary', 'success', 'danger'];

        // Remove existing bg- classes
        this.rankBadge.classList.forEach(cls => {
            if (cls.startsWith('bg-')) {
                this.rankBadge.classList.remove(cls);
            }
        });

        this.rankBadge.classList.add(`bg-${colors[rankIndex]}`);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ClickerGame();
});
