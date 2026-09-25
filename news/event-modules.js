/* Optional event article sections. Content and ordering live beside the article. */
(() => {
  const container = document.getElementById('event-modules');
  if (!container) return;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  function personCard(person, compact) {
    const card = element('li', compact ? 'event-person event-person-compact' : 'event-person');
    if (person.placeholder) {
      card.classList.add('event-person-placeholder');
      card.append(element('p', '', person.name || 'More to be announced'));
      return card;
    }
    if (person.image) {
      const photo = element('img', 'event-person-photo');
      photo.src = person.image;
      photo.alt = person.name;
      photo.loading = 'lazy';
      card.append(photo);
    }
    const body = element('div', 'event-person-body');
    const heading = element('h3');
    if (person.website) {
      const link = element('a', '', person.name);
      link.href = person.website;
      heading.append(link);
    } else {
      heading.textContent = person.name;
    }
    body.append(heading);
    if (person.affiliation) body.append(element('p', 'event-affiliation', person.affiliation));
    if (person.talk) body.append(element('p', 'event-talk', person.talk));
    if (person.description) body.append(element('p', 'event-person-description', person.description));
    card.append(body);
    return card;
  }

  function renderSection(module, index) {
    if (module.enabled === false) return;
    const items = module.items || [];
    if (!['speakers', 'directors', 'programme', 'text', 'gallery'].includes(module.type)) return;
    if (!items.length && !module.description) return;
    const section = element('section', `event-module event-module-${module.type}`);
    const heading = element('h2', '', module.title);
    heading.id = `event-module-${index}`;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);
    if (module.status) section.append(element('span', 'event-status', module.status));
    if (module.description) section.append(element('p', '', module.description));

    if (module.type === 'speakers' || module.type === 'directors') {
      const list = element('ul', 'event-people');
      items.forEach(person => list.append(personCard(person, module.type === 'directors')));
      if (items.length) section.append(list);
    } else if (module.type === 'programme') {
      const list = element('ul', 'event-programme');
      items.forEach(item => {
        const row = element('li');
        if (item.time) row.append(element('span', 'event-programme-time', item.time));
        const details = element('div');
        details.append(element('h3', '', item.title));
        if (item.description) details.append(element('p', '', item.description));
        row.append(details);
        list.append(row);
      });
      if (items.length) section.append(list);
    } else if (module.type === 'text') {
      items.forEach(paragraph => section.append(element('p', '', paragraph)));
    } else if (module.type === 'gallery') {
      const gallery = element('div', 'event-gallery');
      items.forEach(item => {
        const figure = element('figure');
        const photo = element('img');
        photo.src = item.src;
        photo.alt = item.alt || '';
        photo.loading = 'lazy';
        figure.append(photo);
        if (item.caption) figure.append(element('figcaption', '', item.caption));
        gallery.append(figure);
      });
      section.append(gallery);
    }
    container.append(section);
  }

  fetch(container.dataset.content)
    .then(response => {
      if (!response.ok) throw new Error('Unable to load event content');
      return response.json();
    })
    .then(content => (content.sections || []).forEach(renderSection))
    .catch(() => {
      container.replaceChildren(element('p', '', 'Speaker and programme updates are temporarily unavailable. Please see the registration page below for event information.'));
    });
})();
