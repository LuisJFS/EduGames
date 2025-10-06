document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Definición de la palabra y el contenedor ---
    let palabras = ["GUARDAR", "JUSTIFICAR", "ESPACIADO", "SANGRIA"];
    let palabraParaAdivinar = "";
    const wordContainer = document.getElementById('word-blanks');
    const keyboardContainer = document.getElementById('keyboard-container'); // Nuevo selector

    pActual = Math.floor(Math.random() * palabras.length);
    palabraParaAdivinar = palabras[pActual];

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
            const letterElement = document.createElement('span');
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
            const keyButton = document.createElement('button');
            keyButton.classList.add('key');
            keyButton.textContent = letra;
            
            // Asignamos un atributo 'data-key' para identificar la letra fácilmente
            keyButton.setAttribute('data-key', letra);
            keyButton.draggable = true;
            keyboardContainer.appendChild(keyButton);
        });
    }

    // --- NUEVO: Función para activar la funcionalidad Drag & Drop ---
    function activarDragAndDrop() {
        const keys = document.querySelectorAll('.key');
        const slots = document.querySelectorAll('.letter-slot');

        // 1. Eventos para las teclas arrastrables
        keys.forEach(key => {
            key.addEventListener('dragstart', (event) => {
                // Guardamos la letra que se está arrastrando
                event.dataTransfer.setData('text/plain', key.getAttribute('data-key'));
                // Añadimos un estilo visual a la tecla que se arrastra
                setTimeout(() => key.classList.add('dragging'), 0);
            });

            key.addEventListener('dragend', () => {
                 // Limpiamos el estilo visual cuando se suelta
                key.classList.remove('dragging');
            });
        });

        // 2. Eventos para los espacios (zonas de destino)
        slots.forEach(slot => {
            // Solo los espacios vacíos pueden ser zonas de destino
            if (slot.textContent === '') {
                slot.addEventListener('dragover', (event) => {
                    event.preventDefault(); // Permite que se pueda soltar aquí
                    slot.classList.add('drag-over');
                });

                slot.addEventListener('dragleave', () => {
                    slot.classList.remove('drag-over'); // Quita el resaltado al salir
                });

                slot.addEventListener('drop', (event) => {
                    event.preventDefault(); // Evita comportamiento por defecto del navegador
                    slot.classList.remove('drag-over');
                                    
                    const draggedLetter = event.dataTransfer.getData('text/plain');
                    const correctLetter = slot.getAttribute('data-letra');

                    // 3. Comprobar si la letra es correcta
                    if (draggedLetter === correctLetter) {
                        slot.textContent = correctLetter;
                        slot.classList.add('correct');
                                    
                        // Deshabilitar la tecla del teclado que se usó
                        const keyButton = document.querySelector(`.key[data-key='${draggedLetter}']`);
                        if (keyButton) {
                            keyButton.disabled = true;
                        }
                        // Ya no se puede soltar nada más en este espacio
                        slot.removeEventListener('dragover', arguments.callee);
                    } else {
                        // Opcional: Añadir efecto si la letra es incorrecta (ej. un shake)
                        slot.classList.add('incorrect');
                    }
                });
            }
        });
    }


    // --- 4. Inicialización del juego ---
    mostrarPalabraConPistas(palabraParaAdivinar);
    generarTeclado(); // Llamamos a la nueva función
    activarDragAndDrop(); // Llamamos a la nueva función
});