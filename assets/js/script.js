document.addEventListener("DOMContentLoaded", function() {
    // URLs de las hojas de Google Sheets en formato CSV
    const sheetUrls = {
        box: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXUiOpycPuiFCX0kRlsEwoT_GIM2aJA3Duk1m_NSqvM0paVMVQF26Cfjz1WnuSs-WHD95WRao0lZ2l/pub?gid=0&single=true&output=csv",
        otros: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXUiOpycPuiFCX0kRlsEwoT_GIM2aJA3Duk1m_NSqvM0paVMVQF26Cfjz1WnuSs-WHD95WRao0lZ2l/pub?gid=1611361910&single=true&output=csv"
    };

    // Elementos de la ventana modal
    const productModal = document.getElementById("product-modal");
    const modalImage = document.getElementById("modal-image");
    const modalName = document.getElementById("modal-name");
    const modalDescription = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const contactButton = document.getElementById("contact-button");
    const closeModal = document.querySelector(".close");
    const filterButtons = document.querySelectorAll(".filter-button");
    
    // Variables para almacenar los datos de los productos
    let boxProducts = [];
    let otrosProducts = [];

    // Función para cargar datos desde Google Sheets
    function loadProducts(sheetUrl, callback) {
        fetch(sheetUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split("\n").slice(1);
                const products = rows.map(row => {
                    const columns = row.split(",");
                    return {
                        name: columns[0],
                        price: columns[1],
                        image: columns[2],
                        description: columns[3]
                    };
                });
                callback(products);
            })
            .catch(error => console.error("Error al cargar los datos:", error));
    }

     filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("selected")); // Desmarcar todos los botones
            button.classList.add("selected"); // Marcar el botón seleccionado
        });
    });

    // Marcar el primer botón por defecto
    document.getElementById("filter-box").classList.add("selected");

    // Función para mostrar los productos en el DOM
    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Limpiar lista de productos

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">${product.price}</span>
                </div>
            `;

            productCard.addEventListener("click", () => {
                modalImage.src = product.image;
                modalName.textContent = product.name;
                modalDescription.textContent = product.description;
                modalPrice.textContent = `Precio: ${product.price}`;
                contactButton.href = `https://wa.me/5492615707910?text=Hola,%20me%20interesa%20el%20${product.name}`;
                productModal.style.display = "block";
                whatsappButton.style.display = 'none';
            });

            productList.appendChild(productCard);
        });
    }

    // Cargar productos de ambas hojas de cálculo
    loadProducts(sheetUrls.box, products => {
        boxProducts = products;
        displayProducts(boxProducts); // Mostrar productos de "box" por defecto
    });
    loadProducts(sheetUrls.otros, products => {
        otrosProducts = products;
    });

    // Manejar cambio de categoría
    document.getElementById("filter-box").addEventListener("click", () => displayProducts(boxProducts));
    document.getElementById("filter-otros").addEventListener("click", () => displayProducts(otrosProducts));
    document.getElementById("filter-all").addEventListener("click", () => displayProducts([...boxProducts, ...otrosProducts]));

    // Cerrar la ventana modal cuando se hace clic en la "x"
    closeModal.onclick = function() {
        productModal.style.display = "none";
        whatsappButton.style.display = 'flex';
        checkButtonVisibility();
    }

    // Cerrar la ventana modal cuando se hace clic fuera del contenido de la modal
    window.onclick = function(event) {
        if (event.target == productModal) {
            productModal.style.display = "none";
            whatsappButton.style.display = 'flex';
            checkButtonVisibility();
        }
    }

    // Funcionalidad del carrusel automático con transición suave
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos

    showSlide(currentSlide); // Muestra la primera imagen inicialmente

    // Botón de WhatsApp flotante
    const whatsappButton = document.getElementById('whatsapp-float');
    const footer = document.querySelector('footer');

    // Función para verificar si el botón debe mostrarse o no
    function checkButtonVisibility() {
        const footerRect = footer.getBoundingClientRect();
        const footerVisible = (footerRect.top < window.innerHeight) && (footerRect.bottom >= 0);

        if (footerVisible) {
            whatsappButton.style.display = 'none';
        } else {
            whatsappButton.style.display = 'flex';
        }
    }

    window.addEventListener('scroll', checkButtonVisibility);
    checkButtonVisibility();
});
