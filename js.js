const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const canvas = document.getElementById('audio-visualizer');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 100;

// Verificar compatibilidad con AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
let audioSource;

// Configurar conexión del audio
if (!audioSource) {
    audioSource = audioContext.createMediaElementSource(audioPlayer);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
}

// Configurar el espectro
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Función para dibujar el espectro
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// Botón Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioContext.resume().then(() => {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸️';
            drawVisualizer(); // Iniciar el espectro solo al reproducir
        }).catch((error) => {
            console.error('Error al reanudar el AudioContext:', error);
        });
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️';
    }
});
