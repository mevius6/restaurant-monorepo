// https://www.adobe.io/apis/documentcloud/dcsdk/docs.html
// https://github.com/adobe/pdf-embed-api-samples/blob/master/Lightbox%20Embed%20Mode/index.js

const FILE_NAME = 'menu.pdf';
const FILE_PATH = `https://hochutort.com/${FILE_NAME}`;
// const FILE_URL = 'https://documentcloud.adobe.com/link/review?uri=urn:aaid:scds:US:bfa119bd-9754-4f0c-99b6-db9a6d25921c';

// const headers = [{ key: '', value: '' }];

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
  let adobeDCView = new AdobeDC.View({
    clientId: process.env.ADOBE_API_KEY,
    locale: "ru-RU",
  });
  adobeDCView.previewFile({
    content: {
      location: {
        url: FILE_PATH,
        // header: (headers.key !== '') ? headers : '',
      }
    },
    metaData: { fileName: FILE_NAME },
  }, viewerConfig);
}
