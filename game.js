document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Definición de la palabra y el contenedor ---
    let palabras = ["GUARDAR", "JUSTIFICAR", "ESPACIADO", "SANGRIA"];
    let palabraParaAdivinar = "";
    const wordContainer = document.getElementById('word-blanks');
    const keyboardContainer = document.getElementById('keyboard-container'); // Nuevo selector

    pActual = Math.floor(Math.random() * palabras.length);
    palabraParaAdivinar = palabras[pActual];
    const imagenActual = document.getElementById("hint-image"); // Obteniendo el id de la imagen
    // Cambiar la imagen segun la palabra
    switch (palabraParaAdivinar) {
        case "GUARDAR":
            imagenActual.src = "./images/guardar.jpg";
            break
        case "JUSTIFICAR":
            imagenActual.src = "./images/justificar.jpg";
            break
        case "ESPACIADO":
            imagenActual.src = "./images/espaciado.jpg";
            break
        case "SANGRIA":
            imagenActual.src = "./images/sangria.jpg";
            break
        default:
            imagenActual.src = "";
    }

    // --- 2. Función para mostrar la palabra con pistas ---
    function mostrarPalabraConPistas(palabra) {
        // Limpia cualquier contenido anterior
        wordContainer.innerHTML = '';

        const letras = palabra.toUpperCase().split('');

        // --- NUEVO: Lógica para determinar cuántas pistas mostrar ---
        const numeroDePistas = palabra.length <= 5 ? 2 : 3;
        const indicesDePistas = new Set(); // Usamos un Set para evitar índices repetidos

        // Generamos índices aleatorios únicos para las pistas
        while (indicesDePistas.size < numeroDePistas) {
            const indiceAleatorio = Math.floor(Math.random() * letras.length);
            indicesDePistas.add(indiceAleatorio);
        }
        
        // --- MODIFICADO: Creamos los elementos <span> con la lógica de pistas ---
        letras.forEach((letra, index) => {
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter-slot');
            
            // Si el índice actual está en nuestro conjunto de pistas, mostramos la letra
            if (indicesDePistas.has(index)) {
                letterElement.textContent = letra;
            } else {
                // De lo contrario, lo dejamos vacío
                letterElement.textContent = '';
            }

            // Guardamos la letra correcta en un atributo data para futuras comprobaciones
            letterElement.setAttribute('data-letra', letra);

            wordContainer.appendChild(letterElement);
        });
    }

    // --- NUEVO: 3. Función para generar el teclado ---
    function generarTeclado() {
        // Limpiamos el contenedor por si acaso
        keyboardContainer.innerHTML = '';

        // Definimos todas las letras que queremos en el teclado
        const letras = 'QWERTYUIOPASDFGHJKLZXCVBNM';

        // Creamos un botón por cada letra
        letras.split('').forEach(letra => {
            const keyButton = document.createElement('div');
            keyButton.classList.add('key');
            keyButton.textContent = letra;
            
            // Asignamos un atributo 'data-key' para identificar la letra fácilmente
            keyButton.setAttribute('data-key', letra);
            keyButton.draggable = true;
            keyboardContainer.appendChild(keyButton);
        });
    }
    
            function inicializarJuego() {
                mostrarPalabra(palabraParaAdivinar);
                generarTeclado();
                // --- SOPORTE PARA FUNCIONABILIDAD EN MOVILES Y ESCRITORIO ---

                // 1. Hacemos que el teclado sea un grupo de elementos arrastrables
                new Sortable(keyboardContainer, {
                    group: 'shared', // Permite arrastrar entre este y otros grupos con el mismo nombre
                    animation: 150
                });

                // 2. Hacemos que los espacios de la palabra también sean un grupo
                new Sortable(wordContainer, {
                    group: 'shared',
                    animation: 150,
                    // Evento que se dispara cuando se añade un elemento a este contenedor
                    onAdd: function (evt) {
                        const droppedKey = evt.item; // El elemento (tecla) que se soltó
                        const targetSlot = evt.to.children[evt.newIndex]; // El espacio donde se soltó

                        const droppedLetter = droppedKey.getAttribute('data-key');
                        const correctLetter = targetSlot.getAttribute('data-correct-letter');

                        // Comprobación de la letra
                        if (droppedLetter === correctLetter) {
                            // Si es correcto, reemplazamos el espacio vacío por la tecla
                            targetSlot.parentNode.replaceChild(droppedKey, targetSlot);
                            droppedKey.classList.add('correct');
                            // Lo convertimos en un slot lleno para que no se pueda mover más
                            droppedKey.classList.replace('key', 'letter-slot');
                            droppedKey.classList.add('filled');
                        } else {
                            // Si es incorrecto, devolvemos la tecla a su origen (el teclado)
                            keyboardContainer.appendChild(droppedKey);
                        }
                    }
                });
            }

    // --- 4. Inicialización del juego ---
    inicializarJuego();

});


