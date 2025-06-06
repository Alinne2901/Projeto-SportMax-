let currentIndex = 0; // Índice da imagem atual  
const slides = document.querySelectorAll('.image-container');  

function showSlide(index) {  
    // Oculta todas as imagens  
    slides.forEach((slide, i) => {  
        slide.classList.remove('active');  
        if (i === index) {  
            slide.classList.add('active');  
            // Acessibilidade: indica que a imagem está visível
            slide.setAttribute('aria-hidden', 'false');
        } else {
            slide.setAttribute('aria-hidden', 'true');
        }
    });  
}  

function moveSlide(step) {  
    currentIndex += step;  
    // Reseta o índice caso exceda os limites  
    if (currentIndex < 0) {  
        currentIndex = slides.length - 1; // Volta para o último slide  
    } else if (currentIndex >= slides.length) {  
        currentIndex = 0; // Retorna ao primeiro slide  
    }  
    showSlide(currentIndex);  
}

const botao = document.querySelector('.botao-menu')
const menuLateral = document.querySelector('.menu-lateral')
const conteudo = document.querySelector('.conteudo')
const background = document.querySelector('.background')

botao.addEventListener('click', () => {
    menuLateral.classList.toggle('ativo')
    botao.classList.toggle('ativo')
    conteudo.classList.toggle('ativo')
    background.classList.toggle('ativo')
    document.body.style.backgroundColor = menuLateral.classList.contains('ativo') ? '#34495e' : '#ecf0f1'
})

background.addEventListener('click', () => {
    menuLateral.classList.remove('ativo')
    botao.classList.remove('ativo')
    conteudo.classList.remove('ativo')
    background.classList.remove('ativo')
    document.body.style.backgroundColor = '#ecf0f1'
})