class Player {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentSongId = null;
        this.isShuffled = false;
        this.isRepeating = false;
        this.volume = 1;
        this.hasUserInteracted = false;
        document.addEventListener('click', this.handleFirstInteracton.bind(this));
        this.initializeElements();
        this.initializeEventListeners();
        this.loadLastPlayedSong();
    }

    handleFirstInteracton() {
        this.hasUserInteracted = true;
        document.removeEventListener('click', this.handleFirstInteracton.bind(this));
    }

    initializeElements() {
        // Controls
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.repeatBtn = document.getElementById('repeat-btn');
        
        // Sliders
        this.progressSlider = document.getElementById('progress-slider');
        this.volumeSlider = document.getElementById('volume-slider');
        
        // Info elements
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.songImageEl = document.getElementById('current-song-image');
        this.songNameEl = document.getElementById('current-song-name');
        this.songArtistEl = document.getElementById('current-song-artist');
    }

    initializeEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        this.volumeSlider.addEventListener('input', (e) => {
            const volumeLevel = e.target.value;
            this.volume = volumeLevel / 100;
            if (this.currentAudio) {
                this.currentAudio.volume = this.volume;
            }
            
            // Update volume icon
            const volumeIcon = document.getElementById('volume-icon');
            if (volumeLevel == 0) {
                volumeIcon.className = 'bi bi-volume-mute-fill';
            } else if (volumeLevel <= 25) {
                volumeIcon.className = 'bi bi-volume-off-fill';
            } else if (volumeLevel <= 75) {
                volumeIcon.className = 'bi bi-volume-down-fill';
            } else {
                volumeIcon.className = 'bi bi-volume-up-fill';
            }
            
            saveToLocalStorage('volume', this.volume);
        });
        
        this.progressSlider.addEventListener('input', (e) => {
            if (this.currentAudio) {
                const time = (e.target.value / 100) * this.currentAudio.duration;
                this.currentAudio.currentTime = time;
            }
        });

        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            if (this.currentAudio) {
                this.currentAudio.volume = this.volume;
            }
            saveToLocalStorage('volume', this.volume);
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    loadLastPlayedSong() {
        const lastSongId = getFromLocalStorage('currentlyPlaying');
        const wasPlaying = getFromLocalStorage('songPlaying');
        const lastTime = getFromLocalStorage('songPlayingTime') || 0;
        
        if (lastSongId && wasPlaying) {
            this.playSong(lastSongId, lastTime);
        }
        
        // Restore volume
        const savedVolume = getFromLocalStorage('volume') || 1;
        this.volume = savedVolume;
        this.volumeSlider.value = savedVolume * 100;

        const volumeLevel = savedVolume * 100;
        const volumeIcon = document.getElementById('volume-icon');
        
        if (volumeLevel == 0) {
            volumeIcon.className = 'bi bi-volume-mute-fill';
        } else if (volumeLevel <= 25) {
            volumeIcon.className = 'bi bi-volume-off-fill';
        } else if (volumeLevel <= 75) {
            volumeIcon.className = 'bi bi-volume-down-fill';
        } else {
            volumeIcon.className = 'bi bi-volume-up-fill';
        }
    }

    updatePlayerInfo(songData) {
        this.songImageEl.src = songData.image;
        this.songNameEl.textContent = songData.title;
        this.songArtistEl.textContent = songData.artist;
    }

    playSong(id, startTime = 0) {
        if(!this.hasUserInteracted) {
            document.addEventListener('click', () => {
                this.hasUserInteracted = true;
                this.playSong(id, startTime);
            }, { once: true });
            return;
        }
    
        const songData = songs_data[id - 1];
        if (!songData) return;

        document.title = `${songData.title} - Spotify (Clone)`;
    
        // Update carousel image
        const playingSongImage = document.getElementById('playing-song-image');
        if (playingSongImage) {
            playingSongImage.src = songData.image;
            // Activate the second carousel item
            const carousel = new bootstrap.Carousel(document.getElementById('carrouselSlide'));
            carousel.to(1);
        }
    
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
    
        this.currentSongId = id;
        this.currentAudio = new Audio(songData.audio);
        this.currentAudio.volume = this.volume;
        
        this.currentAudio.addEventListener('loadedmetadata', () => {
            this.currentAudio.currentTime = startTime;
            this.durationEl.textContent = this.formatTime(this.currentAudio.duration);
            this.currentAudio.play();
            this.isPlaying = true;
            this.playBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
        });

        this.currentAudio.addEventListener('timeupdate', () => {
            this.currentTimeEl.textContent = this.formatTime(this.currentAudio.currentTime);
            this.progressSlider.value = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
        });

        this.currentAudio.addEventListener('ended', () => {
            if (this.isRepeating) {
                this.playSong(this.currentSongId);
            } else {
                this.playNext();
            }
        });

        this.updatePlayerInfo(songData);
        saveToLocalStorage('currentlyPlaying', id);
        saveToLocalStorage('songPlaying', true);
    }

    togglePlay() {
        if (!this.currentAudio) return;
        
        if (this.isPlaying) {
            this.currentAudio.pause();
            this.playBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
        } else {
            this.currentAudio.play();
            this.playBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
        }
        
        this.isPlaying = !this.isPlaying;
        saveToLocalStorage('songPlaying', this.isPlaying);
    }

    playNext() {
        if (!this.currentSongId) return;
        
        let nextId;
        if (this.isShuffled) {
            nextId = Math.floor(Math.random() * songs_data.length) + 1;
        } else {
            nextId = this.currentSongId % songs_data.length + 1;
        }
        
        this.playSong(nextId);
    }

    playPrevious() {
        if (!this.currentSongId) return;
        
        let prevId;
        if (this.isShuffled) {
            prevId = Math.floor(Math.random() * songs_data.length) + 1;
        } else {
            prevId = (this.currentSongId - 2 + songs_data.length) % songs_data.length + 1;
        }
        
        this.playSong(prevId);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('text-success');
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.repeatBtn.classList.toggle('text-success');
    }
    async getAudioDuration(audioUrl) {
        return new Promise((resolve) => {
            const audio = new Audio(audioUrl);
            audio.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            });
        });
    }
}