const { jsPDF } = window.jspdf;

const form = document.getElementById('riderForm');
const preview = document.getElementById('preview');

// Fonction pour créer le texte du rider à partir des inputs
function createRiderText(data) {
  let text = `Rider Technique - ${data.artistName}\n`;
  text += `Contact : ${data.contactInfo}\n\n`;

  [data.section1, data.section2, data.section3].forEach(section => {
    if(section.trim()) {
      // Sépare titre/contenu par le premier ":"
      const parts = section.split(':');
      if(parts.length > 1) {
        const title = parts[0].trim();
        const content = parts.slice(1).join(':').trim();
        text += `${title}\n`;
        // Liste chaque élément séparé par une virgule
        content.split(',').forEach(item => {
          text += ` - ${item.trim()}\n`;
        });
        text += '\n';
      } else {
        // Pas de ":" => afficher brut
        text += section.trim() + '\n\n';
      }
    }
  });

  return text;
}

// Mise à jour de l'aperçu en temps réel
form.addEventListener('input', () => {
  const data = {
    artistName: form.artistName.value || 'Artiste',
    contactInfo: form.contactInfo.value || 'Contact',
    section1: form.section1.value || '',
    section2: form.section2.value || '',
    section3: form.section3.value || ''
  };
  preview.textContent = createRiderText(data);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    artistName: form.artistName.value,
    contactInfo: form.contactInfo.value,
    section1: form.section1.value,
    section2: form.section2.value,
    section3: form.section3.value
  };
  const text = createRiderText(data);

  const doc = new jsPDF();
  const margin = 10;
  const lineHeight = 10;
  const pageHeight = doc.internal.pageSize.height;
  let y = margin;

  const lines = doc.splitTextToSize(text, 180);

  lines.forEach(line => {
    if(y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(margin, y, line);
    y += lineHeight;
  });

  doc.save(`rider-${data.artistName.replace(/\s+/g, '-')}.pdf`);
});