(() => {
  const dialog = document.querySelector('.image-lightbox');
  const image = dialog.querySelector('.lightbox-image');
  let opener;
  document.querySelectorAll('.media-image').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
})();
