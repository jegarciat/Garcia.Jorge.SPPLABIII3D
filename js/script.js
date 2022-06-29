import { crearTabla, actualizarTabla } from "./tabla.js";
import { agregarSpinner, eliminarSpinner } from "./spinner.js";
import Anuncio_Auto from "./anuncio_auto.js";

const URL = "http://localhost:3000/anuncios";

const select = document.getElementById("filtro");
const promedio = document.getElementById("promedio");
const $frmAnuncio = document.forms[0];

getAnunciosAjax();

window.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    getAnuncioAjax(e.target.parentElement.dataset.id);
  } else if (e.target.matches("#btnEliminar")) {
    // console.log($frmAnuncio.anuncioID.value);
    eliminarAnuncioFetch($frmAnuncio.anuncioID.value);
    // console.log($frmAnuncio.anuncioID.value);
    mostrarEditarEliminar(false);
    $frmAnuncio.anuncioID.value = "";
    $frmAnuncio.reset();
} else if (e.target.matches("#btnCancelar")) {
    mostrarEditarEliminar(false);
    $frmAnuncio.anuncioID.value = "";
  }
});

$frmAnuncio.addEventListener("submit", (e) => {
    e.preventDefault();

    const { titulo, precio, puertas, potencia, kms, descripcion, transaccion, anuncioID } = $frmAnuncio;

    if(validarString(titulo.value, descripcion.value) && validarNumericos(precio.value, puertas.value, kms.value, potencia.value))
    {       
        const anuncioAux = new Anuncio_Auto(anuncioID.value, titulo.value.trim(), transaccion.value, descripcion.value.trim(), 
                                            parseFloat(precio.value), parseInt(puertas.value), kms.value, parseInt(potencia.value));
        if (anuncioAux.id === '') {
            crearAnuncioFetch(anuncioAux);
        }
        else {
            console.log(anuncioAux.id);
            editarAnuncioFetch(anuncioAux);
            mostrarEditarEliminar(false);
            anuncioID.value = "";
        }
    }

    $frmAnuncio.reset();
});

document.querySelectorAll('.cbox').forEach((check) => {
    check.addEventListener("change", (getAnunciosAjax));
});


select.addEventListener("change", () => {
  //   console.log(select.value);

  agregarSpinner();
  fetch(URL)
    .then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(`Error: ${res.status} : ${res.statusText}`)
    )
    .then((data) => {
      if (select.value != "Todos") {
        const anuncios = filtrarAnuncios(data, select.value);
        // console.log(anuncios);
        const promedioAux = calcularPromedio(anuncios);
        promedio.value = parseFloat(promedioAux);
        actualizarTabla(anuncios);
      } else {
        promedio.value = "Todos";
        actualizarTabla(data);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      eliminarSpinner();
    });
});
    

function getAnunciosAjax() {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);

        const checks = document.querySelectorAll('.cbox');

        data.map((elemento)=>{
            checks.forEach(check => {
                if(check.checked == false){
                    delete elemento[check.value];
                }
            });
            return elemento;
        })
        actualizarTabla(data);
      } else {
        console.error(`Error: ${xhr.status} : ${xhr.statusText}`);
      }
      eliminarSpinner();
    } else {
      agregarSpinner();
    }
  });

  xhr.open("GET", URL);
  xhr.send();
}

function getAnuncioAjax(id) {
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          cargarForm(data);
        } else {
          console.error(`Error: ${xhr.status} : ${xhr.statusText}`);
        }
        eliminarSpinner();
      } else {
        agregarSpinner();
      }
    });
  
    xhr.open("GET", URL + "/" + id);
    xhr.send();
  }
  
function filtrarAnuncios(data, seleccion) {
  return data.filter((elemento) => elemento.transaccion == seleccion);
}

function calcularPromedio(anuncios) {
  let suma = anuncios.reduce((anterior, actual) => {
    let add = anterior + parseFloat(actual.precio);
    return add;
  }, 0);

  return Math.round(suma / anuncios.length);
}

function cargarForm(anuncio) {
    const { titulo, precio, puertas, potencia, kms, descripcion, transaccion, anuncioID } = $frmAnuncio;

    titulo.value = anuncio.titulo;
    transaccion.value = anuncio.transaccion;
    descripcion.value = anuncio.descripcion;
    precio.value = anuncio.precio;
    puertas.value = anuncio.num_puertas;
    kms.value = anuncio.num_kms;
    potencia.value = anuncio.potencia;
    anuncioID.value = anuncio.id;

    mostrarEditarEliminar(true);
}

function mostrarEditarEliminar(condicion) {
    if (condicion) {
    document.getElementById("btnGuardar").classList.add("ocultar");
    document.getElementById("btnEliminar").classList.remove("ocultar");
    document.getElementById("btnModificar").classList.remove("ocultar");
    } else {
    document.getElementById("btnGuardar").classList.remove("ocultar");
    document.getElementById("btnEliminar").classList.add("ocultar");
    document.getElementById("btnModificar").classList.add("ocultar");
    }
}

const crearAnuncioFetch = (nuevoAnuncio) => {
    const options = {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body:JSON.stringify(nuevoAnuncio)
    }
    agregarSpinner();
    fetch(URL, options)
    .then((res)=>res.ok ? res.json() : Promise.reject(`Error: ${res.status} : ${res.statusText}`))
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    })
    .finally(()=>{
        eliminarSpinner();
    });
};

const editarAnuncioFetch = (anuncioEditado) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anuncioEditado),
  };
  agregarSpinner();
  fetch(URL + "/" + anuncioEditado.id, options)
    .then((res) =>
      res.ok? res.json(): Promise.reject(`Error: ${res.status} : ${res.statusText}`)
    )
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      eliminarSpinner();
    });
};

const eliminarAnuncioFetch = (id) => {
    const options = {
        method:"DELETE"
    }
    agregarSpinner();
    fetch(URL + "/" + id, options)
    .then((res)=>res.ok ? res.json() : Promise.reject(`Error: ${res.status} : ${res.statusText}`))
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    })
    .finally(()=>{
        eliminarSpinner();
    });
};

function validarNumericos(precio, puertas, kms, potencia)
{
    return (parseFloat(precio) && parseInt(puertas) && parseInt(potencia)? true : false);
}

function validarString(titulo, descripcion)
{
    return (titulo.trim().length > 0 && descripcion.trim().length > 0? true : false);
}
