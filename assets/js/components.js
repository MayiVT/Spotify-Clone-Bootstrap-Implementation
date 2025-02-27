$(function () {
    $("#header").load("assets/components/header.html");
    $("#header-log").load("assets/components/header-logged-in.html");
    $("#library-section").load("assets/components/cards/library.html");
    $("#lang-modal").load("assets/components/modals/lang-modal.html");

    loadLanguageButtons();

    function createInfoCard(containerId, text, subtext, btnText) {
        $.get("assets/components/cards/info-card.html", function (data) {
            let processedData = data
                .replace("{{text}}", text)
                .replace("{{subtext}}", subtext)
                .replace("{{btn_text}}", btnText);

            $(containerId).html(processedData);
        });
    }

    createInfoCard("#info-card-1", "Create your first playlist", "It's easy, we'll help you", "Create playlist");
    createInfoCard("#info-card-2", "Let's find some podcasts to follow", "We'll keep you updated on new episodes", "Browse podcasts");
});

function loadCardSection(containerId, options) {
    const {
        data,           // Array of items with name, category, and image
        sectionTitle,   // Title of the section
        seeAllLink,     // Link for "See all"
        isCircular      // Boolean to determine if images should be circular
    } = options;
    console.log(data)
    $.get('/assets/components/cards/card-section.html', function(template) {
        const $section = $(template);
        
        $section.find('.link-light').text(sectionTitle);
        $section.find('.link-secondary').text('See all').attr('href', seeAllLink);
        
        const $cardsContainer = $section.find('.d-flex.flex-row.justify-content-around.mt-4.gap-x-2');
        
        data.forEach(item => {
            const imgClass = isCircular ? 'card-img-top rounded-circle' : 'card-img-top';
            const card = `
                <div class="card border-0 bg-secondary-subtle" style="min-width: 12rem; scroll-snap-align: start;">
                    <img src="${item.image}" class="${imgClass}" alt="${item.name}">
                    <div class="card-body border-0 d-flex flex-column align-items-start text-start">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text fw-light text-secondary">${item.category}</p>
                    </div>
                </div>
            `;
            $cardsContainer.append(card);
        });
        $(`#${containerId}`).html($section);
    });
}

function loadLibraryItem(containerId, options) {
    const {
        image,    // Image path
        title,    // Title text
        type,     // Type text (e.g., "Playlist")
        subtype,  // Optional subtype (e.g., "65 songs")
        pinned,    // Boolean to show/hide pin icon
        rounded    // Boolean to show/hide rounded circle corners
    } = options;

    $.get('/assets/components/cards/library-item.html', function(template) {
        let processedTemplate = template
            .replace('{{image}}', image)
            .replace('{{title}}', title)
            .replace('{{type}}', type)
            .replace('{{rounded}}', rounded ? 'rounded-circle' : 'rounded');

        if (pinned) {
            processedTemplate = processedTemplate.replace('{{#pinned}}', '').replace('{{/pinned}}', '');
        } else {
            processedTemplate = processedTemplate.replace(/{{#pinned}}.*{{\/pinned}}/s, '');
        }        

        if (subtype) {
            processedTemplate = processedTemplate
                .replace('{{#subtype}}', '')
                .replace('{{/subtype}}', '')
                .replace('{{subtype}}', subtype);
        } else {
            processedTemplate = processedTemplate.replace(/{{#subtype}}.*{{\/subtype}}/s, '');
        }

        $(`#${containerId}`).html(processedTemplate);
    });
}

function loadLanguageButtons() {
    $.get('/assets/components/buttons/lang-button.html', function(template) {
        const $container = $('#langs-btns');
        
        languages.forEach(lang => {
            const $col = $('<div>').addClass('col-3');
            const buttonHtml = template
                .replace('{{native}}', lang.native)
                .replace('{{english}}', lang.english);
            
            $col.html(buttonHtml);
            $container.append($col);
        });
    });
}