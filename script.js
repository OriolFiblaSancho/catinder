let isAnimating = false;
let pullDeltaX = 0; //distancia que la carta se esta moviendo

const DECISION_THRESHOLD = 75;

function startDrag (e) {
    if (isAnimating) return;
    
    // Determinar si es un evento táctil o de ratón
    const isTouchEvent = e.type.includes('touch');
    const pageX = isTouchEvent ? e.touches[0].pageX : e.pageX;
    
    const actualCard = e.target.closest('article');
    if(!actualCard) return;
    
    const startX = pageX;

    if (isTouchEvent) {
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    } else {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
    }

    function onMove (e) {
        // Prevenir desplazamiento de página al deslizar en táctil
        if (e.type.includes('touch')) {
            e.preventDefault();
        }
        
        const currentX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        isAnimating = true; 
        pullDeltaX = currentX - startX;

        if (pullDeltaX === 0) return;

        const deg = pullDeltaX / 10;
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = 'grabbing';
        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;

        const choiceEl = isRight
            ? actualCard.querySelector('.like')
            : actualCard.querySelector('.nope');

        choiceEl.style.opacity = opacity;
    }
    
    function onEnd () {
        if (isTouchEvent) {
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        } else {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
        }

        actualCard.style.transition = 'transform 0.3s ease-in-out';
        
        if (Math.abs(pullDeltaX) > DECISION_THRESHOLD) {
            const decision = pullDeltaX > 0 ? 'right' : 'left';
            actualCard.style.transform = `translateX(${decision === 'right' ? 1000 : -1000}px) rotate(${decision === 'right' ? 45 : -45}deg)`;
            setTimeout(() => {
                actualCard.remove();
                isAnimating = false;
                
                // Verificar si ya no hay más tarjetas
                checkEmptyCards();
            }, 300);
        } else {
            actualCard.style.transition = 'transform 0.3s ease-in-out';
            actualCard.style.transform = 'translateX(0) rotate(0)';
            
            // Resetear la opacidad de los indicadores
            const likeEl = actualCard.querySelector('.like');
            const nopeEl = actualCard.querySelector('.nope');
            if (likeEl) likeEl.style.opacity = 0;
            if (nopeEl) nopeEl.style.opacity = 0;
            
            isAnimating = false;
        }
    }
}

// Función para verificar si no hay más tarjetas
function checkEmptyCards() {
    const remainingCards = document.querySelectorAll('.cats article');
    if (remainingCards.length === 0) {
        const endMessage = document.getElementById('end');
        if (endMessage) {
            endMessage.style.display = 'flex';
        }
    }
}

document.getElementById('dislike').addEventListener('click', () => {
    const actualCard = document.querySelector('.cats article:last-of-type');
    if (!actualCard || isAnimating) return;
    
    isAnimating = true;
    actualCard.style.transition = 'transform 0.3s ease-in-out';
    actualCard.style.transform = `translateX(-1000px) rotate(-45deg)`;
    setTimeout(() => {
        actualCard.remove();
        isAnimating = false;
        checkEmptyCards();
    }, 300);
});

document.getElementById('like').addEventListener('click', () => {
    const actualCard = document.querySelector('.cats article:last-of-type');
    if (!actualCard || isAnimating) return;
    
    isAnimating = true;
    actualCard.style.transition = 'transform 0.3s ease-in-out';
    actualCard.style.transform = `translateX(1000px) rotate(45deg)`;
    setTimeout(() => {
        actualCard.remove();
        isAnimating = false;
        checkEmptyCards();
    }, 300);
});

// Eventos de ratón
document.addEventListener('mousedown', startDrag);

// Eventos táctiles
document.addEventListener('touchstart', startDrag, { passive: true });
