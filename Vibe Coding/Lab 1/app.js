// =============================================================
//  Visualizer — app.js
//  Sorting Algorithm Visualizer
// =============================================================

class SortingVisualizer {
    constructor() {
        // ── State ──
        this.array = [];
        this.arraySize = 50;
        this.speed = 5;
        this.selectedAlgo = 'bubble';
        this.isRunning = false;
        this.isPaused = false;
        this.stopFlag = false;

        // ── Stats ──
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = null;
        this.timerInterval = null;

        // ── DOM refs ──
        this.$bars = document.getElementById('barsContainer');
        this.$algo = document.getElementById('statAlgo');
        this.$comps = document.getElementById('statComparisons');
        this.$swaps = document.getElementById('statSwaps');
        this.$time = document.getElementById('statTime');
        this.$status = document.getElementById('statStatus');

        this.$sizeSlider = document.getElementById('sizeSlider');
        this.$speedSlider = document.getElementById('speedSlider');
        this.$sizeVal = document.getElementById('sizeVal');
        this.$speedVal = document.getElementById('speedVal');

        this.$startBtn = document.getElementById('startBtn');
        this.$pauseBtn = document.getElementById('pauseBtn');
        this.$resetBtn = document.getElementById('resetBtn');
        this.$generateBtn = document.getElementById('generateBtn');
        this.$themeToggle = document.getElementById('themeToggle');
        this.$sunIcon = document.getElementById('sunIcon');
        this.$moonIcon = document.getElementById('moonIcon');
        this.$soundToggle = document.getElementById('soundToggle');
        this.$soundOnIcon = document.getElementById('soundOnIcon');
        this.$soundOffIcon = document.getElementById('soundOffIcon');

        // ── Audio ──
        this.soundEnabled = true;
        this.audioCtx = null;   // lazily created on first interaction

        this._init();
    }

    // ─────────────────────────────────────────────
    //  Initialisation
    // ─────────────────────────────────────────────
    _init() {
        this._generateArray();
        this._bindEvents();
        this._highlightInfoCard('bubble');
        this.$algo.textContent = 'Bubble Sort';
    }

    // ─────────────────────────────────────────────
    //  Array
    // ─────────────────────────────────────────────
    _generateArray() {
        this.array = Array.from(
            { length: this.arraySize },
            () => Math.floor(Math.random() * 88) + 8
        );
        this._resetStats();
        this._renderBars(this.array, new Array(this.arraySize).fill('default'));
        this._setStatus('Ready', 'var(--accent)');
    }

    // ─────────────────────────────────────────────
    //  Rendering
    // ─────────────────────────────────────────────
    /**
     * Update the bar DOM efficiently.
     * @param {number[]} arr    - current values
     * @param {string[]} states - per-index state classes
     */
    _renderBars(arr, states) {
        const container = this.$bars;
        const existing = container.children;

        if (existing.length !== arr.length) {
            // Rebuild all bars
            container.innerHTML = '';
            const frag = document.createDocumentFragment();
            arr.forEach((val, i) => {
                const bar = document.createElement('div');
                bar.className = `bar ${states[i] || 'default'}`;
                bar.style.height = `${val}%`;
                frag.appendChild(bar);
            });
            container.appendChild(frag);
        } else {
            // Update in place (faster, avoids layout thrash)
            for (let i = 0; i < arr.length; i++) {
                const bar = existing[i];
                bar.style.height = `${arr[i]}%`;
                bar.className = `bar ${states[i] || 'default'}`;
            }
        }
    }

    // ─────────────────────────────────────────────
    //  Timing helpers
    // ─────────────────────────────────────────────
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Map speed 1–10 → delay in ms */
    _delay() {
        const map = {
            1: 600, 2: 300, 3: 150, 4: 75, 5: 35,
            6: 16, 7: 8, 8: 4, 9: 2, 10: 1
        };
        return map[this.speed] ?? 35;
    }

    /** Busy-wait while paused (checks every 80 ms) */
    async _waitIfPaused() {
        while (this.isPaused && !this.stopFlag) {
            await this._sleep(80);
        }
    }

    // ─────────────────────────────────────────────
    //  Stats
    // ─────────────────────────────────────────────
    _resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.$comps.textContent = '0';
        this.$swaps.textContent = '0';
        this.$time.textContent = '0.00s';
    }

    _updateStats() {
        this.$comps.textContent = this.comparisons.toLocaleString();
        this.$swaps.textContent = this.swaps.toLocaleString();
    }

    _startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const s = ((Date.now() - this.startTime) / 1000).toFixed(2);
            this.$time.textContent = `${s}s`;
        }, 50);
    }

    _stopTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    _setStatus(text, color = 'var(--accent)') {
        this.$status.textContent = text;
        this.$status.style.color = color;
    }

    // ─────────────────────────────────────────────
    //  Audio
    // ─────────────────────────────────────────────
    /**
     * Play a short tone whose pitch is proportional to the bar value.
     * @param {number} value  - bar height value (8–96)
     * @param {'compare'|'swap'} type
     */
    _beep(value, type = 'compare') {
        if (!this.soundEnabled) return;
        try {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = this.audioCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            // Map value 8–96 → frequency 180–1100 Hz
            const freq = 180 + ((value - 8) / 88) * 920;
            osc.type = type === 'swap' ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.12);
        } catch (_) { /* AudioContext blocked — silently ignore */ }
    }

    // ─────────────────────────────────────────────
    //  UI state helpers
    // ─────────────────────────────────────────────
    _setRunning() {
        this.isRunning = true;
        this.isPaused = false;
        this.$startBtn.disabled = true;
        this.$generateBtn.disabled = true;
        this.$sizeSlider.disabled = true;
        document.querySelectorAll('.algo-btn').forEach(b => (b.disabled = true));
        this.$pauseBtn.disabled = false;
        this.$pauseBtn.textContent = '⏸\u00a0 Pause';
    }

    _setIdle() {
        this.isRunning = false;
        this.isPaused = false;
        this.$startBtn.disabled = false;
        this.$generateBtn.disabled = false;
        this.$sizeSlider.disabled = false;
        document.querySelectorAll('.algo-btn').forEach(b => (b.disabled = false));
        this.$pauseBtn.disabled = true;
        this.$pauseBtn.textContent = '⏸\u00a0 Pause';
    }

    _highlightInfoCard(algo) {
        document.querySelectorAll('.info-card').forEach(c => {
            c.classList.toggle('active-card', c.dataset.for === algo);
        });
        const names = {
            bubble: 'Bubble Sort', selection: 'Selection Sort',
            insertion: 'Insertion Sort', merge: 'Merge Sort',
            quick: 'Quick Sort', heap: 'Heap Sort',
            shell: 'Shell Sort', counting: 'Counting Sort',
            radix: 'Radix Sort', cocktail: 'Cocktail Sort',
            comb: 'Comb Sort', gnome: 'Gnome Sort',
            cycle: 'Cycle Sort', oddeven: 'Odd-Even Sort',
        };
        this.$algo.textContent = names[algo] ?? '—';
    }

    // ─────────────────────────────────────────────
    //  Event bindings
    // ─────────────────────────────────────────────
    _bindEvents() {
        // Algorithm selector
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isRunning) return;
                document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedAlgo = btn.dataset.algo;
                this._highlightInfoCard(this.selectedAlgo);
            });
        });

        // Array-size slider
        this.$sizeSlider.addEventListener('input', () => {
            this.arraySize = parseInt(this.$sizeSlider.value, 10);
            this.$sizeVal.textContent = this.arraySize;
            this._generateArray();
        });

        // Speed slider (live – no regeneration needed)
        this.$speedSlider.addEventListener('input', () => {
            this.speed = parseInt(this.$speedSlider.value, 10);
            this.$speedVal.textContent = this.speed;
        });

        // Generate
        this.$generateBtn.addEventListener('click', () => {
            if (this.isRunning) return;
            this.stopFlag = true;
            this._generateArray();
        });

        // Start
        this.$startBtn.addEventListener('click', () => {
            if (this.isRunning) return;
            this.stopFlag = false;
            this._runSort();
        });

        // Pause / Resume
        this.$pauseBtn.addEventListener('click', () => {
            if (!this.isRunning) return;
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this._stopTimer();
                this.$pauseBtn.textContent = '▶\u00a0 Resume';
                this._setStatus('Paused', 'var(--bar-comparing)');
            } else {
                this._startTimer();
                this.$pauseBtn.textContent = '⏸\u00a0 Pause';
                this._setStatus('Sorting…', 'var(--bar-swapping)');
            }
        });

        // Reset
        this.$resetBtn.addEventListener('click', () => {
            this.stopFlag = true;
            this.isPaused = false;
            this._stopTimer();
            // Give the running sort a chance to exit, then clean up
            setTimeout(() => {
                this._setIdle();
                this._generateArray();
            }, 120);
        });

        // Theme toggle
        this.$themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.dataset.theme === 'dark';
            html.dataset.theme = isDark ? 'light' : 'dark';
            this.$sunIcon.classList.toggle('hidden', !isDark);
            this.$moonIcon.classList.toggle('hidden', isDark);
        });

        // Sound toggle
        this.$soundToggle.addEventListener('click', () => {
            // Resume AudioContext if suspended (required by browser autoplay policy)
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } else if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            this.soundEnabled = !this.soundEnabled;
            this.$soundOnIcon.classList.toggle('hidden', !this.soundEnabled);
            this.$soundOffIcon.classList.toggle('hidden', this.soundEnabled);
        });
    }

    // ─────────────────────────────────────────────
    //  Sort dispatcher
    // ─────────────────────────────────────────────
    async _runSort() {
        this._resetStats();
        this._setRunning();
        this._setStatus('Sorting…', 'var(--bar-swapping)');
        this._startTimer();

        const arr = [...this.array];

        try {
            switch (this.selectedAlgo) {
                case 'bubble': await this._bubbleSort(arr); break;
                case 'selection': await this._selectionSort(arr); break;
                case 'insertion': await this._insertionSort(arr); break;
                case 'merge': await this._mergeSortEntry(arr); break;
                case 'quick': await this._quickSortEntry(arr); break;
                case 'heap': await this._heapSort(arr); break;
                case 'shell': await this._shellSort(arr); break;
                case 'counting': await this._countingSort(arr); break;
                case 'radix': await this._radixSort(arr); break;
                case 'cocktail': await this._cocktailSort(arr); break;
                case 'comb': await this._combSort(arr); break;
                case 'gnome': await this._gnomeSort(arr); break;
                case 'cycle': await this._cycleSort(arr); break;
                case 'oddeven': await this._oddEvenSort(arr); break;
            }
        } catch (_) {
            // Intentional stop — do nothing
        }

        if (!this.stopFlag) {
            // Sweep all bars green
            const states = new Array(arr.length).fill('sorted');
            this._renderBars(arr, states);
            this.array = arr;
            this._setStatus('Sorted ✓', 'var(--bar-sorted)');
        }

        this._stopTimer();
        this._setIdle();
    }

    // ─────────────────────────────────────────────
    //  Bubble Sort
    // ─────────────────────────────────────────────
    async _bubbleSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[j] = 'comparing';
                states[j + 1] = 'comparing';
                this.comparisons++;
                this._beep(arr[j], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.swaps++;
                    states[j] = 'swapping';
                    states[j + 1] = 'swapping';
                    this._beep(arr[j], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    swapped = true;
                }

                states[j] = 'default';
                states[j + 1] = 'default';
            }

            states[n - 1 - i] = 'sorted';
            this._renderBars(arr, states);

            // Early exit: already sorted
            if (!swapped) {
                for (let k = 0; k <= n - 1 - i; k++) states[k] = 'sorted';
                this._renderBars(arr, states);
                return;
            }
        }

        states[0] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Selection Sort
    // ─────────────────────────────────────────────
    async _selectionSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        for (let i = 0; i < n - 1; i++) {
            if (this.stopFlag) return;

            let minIdx = i;
            states[i] = 'pivot'; // current insert position

            for (let j = i + 1; j < n; j++) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[j] = 'comparing';
                this.comparisons++;
                this._beep(arr[j], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[j] < arr[minIdx]) {
                    if (minIdx !== i) states[minIdx] = 'default';
                    minIdx = j;
                    states[minIdx] = 'swapping';
                } else {
                    states[j] = 'default';
                }
            }

            // Perform swap
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                this.swaps++;
                states[i] = 'swapping';
                states[minIdx] = 'swapping';
                this._beep(arr[i], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay() * 2);
                states[minIdx] = 'default';
            }

            states[i] = 'sorted';
            this._renderBars(arr, states);
            await this._sleep(this._delay());
        }

        states[n - 1] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Insertion Sort
    // ─────────────────────────────────────────────
    async _insertionSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        states[0] = 'sorted';

        for (let i = 1; i < n; i++) {
            if (this.stopFlag) return;

            const key = arr[i];
            let j = i - 1;

            states[i] = 'comparing';
            this._beep(arr[i], 'compare');
            this._renderBars(arr, states);
            await this._sleep(this._delay());

            while (j >= 0 && arr[j] > key) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                arr[j + 1] = arr[j];
                this.comparisons++;
                this.swaps++;
                states[j + 1] = 'swapping';
                states[j] = 'comparing';
                this._beep(arr[j + 1], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                states[j + 1] = 'default';
                j--;
            }

            arr[j + 1] = key;
            this.comparisons++; // final failed comparison

            // Mark whole sorted portion
            for (let k = 0; k <= i; k++) states[k] = 'sorted';
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay());
        }
    }

    // ─────────────────────────────────────────────
    //  Merge Sort
    // ─────────────────────────────────────────────
    async _mergeSortEntry(arr) {
        const states = new Array(arr.length).fill('default');
        await this._mergeSort(arr, 0, arr.length - 1, states);
    }

    async _mergeSort(arr, left, right, states) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);
        await this._mergeSort(arr, left, mid, states);
        if (this.stopFlag) return;
        await this._mergeSort(arr, mid + 1, right, states);
        if (this.stopFlag) return;
        await this._merge(arr, left, mid, right, states);
    }

    async _merge(arr, left, mid, right, states) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        // Highlight the two sub-arrays being merged
        for (let k = left; k <= right; k++) {
            states[k] = k <= mid ? 'comparing' : 'swapping';
        }
        this._renderBars(arr, states);
        await this._sleep(this._delay() * 1.5);

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (this.stopFlag) return;
            await this._waitIfPaused();

            this.comparisons++;

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i++];
            } else {
                arr[k] = rightArr[j++];
                this.swaps++;
            }

            states[k] = 'pivot';
            this._beep(arr[k], 'swap');
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay());
            k++;
        }

        while (i < leftArr.length) {
            if (this.stopFlag) return;
            arr[k] = leftArr[i++];
            states[k] = 'pivot';
            this._renderBars(arr, states);
            await this._sleep(Math.max(1, this._delay() / 2));
            k++;
        }

        while (j < rightArr.length) {
            if (this.stopFlag) return;
            arr[k] = rightArr[j++];
            states[k] = 'pivot';
            this._renderBars(arr, states);
            await this._sleep(Math.max(1, this._delay() / 2));
            k++;
        }

        // Mark merged segment as sorted
        for (let x = left; x <= right; x++) states[x] = 'sorted';
        this._renderBars(arr, states);
        await this._sleep(this._delay());
    }

    // ─────────────────────────────────────────────
    //  Quick Sort
    // ─────────────────────────────────────────────
    async _quickSortEntry(arr) {
        const states = new Array(arr.length).fill('default');
        await this._quickSort(arr, 0, arr.length - 1, states);
    }

    async _quickSort(arr, low, high, states) {
        if (low < high) {
            if (this.stopFlag) return;
            const pi = await this._partition(arr, low, high, states);
            if (this.stopFlag) return;
            await this._quickSort(arr, low, pi - 1, states);
            if (this.stopFlag) return;
            await this._quickSort(arr, pi + 1, high, states);
        } else if (low === high) {
            states[low] = 'sorted';
            this._renderBars(arr, states);
        }
    }

    async _partition(arr, low, high, states) {
        const pivot = arr[high];
        states[high] = 'pivot';
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (this.stopFlag) return i + 1;
            await this._waitIfPaused();

            states[j] = 'comparing';
            this.comparisons++;
            this._beep(arr[j], 'compare');
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay());

            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.swaps++;
                states[j] = 'swapping';
                if (i !== j) states[i] = 'swapping';
                this._beep(arr[i], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                if (i !== j) states[i] = 'default';
            }
            states[j] = 'default';
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.swaps++;
        states[high] = 'default';
        states[i + 1] = 'sorted';
        this._updateStats();
        this._renderBars(arr, states);
        await this._sleep(this._delay());
        return i + 1;
    }

    // ─────────────────────────────────────────────
    //  Heap Sort
    // ─────────────────────────────────────────────
    async _heapSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if (this.stopFlag) return;
            await this._heapify(arr, n, i, states);
        }

        for (let i = n - 1; i > 0; i--) {
            if (this.stopFlag) return;
            [arr[0], arr[i]] = [arr[i], arr[0]];
            this.swaps++;
            states[i] = 'sorted';
            states[0] = 'swapping';
            this._beep(arr[i], 'swap');
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay());
            states[0] = 'default';
            await this._heapify(arr, i, 0, states);
        }

        states[0] = 'sorted';
        this._renderBars(arr, states);
    }

    async _heapify(arr, n, i, states) {
        while (true) {
            let largest = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;

            states[i] = 'pivot';
            this._renderBars(arr, states);

            if (l < n) {
                if (this.stopFlag) return;
                await this._waitIfPaused();
                states[l] = 'comparing';
                this.comparisons++;
                this._beep(arr[l], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                if (arr[l] > arr[largest]) largest = l;
                states[l] = 'default';
            }

            if (r < n) {
                if (this.stopFlag) return;
                await this._waitIfPaused();
                states[r] = 'comparing';
                this.comparisons++;
                this._beep(arr[r], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                if (arr[r] > arr[largest]) largest = r;
                states[r] = 'default';
            }

            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                this.swaps++;
                states[i] = 'swapping';
                states[largest] = 'swapping';
                this._beep(arr[i], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                states[i] = 'default';
                states[largest] = 'default';
                i = largest;
            } else {
                states[i] = 'default';
                this._renderBars(arr, states);
                break;
            }
        }
    }

    // ─────────────────────────────────────────────
    //  Shell Sort
    // ─────────────────────────────────────────────
    async _shellSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                if (this.stopFlag) return;
                const temp = arr[i];
                let j = i;

                states[i] = 'comparing';
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                while (j >= gap && arr[j - gap] > temp) {
                    if (this.stopFlag) return;
                    await this._waitIfPaused();

                    arr[j] = arr[j - gap];
                    this.comparisons++;
                    this.swaps++;
                    states[j] = 'swapping';
                    states[j - gap] = 'pivot';
                    this._beep(arr[j], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());

                    states[j] = 'default';
                    states[j - gap] = 'default';
                    j -= gap;
                }

                arr[j] = temp;
                this.comparisons++;
                states[j] = 'comparing';
                this._beep(arr[j], 'compare');
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                states[j] = 'default';
            }
        }

        for (let i = 0; i < n; i++) states[i] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Counting Sort
    // ─────────────────────────────────────────────
    async _countingSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min + 1;
        const count = new Array(range).fill(0);

        // Count occurrences
        for (let i = 0; i < n; i++) {
            if (this.stopFlag) return;
            states[i] = 'comparing';
            count[arr[i] - min]++;
            this.comparisons++;
            this._beep(arr[i], 'compare');
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay());
            states[i] = 'default';
        }

        // Cumulative count
        for (let i = 1; i < range; i++) count[i] += count[i - 1];

        // Build stable output
        const output = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
            this.swaps++;
        }
        this._updateStats();

        // Write back with animation
        for (let i = 0; i < n; i++) {
            if (this.stopFlag) return;
            await this._waitIfPaused();
            arr[i] = output[i];
            states[i] = 'swapping';
            this._beep(arr[i], 'swap');
            this._renderBars(arr, states);
            await this._sleep(this._delay());
            states[i] = 'sorted';
        }
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Radix Sort (LSD, base 10)
    // ─────────────────────────────────────────────
    async _radixSort(arr) {
        const max = Math.max(...arr);
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            if (this.stopFlag) return;
            await this._radixCountingPass(arr, exp);
        }
    }

    async _radixCountingPass(arr, exp) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
            if (this.stopFlag) return;
            states[i] = 'comparing';
            count[Math.floor(arr[i] / exp) % 10]++;
            this.comparisons++;
        }
        this._updateStats();
        this._renderBars(arr, states);
        await this._sleep(this._delay() * 3);

        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        for (let i = n - 1; i >= 0; i--) {
            output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
            count[Math.floor(arr[i] / exp) % 10]--;
            this.swaps++;
        }
        this._updateStats();

        for (let i = 0; i < n; i++) {
            if (this.stopFlag) return;
            await this._waitIfPaused();
            arr[i] = output[i];
            states[i] = 'swapping';
            this._beep(arr[i], 'swap');
            this._renderBars(arr, states);
            await this._sleep(this._delay());
            states[i] = 'default';
        }
    }

    // ─────────────────────────────────────────────
    //  Cocktail Shaker Sort
    // ─────────────────────────────────────────────
    async _cocktailSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        let swapped = true;
        let start = 0;
        let end = n - 1;

        while (swapped) {
            swapped = false;

            // Forward pass
            for (let i = start; i < end; i++) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                states[i + 1] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    this.swaps++;
                    states[i] = 'swapping';
                    states[i + 1] = 'swapping';
                    this._beep(arr[i], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    swapped = true;
                }
                states[i] = 'default';
                states[i + 1] = 'default';
            }

            states[end] = 'sorted';
            end--;
            if (!swapped) break;
            swapped = false;

            // Backward pass
            for (let i = end - 1; i >= start; i--) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                states[i + 1] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    this.swaps++;
                    states[i] = 'swapping';
                    states[i + 1] = 'swapping';
                    this._beep(arr[i], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    swapped = true;
                }
                states[i] = 'default';
                states[i + 1] = 'default';
            }

            states[start] = 'sorted';
            start++;
        }

        for (let i = start; i <= end; i++) states[i] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Comb Sort
    // ─────────────────────────────────────────────
    async _combSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        let gap = n;
        const shrink = 1.3;
        let sorted = false;

        while (!sorted) {
            gap = Math.floor(gap / shrink);
            if (gap <= 1) { gap = 1; sorted = true; }

            for (let i = 0; i + gap < n; i++) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                states[i + gap] = 'pivot';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] > arr[i + gap]) {
                    [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                    this.swaps++;
                    states[i] = 'swapping';
                    states[i + gap] = 'swapping';
                    this._beep(arr[i], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    sorted = false;
                }
                states[i] = 'default';
                states[i + gap] = 'default';
            }
        }

        for (let i = 0; i < n; i++) states[i] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Gnome Sort
    // ─────────────────────────────────────────────
    async _gnomeSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        let i = 0;

        while (i < n) {
            if (this.stopFlag) return;
            await this._waitIfPaused();

            if (i === 0 || arr[i] >= arr[i - 1]) {
                states[i] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                states[i] = 'default';
                i++;
            } else {
                states[i] = 'swapping';
                states[i - 1] = 'swapping';
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                this.swaps++;
                this.comparisons++;
                this._beep(arr[i - 1], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());
                states[i] = 'default';
                states[i - 1] = 'default';
                i--;
            }
        }

        for (let k = 0; k < n; k++) states[k] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Cycle Sort
    // ─────────────────────────────────────────────
    async _cycleSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');

        for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
            if (this.stopFlag) return;

            let item = arr[cycleStart];
            let pos = cycleStart;

            states[cycleStart] = 'pivot';
            this._renderBars(arr, states);

            for (let i = cycleStart + 1; i < n; i++) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] < item) pos++;
                states[i] = 'default';
            }

            if (pos === cycleStart) {
                states[cycleStart] = 'sorted';
                this._renderBars(arr, states);
                continue;
            }

            while (item === arr[pos]) pos++;

            [arr[pos], item] = [item, arr[pos]];
            this.swaps++;
            states[pos] = 'swapping';
            states[cycleStart] = 'swapping';
            this._beep(arr[pos], 'swap');
            this._updateStats();
            this._renderBars(arr, states);
            await this._sleep(this._delay() * 2);
            states[pos] = 'default';

            while (pos !== cycleStart) {
                if (this.stopFlag) return;

                pos = cycleStart;
                for (let i = cycleStart + 1; i < n; i++) {
                    if (this.stopFlag) return;
                    await this._waitIfPaused();

                    states[i] = 'comparing';
                    this.comparisons++;
                    this._beep(arr[i], 'compare');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());

                    if (arr[i] < item) pos++;
                    states[i] = 'default';
                }

                while (item === arr[pos]) pos++;

                [arr[pos], item] = [item, arr[pos]];
                this.swaps++;
                states[pos] = 'swapping';
                this._beep(arr[pos], 'swap');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay() * 2);
                states[pos] = 'default';
            }

            states[cycleStart] = 'sorted';
            this._renderBars(arr, states);
        }

        states[n - 1] = 'sorted';
        this._renderBars(arr, states);
    }

    // ─────────────────────────────────────────────
    //  Odd-Even Sort
    // ─────────────────────────────────────────────
    async _oddEvenSort(arr) {
        const n = arr.length;
        const states = new Array(n).fill('default');
        let sorted = false;

        while (!sorted) {
            sorted = true;

            // Odd-indexed pairs: (1,2), (3,4), …
            for (let i = 1; i < n - 1; i += 2) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                states[i + 1] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    this.swaps++;
                    states[i] = 'swapping';
                    states[i + 1] = 'swapping';
                    this._beep(arr[i], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    sorted = false;
                }
                states[i] = 'default';
                states[i + 1] = 'default';
            }

            // Even-indexed pairs: (0,1), (2,3), …
            for (let i = 0; i < n - 1; i += 2) {
                if (this.stopFlag) return;
                await this._waitIfPaused();

                states[i] = 'comparing';
                states[i + 1] = 'comparing';
                this.comparisons++;
                this._beep(arr[i], 'compare');
                this._updateStats();
                this._renderBars(arr, states);
                await this._sleep(this._delay());

                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    this.swaps++;
                    states[i] = 'swapping';
                    states[i + 1] = 'swapping';
                    this._beep(arr[i], 'swap');
                    this._updateStats();
                    this._renderBars(arr, states);
                    await this._sleep(this._delay());
                    sorted = false;
                }
                states[i] = 'default';
                states[i + 1] = 'default';
            }
        }

        for (let i = 0; i < n; i++) states[i] = 'sorted';
        this._renderBars(arr, states);
    }
}

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => new SortingVisualizer());
