document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });

    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Variable global para el índice de la imagen actual
    let currentImageIndex = 0;

    // Función para cargar los detalles del producto
    function loadProductDetails(productId) {
        const product = productData[productId];

        if (!product) {
            document.getElementById('product-details').innerHTML = '<h1>Producto no encontrado</h1>';
            console.error(`Producto con ID ${productId} no encontrado en productData`);
            return;
        }

        const productHTML = `
            <div class="product-header">
                <h1>${product.name}</h1>
                
            </div>
            
            <div class="product-content">
                <div class="product-gallery">
                    <div class="main-image-container">
                        <button class="nav-arrow prev" aria-label="Imagen anterior">&lt;</button>
                        <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="main-image">
                        <button class="nav-arrow next" aria-label="Imagen siguiente">&gt;</button>
                    </div>
                    <div class="thumbnail-gallery">
                        ${product.images.map((image, index) => `
                            <img src="${image}" alt="${product.name} - Imagen ${index + 1}" class="thumbnail" data-index="${index}">
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-info">
                    <h2>Descripción</h2>
                    <p>${product.description}</p>
                    
                    <h2>Especificaciones</h2>
                    <ul>
                        ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                    
                    <button id="find-distributor" class="btn btn-primary btn-large">Encuentra un distribuidor</button>
                    <div id="distributor-info" class="distributor-info" style="display: none;"></div>
                </div>
            </div>
        `;

        document.getElementById('product-details').innerHTML = productHTML;
        document.title = `${product.name} - Distortion`;

        // Agregar evento al botón de encontrar distribuidor
        document.getElementById('find-distributor').addEventListener('click', findDistributor);

        // Agregar eventos para la navegación de imágenes
        const prevButton = document.querySelector('.nav-arrow.prev');
        const nextButton = document.querySelector('.nav-arrow.next');
        const thumbnails = document.querySelectorAll('.thumbnail');

        prevButton.addEventListener('click', () => changeImage(-1));
        nextButton.addEventListener('click', () => changeImage(1));

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                currentImageIndex = parseInt(e.target.dataset.index);
                updateMainImage();
            });
        });

        // Función para cambiar la imagen
        function changeImage(direction) {
            currentImageIndex += direction;
            if (currentImageIndex < 0) currentImageIndex = product.images.length - 1;
            if (currentImageIndex >= product.images.length) currentImageIndex = 0;
            updateMainImage();
        }

        // Función para actualizar la imagen principal
        function updateMainImage() {
            const mainImage = document.getElementById('main-image');
            mainImage.src = product.image[currentImageIndex];
            mainImage.alt = `${product.name} - Imagen ${currentImageIndex + 1}`;

            // Actualizar la clase activa en las miniaturas
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentImageIndex);
            });
        }
    }

    // Cargar los detalles del producto
    if (productId) {
        loadProductDetails(productId);
    } else {
        document.getElementById('product-details').innerHTML = '<h1>Producto no especificado</h1>';
        console.error('No se proporcionó un ID de producto en la URL');
    
    }
});

// Función para encontrar un distribuidor
function findDistributor() {
    const distributorInfo = document.getElementById('distributor-info');
    distributorInfo.style.display = 'block';
    distributorInfo.innerHTML = '<p>Buscando distribuidores cercanos...</p>';

    // Simulamos una búsqueda de distribuidor con un retraso
    setTimeout(() => {
        const distributors = [
            { name: 'Top Music Aguascalientes', address: 'Int b Calle, Av. José María Chávez 419 B, Zona Centro, 20000 Aguascalientes, Ags.', phone: '449-123-456-7897', url: 'https://maps.app.goo.gl/wBhGvRrAmA8FeZSB7' },
        ];
        
        const distributorHTML = `
            <h3>Distribuidores cercanos:</h3>
            <ul>
                ${distributors.map(d => `
                    <li>
                        <strong>${d.name}</strong><br>
                        ${d.address}<br>
                        Tel: ${d.phone}<br>
                        <button class="btn btn-secondary" onclick="window.open('${d.url}', '_blank')">Ver en mapa</button>
                    </li>
                `).join('')}
            </ul>
        `;

        distributorInfo.innerHTML = distributorHTML;
    }, 2000); // Simulamos un retraso de 2 segundos
}
