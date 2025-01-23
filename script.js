document.querySelectorAll('a.scroll-btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
const clickSound = new Audio('data/click.mp3');

document.getElementById('timeline').addEventListener('click', function () {
    clickSound.play();
});
