async function getPhotographers() {
  let url = "../photographers.json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

let idPhotographer = "";

// Récupérer l'index grâce à la paire clé valeur id : idPhotographer
function findIndexByKeyValue(photographer, key, valuetosearch) {
  for (let i = 0; i < photographer.length; i++) {
    if (photographer[i][key] == valuetosearch) {
      return i;
    }
  }
  return null;
}

const body = document.querySelector("body");
const header = document.querySelector("header");
const main = document.querySelector("main");
const modal = document.getElementById("form-modal");
const focusableElements =
  'button, input, textarea, [tabindex]:not([tabindex="-1"])';
const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
const focusableContent = modal.querySelectorAll(focusableElements);
const lastFocusableElement = focusableContent[focusableContent.length - 1];
const btnCloseModal = document.getElementById("close-modal");
const form = document.querySelector("form");

modal.style.display = "none";

// async function photographerDetails() et async function photographerMedias()
// possible en une seule fonction ?

async function photographerDetails() {
  // Collecter l'URL après le ?id= pour le récupérer uniquement sur le fichier json
  idPhotographer = location.search.substring(4);

  const data = await getPhotographers();
  const photographers = data.photographers;

  // Appel de la fonction avec les paramètres
  let index = findIndexByKeyValue(photographers, "id", idPhotographer);
  //console.log(index);

  // Récupérer les informations du photographe grâce à son index dans le array photographers
  const photographer = data.photographers[index];
  //console.log(photographer.name);

  let profile = document.querySelector("#photographer-profile");

  // Création des éléments
  let name = document.createElement("h1");
  let localisation = document.createElement("p");
  let quote = document.createElement("p");
  let btnOpenModal = document.createElement("button");
  let btnOpenModalResp = document.getElementById("open-form-responsive");
  let photo = document.createElement("img");
  let presentation = document.createElement("article");
  let contact = document.createElement("article");
  let image = document.createElement("article");

  // Hiérarchisation des éléments
  profile.appendChild(presentation);
  profile.appendChild(contact);
  profile.appendChild(image);
  presentation.appendChild(name);
  presentation.appendChild(localisation);
  presentation.appendChild(quote);
  contact.appendChild(btnOpenModal);
  image.appendChild(photo);

  // Attribution des class, id, src, innerText, innerHTML
  name.innerText = photographer.name;
  localisation.innerText = `${photographer.city}, ${photographer.country}`;
  quote.innerText = photographer.tagline;

  for (let i = 0; i < photographer.tags.length; i++) {
    let tag = document.createElement("span");
    tag.innerText = `#${photographer.tags[i]}`;
    presentation.appendChild(tag);
  }

  btnOpenModal.innerText = "Contactez-moi";
  btnOpenModal.setAttribute("id", "btn-open-modal");
  photo.src =
    "../assets/Sample Photos/Photographers ID Photos/" + photographer.portrait;
  photo.setAttribute("class", "photographer");
  quote.setAttribute("class", "citation");
  contact.setAttribute("class", "contact");
  image.setAttribute("class", "image");

  // Faut il vérifier les champs saisies par l'utilisateur ?

  let nameOfPhotographer = document.getElementById("name-photographer");
  nameOfPhotographer.innerHTML = `Contactez-moi <br> ${photographer.name}`;

  function openFormModal() {
    body.style.overflow = "hidden";
    btnOpenModalResp.style.display = "none";
    header.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "true");
    header.style.opacity = "0.5";
    main.style.opacity = "0.5";
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    // Focus dans la modale formulaire
    modal.addEventListener("keydown", function (e) {
      let isTabPressed = e.key === "Tab" || e.keyCode === 9;

      if (!isTabPressed) {
        console.log("Je suis en train d'écrire");
        return;
      }
      // Si les touches shift + tab sont pressées
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        // Si la touche tabulation est pressée
        if (document.activeElement === lastFocusableElement) {
          //
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    });
    firstFocusableElement.focus();
  }

  // Passer la fonction à l'évènement click
  btnOpenModal.addEventListener("click", openFormModal);
  btnOpenModalResp.addEventListener("click", openFormModal);

  /* Voir si l'exécution par défaut de la soumission du formulaire doit elle se faire ?
  + ou faut il ajouter un message de réussite ?
  */
  function closeFormModal() {
    body.style.overflow = "visible";
    btnOpenModalResp.style.display = "block";
    header.setAttribute("aria-hidden", "false");
    main.setAttribute("aria-hidden", "false");
    header.style.opacity = "1";
    main.style.opacity = "1";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  btnCloseModal.addEventListener("click", closeFormModal);

  // Afficher les champs saisis par l'utilisateur dans le formulaire de contact sur la page d'un photographe
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let prenom = form.elements["firstname"].value;
    let nom = form.elements["name"].value;
    let email = form.elements["email"].value;
    let message = form.elements["message"].value;
    console.log(prenom, nom, email, message);
    closeFormModal();
  });
}

async function photographerMedias() {
  idPhotographer = location.search.substring(4);
  //console.log(typeof idPhotographer); // string

  // Conversion string en number
  let id = parseInt(idPhotographer);
  //console.log(id);

  const data = await getPhotographers();

  // Récupération des photographes
  const photographer = data.photographers;

  // Appel de la fonction avec les paramètres
  let index = findIndexByKeyValue(photographer, "id", idPhotographer);

  // Récupérer les informations du photographe grâce à son index dans le array photographers
  const artiste = data.photographers[index];

  // Fonction pour récupérer UNIQUEMENT le prénom du photographe pour src des images/vidéos
  function replaceFullnameByFirstname(string) {
    let array = string.split(" ");
    let firstname = array[0];
    // Si prénom composé retiré le tiret
    let prenom = firstname.replace("-", " ");
    return prenom;
  }

  // Récupérer le prénom + nom du photographe
  const fullname = artiste.name;

  /* Récupérer le prénom du photographe en faisant appel à la fonction replaceFullnameByFirstname 
  avec le nom complet en paramètre */
  let firstname = replaceFullnameByFirstname(fullname);

  const medias = data.media;

  // Récupérer un tableau avec les images/vidéos du photographe
  let results = medias.filter((media) => media.photographerId === id);

  // Fonctions pour créer une légende pour chaque média
  function createLegendForPhotography(string) {
    let removeCharacter = string.replaceAll("_", " ").replace(".jpg", " ");
    return removeCharacter;
  }
  function createLegendForVideo(string) {
    let removeCharacter = string.replaceAll("_", " ").replace(".mp4", " ");
    return removeCharacter;
  }

  let sectionLikes = document.querySelector("#total-likes");
  let totalOfLikes = document.createElement("h3");

  sectionLikes.appendChild(totalOfLikes);

  // Faire le total des likes avec le nombre de likes par média
  let total = 0;
  for (let i = 0; i < results.length; i++) {
    total += results[i].likes;
  }

  // Afficher le nombre total de likes par artiste + prix de sa prestation à la journée
  totalOfLikes.innerHTML = `${total} <i class="fa fa-heart icon"></i> ${artiste.price}€ / jour`;

  let media = document.querySelector("#photographer-medias");

  function createView(object) {
    // Pour chaque média créé un article avec le média + ses informations
    object.forEach((result) => {
      // Création des éléments
      let details = document.createElement("aside");
      let likes = document.createElement("p");
      let heart = document.createElement("button");

      // Si le media a une clé image création, hiérarchisation des éléments suivants
      if (result.hasOwnProperty("image")) {
        // Création des éléments
        let item = document.createElement("article");
        media.appendChild(item);
        let photography = document.createElement("img");
        let detailsOfPhotography = document.createElement("aside");
        let legendOfPhotography = document.createElement("p");
        let title = result.image;
        let legend = createLegendForPhotography(title);

        // Hiérarchisation des éléments
        item.appendChild(photography);
        item.appendChild(detailsOfPhotography);
        detailsOfPhotography.appendChild(legendOfPhotography);
        detailsOfPhotography.appendChild(details);
        details.appendChild(likes);
        details.appendChild(heart);

        // Attribution des class, id, src etc
        item.setAttribute("class", "photoItem");
        photography.src = `../assets/Sample Photos/${firstname}/${result.image}`;
        photography.setAttribute("class", "image");
        photography.setAttribute("alt", result.description);
        detailsOfPhotography.setAttribute("class", "details-image");
        legendOfPhotography.innerText = legend;

        // Sinon si le media a une clé video création, hiérarchisation des éléments suivants
      } else if (result.hasOwnProperty("video")) {
        // Création des éléments
        let item = document.createElement("article");
        media.appendChild(item);
        let video = document.createElement("video");
        let source = document.createElement("source");
        let detailsOfVideo = document.createElement("aside");
        let legendOfVideo = document.createElement("p");
        let title = result.video;
        let legend = createLegendForVideo(title);

        // Hiérarchisation des éléments
        item.appendChild(video);
        video.appendChild(source);
        item.appendChild(detailsOfVideo);
        detailsOfVideo.appendChild(legendOfVideo);
        detailsOfVideo.appendChild(details);
        details.appendChild(likes);
        details.appendChild(heart);

        // Attribution des class, id src etc
        item.setAttribute("class", "photoVideo");
        legendOfVideo.innerText = legend;
        video.setAttribute("width", "313px");
        video.setAttribute("height", "280px");
        video.setAttribute("controls", "");
        detailsOfVideo.setAttribute("class", "details-image");
        source.src = `../assets/Sample Photos/${firstname}/${result.video}`;
        source.setAttribute("type", "video/mp4");
      }

      // Partie likes
      details.setAttribute("class", "details-likes");
      likes.innerHTML = `${result.likes}`;
      heart.setAttribute("class", "fa fa-heart");
      heart.setAttribute("id", "like");

      let count = result.likes;

      function incrementLikes() {
        likes.innerText = count++;
        total++;
        totalOfLikes.innerHTML = `${total} <i class="fa fa-heart icon"></i> ${artiste.price}€ / jour`;
      }

      heart.addEventListener("click", incrementLikes);

      // onclick sur l'image ouverture de la light-box
    });
  }

  createView(results);

  // Fonctions de filtre pour les médias

  function filteredByTitle() {
    /* Fonctionne mais ne met pas à jour la vue
    (+) le tri se fait uniquement sur le nom des PHOTOS et pas des vidéos */
    results = results.sort(function compare(a, b) {
      if (a.image < b.image) return -1;
      if (a.image > b.image) return 1;
      return 0;
    });
    media.innerHTML = "";
    createView(results);
  }

  function filteredByPopularity() {
    results = results.sort(function compare(a, b) {
      if (a.likes > b.likes) return -1;
      if (a.likes < b.likes) return 1;
      return 0;
    });
    media.innerHTML = "";
    createView(results);
  }

  function filteredByDate() {
    results = results.sort(function compare(a, b) {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });
    media.innerHTML = "";
    createView(results);
  }

  // Gestion de la liste déroulante pour les filtres sur les médias

  const SPACEBAR_KEY_CODE = [0, 32];
  const ENTER_KEY_CODE = 13;
  const DOWN_ARROW_KEY_CODE = 40;
  const UP_ARROW_KEY_CODE = 38;
  const ESCAPE_KEY_CODE = 27;

  const list = document.querySelector(".dropdown__list");
  const listContainer = document.querySelector(".dropdown__list-container");
  const dropdownArrow = document.querySelector(".dropdown__arrow");
  const listItems = document.querySelectorAll(".dropdown__list-item");
  const dropdownSelectedNode = document.querySelector("#dropdown__selected");
  const listItemIds = [];

  dropdownSelectedNode.addEventListener("click", (e) =>
    toggleListVisibility(e)
  );
  dropdownSelectedNode.addEventListener("keydown", (e) =>
    toggleListVisibility(e)
  );

  listItems.forEach((item) => listItemIds.push(item.id));

  listItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      setSelectedListItem(e);
      closeList();
    });

    item.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case ENTER_KEY_CODE:
          setSelectedListItem(e);
          closeList();
          return;

        case DOWN_ARROW_KEY_CODE:
          focusNextListItem(DOWN_ARROW_KEY_CODE);
          return;

        case UP_ARROW_KEY_CODE:
          focusNextListItem(UP_ARROW_KEY_CODE);
          return;

        case ESCAPE_KEY_CODE:
          closeList();
          return;

        default:
          return;
      }
    });
  });

  function setSelectedListItem(e) {
    let selectedTextToAppend = document.createTextNode(e.target.innerText);
    dropdownSelectedNode.innerHTML = null;
    dropdownSelectedNode.appendChild(selectedTextToAppend);
    console.log(dropdownSelectedNode.textContent);
    let filter = dropdownSelectedNode.textContent;
    switch (filter) {
      case "Popularité":
        console.log("Filtre par popularité sur les médias");
        filteredByPopularity();
        break;
      case "Date":
        console.log("Filtre par date sur les médias");
        filteredByDate();
        break;
      case "Titre":
        console.log(
          "Filtre par titre dans l'ordre alphabétique sur les médias"
        );
        filteredByTitle();
        break;
    }
  }

  function closeList() {
    list.classList.remove("open");
    dropdownArrow.classList.remove("expanded");
    listContainer.setAttribute("aria-expanded", false);
  }

  function toggleListVisibility(e) {
    let openDropDown =
      SPACEBAR_KEY_CODE.includes(e.keyCode) || e.keyCode === ENTER_KEY_CODE;

    if (e.keyCode === ESCAPE_KEY_CODE) {
      closeList();
    }

    if (e.type === "click" || openDropDown) {
      list.classList.toggle("open");
      dropdownArrow.classList.toggle("expanded");
      listContainer.setAttribute(
        "aria-expanded",
        list.classList.contains("open")
      );
    }

    if (e.keyCode === DOWN_ARROW_KEY_CODE) {
      focusNextListItem(DOWN_ARROW_KEY_CODE);
    }

    if (e.keyCode === UP_ARROW_KEY_CODE) {
      focusNextListItem(UP_ARROW_KEY_CODE);
    }
  }

  function focusNextListItem(direction) {
    const activeElementId = document.activeElement.id;
    if (activeElementId === "dropdown__selected") {
      document.querySelector(`#${listItemIds[0]}`).focus();
    } else {
      const currentActiveElementIndex = listItemIds.indexOf(activeElementId);
      if (direction === DOWN_ARROW_KEY_CODE) {
        const currentActiveElementIsNotLastItem =
          currentActiveElementIndex < listItemIds.length - 1;
        if (currentActiveElementIsNotLastItem) {
          const nextListItemId = listItemIds[currentActiveElementIndex + 1];
          document.querySelector(`#${nextListItemId}`).focus();
        }
      } else if (direction === UP_ARROW_KEY_CODE) {
        const currentActiveElementIsNotFirstItem =
          currentActiveElementIndex > 0;
        if (currentActiveElementIsNotFirstItem) {
          const nextListItemId = listItemIds[currentActiveElementIndex - 1];
          document.querySelector(`#${nextListItemId}`).focus();
        }
      }
    }
  }

  function applyFilter(category) {
    // Récupérer la liste de tous les photographes

    media.innerHTML = "";

    // Parcourir chaque photographe dans le tableau de photographes
    for (let i = 0; i < results.length; i++) {
      // Parcourir chaque tag dans le tableau de tags de chaque photographe
      for (let j = 0; j < results[i].tags.length; j++) {
        // Si l'un des tags d'un photographe === category cliqué alors affichage du photographe
        if (results[i].tags[j] === category) {
          let details = document.createElement("aside");
          let likes = document.createElement("p");
          let heart = document.createElement("button");

          // Si le media a une clé image création, hiérarchisation des éléments suivants
          if (results[i].hasOwnProperty("image")) {
            // Création des éléments
            let item = document.createElement("article");
            media.appendChild(item);
            let photography = document.createElement("img");
            let detailsOfPhotography = document.createElement("aside");
            let legendOfPhotography = document.createElement("p");
            let title = results[i].image;
            let legend = createLegendForPhotography(title);

            // Hiérarchisation des éléments
            item.appendChild(photography);
            item.appendChild(detailsOfPhotography);
            detailsOfPhotography.appendChild(legendOfPhotography);
            detailsOfPhotography.appendChild(details);
            details.appendChild(likes);
            details.appendChild(heart);

            // Attribution des class, id, src etc
            item.setAttribute("class", "photoItem");
            photography.src = `../assets/Sample Photos/${firstname}/${results[i].image}`;
            photography.setAttribute("class", "image");
            photography.setAttribute("alt", results[i].description);
            detailsOfPhotography.setAttribute("class", "details-image");
            legendOfPhotography.innerText = legend;

            // Sinon si le media a une clé video création, hiérarchisation des éléments suivants
          } else if (results[i].hasOwnProperty("video")) {
            // Création des éléments
            let item = document.createElement("article");
            media.appendChild(item);
            let video = document.createElement("video");
            let source = document.createElement("source");
            let detailsOfVideo = document.createElement("aside");
            let legendOfVideo = document.createElement("p");
            let title = results[i].video;
            let legend = createLegendForVideo(title);

            // Hiérarchisation des éléments
            item.appendChild(video);
            video.appendChild(source);
            item.appendChild(detailsOfVideo);
            detailsOfVideo.appendChild(legendOfVideo);
            detailsOfVideo.appendChild(details);
            details.appendChild(likes);
            details.appendChild(heart);

            // Attribution des class, id src etc
            item.setAttribute("class", "photoVideo");
            legendOfVideo.innerText = legend;
            video.setAttribute("width", "313px");
            video.setAttribute("height", "280px");
            video.setAttribute("controls", "");
            detailsOfVideo.setAttribute("class", "details-image");
            source.src = `../assets/Sample Photos/${firstname}/${results[i].video}`;
            source.setAttribute("type", "video/mp4");
          }

          // Partie likes
          details.setAttribute("class", "details-likes");
          likes.innerHTML = `${results[i].likes}`;
          heart.setAttribute("class", "fa fa-heart");
          heart.setAttribute("id", "like");

          let count = results[i].likes;

          function incrementLikes() {
            likes.innerText = count++;
            total++;
            totalOfLikes.innerHTML = `${total} <i class="fa fa-heart icon"></i> ${artiste.price}€ / jour`;
          }

          heart.addEventListener("click", incrementLikes);

          // onclick sur l'image ouverture de la light-box
        }
      }
    }
  }

  function findValueOfFilter() {
    let type = document.querySelectorAll("article > span");
    for (let i = 0; i < type.length; i++) {
      type[i].setAttribute("tabindex",0);
      type[i].addEventListener("keydown", (e) => {
        if (e.keyCode === ENTER_KEY_CODE){
        let value = type[i].innerText;
        // Modification pour comparaison avec string dans le json
        let category = value.replace("#", "").toLowerCase();
        console.log(`Filtre sélectionné : ${category}`);
        applyFilter(category);
        } 
      });
      type[i].addEventListener("click", function () {
        let value = type[i].innerText;
        // Modification pour comparaison avec string dans le json
        let category = value.replace("#", "").toLowerCase();
        console.log(`Filtre sélectionné : ${category}`);
        applyFilter(category);
      });
    }
  }
  findValueOfFilter();
}
