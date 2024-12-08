let isAnimating = false;
let pullDeltaX = 0; //distancia que la carta se esta moviendo

const DECISION_THRESHOLD = 75;

function startDrag (e) {
    if (isAnimating) return;
    
  
    const actualCard = e.target.closest('article');

    if(!actualCard) return;
    const startX = e.pageX;

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    function onMove (e) {
        const currentX = e.pageX;
        isAnimating = true; 
        pullDeltaX = currentX - startX;

        if (pullDeltaX === 0) return;

        const deg = pullDeltaX / 10;
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = 'grabbing';
        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;

        const choiceEl = isRight
            ? actualCard.querySelector('.nope')
            : actualCard.querySelector('.like');

        choiceEl.style.opacity = opacity;
    }
    
    function onEnd () {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        actualCard.style.transition = 'transform 0.3s ease-in-out';
        actualCard.style.transform = 'translateX(0) rotate(0)';
        actualCard.style.cursor = 'grab';

        if (Math.abs(pullDeltaX) > DECISION_THRESHOLD) {
            const decision = pullDeltaX > 0 ? 'right' : 'left';
            actualCard.style.transform = `translateX(${decision === 'right' ? 1000 : -1000}px) rotate(${decision === 'right' ? 45 : -45}deg)`;
            setTimeout(() => {
                actualCard.remove();
                isAnimating = false;
            }, 300);
        } else {
            actualCard.style.transition = 'transform 0.3s ease-in-out';
            actualCard.style.transform = 'translateX(0) rotate(0)';
            isAnimating = false;
        }
    }
    
}

document.getElementById('dislike').addEventListener('click', () => {
    const actualCard = document.querySelector('article:last-of-type');
    actualCard.style.transition = 'transform 0.3s ease-in-out';
    actualCard.style.transform = `translateX(1000px) rotate(45deg)`;
    setTimeout(() => {
        actualCard.remove();
    }, 300);
});

document.getElementById('like').addEventListener('click', () => {
    const actualCard = document.querySelector('article:last-of-type');
    actualCard.style.transition = 'transform 0.3s ease-in-out';
    actualCard.style.transform = `translateX(-1000px) rotate(-45deg)`;
    setTimeout(() => {
        actualCard.remove();
    }, 300);
});

document.addEventListener('mousedown', startDrag);
