export function agregarSpinner() {
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./images/spinner.gif");
    spinner.setAttribute("alt", "Spinner de carga");
    spinner.setAttribute("id", "spinner");
    document.getElementById("contenedor-spinner").appendChild(spinner);
}

export function eliminarSpinner() {

    const contenedor = document.getElementById("contenedor-spinner");
    while (contenedor.hasChildNodes()) {
        contenedor.removeChild(contenedor.firstElementChild);
    }
}