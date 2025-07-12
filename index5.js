document.addEventListener('DOMContentLoaded', () => {
    // H1
    const nuevoH1 = document.createElement('h1');
    nuevoH1.textContent = 'FIN DEL JUEGO';
    nuevoH1.classList.add('mover-desde-abajo');
    document.getElementById('titulo').appendChild(nuevoH1);

    // Forzar reflow del H1
    void nuevoH1.offsetWidth;

    // Activar transición del H1
    nuevoH1.classList.add('mostrar');

    // Sección
    const section = document.querySelector('.section');
    section.classList.add('aparece-desde-abajo');

    // Forzar reflow de la sección
    void section.offsetWidth;

    setTimeout(() => {
        // Activar transición de la sección
        section.classList.add('mostrar-resultado');
    }, 1000);

    //Ranking
    const ranking = document.querySelector('.ranking');
    section.classList.add('aparece-desde-abajo');

    // Forzar reflow del ranking
    void section.offsetWidth;

    setTimeout(() => {
        // Activar transición de la sección
     ranking.classList.add('mostrar-ranking');
    }, 1500);
});

