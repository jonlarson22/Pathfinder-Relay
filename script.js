const ring = document.getElementById('ring');
const rover = document.getElementById('rover-anchor');
const statusText = document.getElementById('status');
const hexChars = "0123456789ABCDEF".split("");

// Initialize the Hex Ring
hexChars.forEach((char, i) => {
    const angle = i * 22.5; 
    const el = document.createElement('div');
    el.className = 'hex-char';
    el.innerText = char;
    el.style.transform = `rotate(${angle}deg) translateY(-170px) rotate(-${angle}deg)`;
    ring.appendChild(el);
});

const messages = {
    north: "OTAsIDExMi41LCAyMi41LCA0NSwgNjcuNSwgOTAsIDExMi41",
    west: "MiIuNSwgMjIuNSwgMjIuNSwgMjIuNSwgNDUsIDY3LjUsIDkwLCAxMTIuNQ=="
};

let currentHeading = 0;
let cumulativeRotation = 0;
let isPlaying = false;

async function playSequence(type) {
    if (isPlaying) return;
    isPlaying = true;
    
    document.getElementById('btn-north').disabled = true;
    document.getElementById('btn-west').disabled = true;
    
    statusText.innerText = `RECEIVING ${type.toUpperCase()} DATA...`;

    // Reset rover position
    cumulativeRotation = 0;
    currentHeading = 0;
    rover.style.transform = `rotate(0deg)`;
    
    await new Promise(r => setTimeout(r, 1200));

    const sequence = atob(messages[type]).split(',').map(num => parseFloat(num.trim()));
    
    for (let target of sequence) {
        // If pointing at the same spot, do a 360 spin (the "Repeat" signal)
        if (target === currentHeading) {
            statusText.innerText = "CHARACTER REPEAT: CONFIRMING...";
            cumulativeRotation += 360;
            rover.style.transform = `rotate(${cumulativeRotation}deg)`;
            await new Promise(r => setTimeout(r, 1500));
            statusText.innerText = `RECEIVING ${type.toUpperCase()} DATA...`;
        }

        let delta = target - currentHeading;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        cumulativeRotation += delta;
        currentHeading = target;

        rover.style.transform = `rotate(${cumulativeRotation}deg)`;
        
        await new Promise(r => setTimeout(r, 2500));
    }
    
    statusText.innerText = "TRANSMISSION COMPLETE.";
    isPlaying = false;
    document.getElementById('btn-north').disabled = false;
    document.getElementById('btn-west').disabled = false;
}
