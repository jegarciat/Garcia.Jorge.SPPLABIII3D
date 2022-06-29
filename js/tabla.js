export function crearTabla(datos) {
  if (datos.length > 0) {
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.appendChild(crearCabecera(datos[0]));

    datos.forEach((item, index) => {
      tbody.appendChild(crearCuerpo(item, index));
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    document.getElementById("tabla_anuncios").appendChild(tabla);
  }
}

function crearCabecera(item) {
  const atributos = Object.keys(item);
  const fila = document.createElement("tr");

  atributos.forEach((key) => {
    if (key !== "id") {
      const th = document.createElement("th");
      th.appendChild(document.createTextNode(key));
      fila.appendChild(th);
    }
  });

  return fila;
}

function crearCuerpo(item, index) {
  const fila = document.createElement("tr");
  fila.classList.add(index % 2 ? "par" : "impar");
  Object.values(item).forEach((valor) => {
    if (valor !== item.id) {
      const td = document.createElement("td");
      td.appendChild(document.createTextNode(valor));
      fila.appendChild(td);
    } else {
      fila.setAttribute("data-id", valor);
    }
  });

  return fila;
}

export function actualizarTabla(datos) {  
  const tabla = document.getElementById("tabla_anuncios");
  
  while (tabla.hasChildNodes()) {
    tabla.removeChild(tabla.firstChild);
  }

  if (datos.length > 0) {
    crearTabla(datos);
  }
}
