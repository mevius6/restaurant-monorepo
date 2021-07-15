// https://www.adobe.io/apis/documentcloud/dcsdk/docs.html

const FILE_NAME = 'hochutort-menu.pdf';
// const FILE_URL = `https://static.raymondcamden.com/enclosures/${FILE_NAME}`;
const FILE_URL = 'https://documentcloud.adobe.com/link/review?uri=urn:aaid:scds:US:bfa119bd-9754-4f0c-99b6-db9a6d25921c';

const viewerConfig = {
  showAnnotationTools: true,
  enableFormFilling: true,
  showLeftHandPanel: true,
  showDownloadPDF: true,
  showPrintPDF: true,
  showPageControls: true,
  dockPageControls: true,
  defaultViewMode: '', // "FIT_PAGE" || "FIT_WIDTH"
  embedMode: 'LIGHT_BOX',
};

if (window.AdobeDC) enablePDF();
else {
  document.addEventListener('adobe_dc_view_sdk.ready', () => enablePDF());
}

function enablePDF() {
  let btn = document.querySelector('#showPDF');
  btn.addEventListener('click', () => displayPDF());
  btn.disabled = false;
}

function displayPDF() {
  console.log('Lets do some AWESOME PDF stuff!');

  let adobeDCView = new AdobeDC.View({ clientId: process.env.ADOBE_API_KEY });
  adobeDCView.previewFile({
    content: { location: { url: FILE_URL } },
    metaData: { fileName: FILE_NAME },
  }, viewerConfig);
}
