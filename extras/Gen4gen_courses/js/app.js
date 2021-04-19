const db = firebase.firestore();

//Escritura a Firestore
function guardar(){
    db.collection('cursos').doc().set({
        cursoAutor: 'ErosMlima',
        cursoNombre: 'Clases de guitarra avanzado 2',
        cursoValor: 20,
        cursoCalificacion:4,
        cursoImagen: 'img/curso3.jpg'
    
    })
}
//guardar();

const container = document.getElementById('container-courses');
//cache sin conexion
var getOptions = {
    source: 'cache'
};

//all data from firestore
function traerDatos(){
    
    db.collection("cursos").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            container.innerHTML += `
            <div class='four columns content-box'>
                <div class='card'>
                    <img src='${doc.data().cursoImagen}' class='imagen-curso u-full-width' id='img-curso'>
                    <div class='info-card'>
                        <div class='card-styles'>
                            <h4 id='nombre-curso'>${doc.data().cursoNombre}</h4>
                            <p class='autor-curso'>${doc.data().cursoAutor}</p>
                            <p class='estrellas-curso' id='calificacion-curso'><span>${doc.data().cursoCalificacion} </span> Estrellas</p>
                            <p class='precio' id='precio-curso'>$${doc.data().cursoValor}  <span class='u-pull-right'>$15</span></p>
                        </div>
                            <a href='#' class='u-full-width button-primary button input agregar-carrito' data-id='${doc.id}'>Agregar Al Carrito</a>
                    </div>
                </div>
            </div>`;
            // doc.data() is never undefined for query doc snapshots data().recursodefirestore
            // console.log( doc.data());
        });
    });
}


//buscamos todo o lo que quiera ver el user
function validarform() {
    var x = document.forms["buscarform"]["search"].value;

    if (x !== "") {
        //NO SIRVEEEEEE
        let search = db.collection("cursos").where("cursoNombre", "==", x)
        console.log(search.get());
        search.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                container.innerHTML += `
                <div class='four columns content-box'>
                    <div class='card'>
                        <img src='${doc.data().cursoImagen}' class='imagen-curso u-full-width' id='img-curso'>
                        <div class='info-card'>
                            <div class='card-styles'>
                                <h4 id='nombre-curso'>${doc.data().cursoNombre}</h4>
                                <p class='autor-curso'>${doc.data().cursoAutor}</p>
                                <p class='estrellas-curso' id='calificacion-curso'><span>${doc.data().cursoCalificacion} </span> Estrellas</p>
                                <p class='precio' id='precio-curso'>$${doc.data().cursoValor}  <span class='u-pull-right'>$15</span></p>
                            </div>
                                <a href='#' class='u-full-width button-primary button input agregar-carrito' data-id='${doc.id}'>Agregar Al Carrito</a>
                        </div>
                    </div>
                </div>`;
                });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

       return false;
    }else{
        
        return false;
    }
}

//buscar


//variables 
const carrito =document.querySelector('#carrito');
const contenedor_carrito =document.querySelector('#lista-carrito tbody');
const vaciar_carrito = document.querySelector('#vaciar-carrito');
const lista_cursos = document.querySelector('#lista-cursos');
let articulosCarritoParseString;
let articulosCarrito = [];

cargarEventListener();

function cargarEventListener(){
    //gatilla on click pero mas complicado :v
    lista_cursos.addEventListener('click',agregarCurso);
    carrito.addEventListener('click', eliminarCurso);
    //mandamos a llamar local storage
    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('Carrito')) || [];
        traerDatos();
        llenarCarrito();
    });

    vaciar_carrito.addEventListener('click', ()=>{
        articulosCarrito = []; // reset carro

        limpiarTbody();
    });
}

function agregarCurso(e){
    if(e.target.classList.contains('agregar-carrito')){
        e.preventDefault();
        //console.log("agregado");

        const cursoSeleccionado = e.target.parentElement.parentElement;
        //console.log(cursoSeleccionado);
        leerCurso(cursoSeleccionado);
    }
}

//lee el contenido html del curso pinchado
function leerCurso(curso){
   
    const infoCurso = {
        id: curso.querySelector('a').getAttribute('data-id'),
        imagen: curso.querySelector('img').src,
        nombre: curso.querySelector('h4').textContent,
        autor: curso.querySelector('.autor-curso').textContent,
        calificacion: curso.querySelector('.estrellas-curso span').textContent,
        precio: curso.querySelector('.precio span').textContent,
        cantidad: 1


    }

    const cursoDuplicado = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(cursoDuplicado){
        const i = articulosCarrito.map(curso =>{
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else{
                return curso;
            }
        });
        articulosCarrito = [...i];
    }else{
        articulosCarrito = [...articulosCarrito, infoCurso];
         //console.log(articulosCarrito);


    }

    llenarCarrito();
    
}


//muestra carrito
function llenarCarrito(){
    //limpiamos el arreglo
    limpiarTbody();
    
    articulosCarrito.forEach(curso =>{
        const row = document.createElement('tr');
        row.innerHTML =`
        <td>
        <img src='${curso.imagen}' class='imagen-curso u-full-width' id='img-curso'>
        </td>
        <td>
        <p id='nombre-curso' style='text-align:center;'>${curso.nombre}</p>       
        </td>
        <td>
        <p id='precio-curso' style='text-align:center;'>${curso.precio}</p>       
        </td>
        <td>
        <p id='cantidad-curso' style='text-align:center;'>${curso.cantidad}</p>       
        </td>
        <td>
            <a href='#' class='borrar-curso' data-id='${curso.id}'> x </a>
        </td>
        `;
        contenedor_carrito.appendChild(row);

    })

    revisarStorage();
}

function revisarStorage(){
            //local storage 
            articulosCarritoParseString = JSON.stringify(articulosCarrito);
            localStorage.setItem('Carrito',articulosCarritoParseString);
    
}


function limpiarTbody(){
   //eliminar carro contenedor_carrito.innerHTML="";
   //eliminar el local storage
   localStorage.clear();
   while(contenedor_carrito.firstChild){
       contenedor_carrito.removeChild(contenedor_carrito.firstChild)
   }
}

function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');

        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);

        llenarCarrito();


    }
}

/**var database = firebase.database();
console.log(database);**/