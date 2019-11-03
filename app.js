const scraper = require("website-scraper");

let options = {
    urls: ["https://www.clarin.com/politica/alberto-fernandez-asesora-roberto-lavagna-prepara-paquete-buenas-noticias-_0_rrkIgGKx.html"],
    directory: "./here"
};

scraper(options).then(result => {
    console.log("The website has been downloaded!");
}).catch(error => {
    console.log("Something bad has happened!");
});
