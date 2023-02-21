/**
 * @typedef {object} PathItem
 * @property {"Dir"|"SymlinkDir"|"File"|"SymlinkFile"} path_type
 * @property {string} name
 * @property {number} mtime
 * @property {number} size
 */

/**
 * @typedef {object} DATA
 * @property {string} href
 * @property {string} uri_prefix
 * @property {"Index" | "Edit"} kind
 * @property {PathItem[]} paths
 * @property {boolean} allow_upload
 * @property {boolean} allow_delete
 * @property {boolean} allow_search
 * @property {boolean} allow_archive
 * @property {boolean} auth
 * @property {string} user
 * @property {boolean} dir_exists
 * @property {string} editable
 */

/**
 * @type {DATA} DATA
 */
var DATA;

/**
 * @type {PARAMS}
 * @typedef {object} PARAMS
 * @property {string} q
 * @property {string} sort
 * @property {string} order
 */
const PARAMS = Object.fromEntries(new URLSearchParams(window.location.search).entries());

const dirEmptyNote = PARAMS.q ? 'No results' : DATA.dir_exists ? 'Empty folder' : 'Folder will be created when a file is uploaded';

const ICONS = {
  dir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>`,
  symlinkFile: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM6 4.5l4 3-4 3v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73.73-.84 1.69-1.27 2.88-1.27v-2H6z"></path></svg>`,
  symlinkDir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM1 3h5v1H1V3zm6 9v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73C4.86 8.43 5.82 8 7.01 8V6l4 3-4 3H7z"></path></svg>`,
  file: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`,
  move: `<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`,
  delete: `<svg width="16" height="16" fill="currentColor"viewBox="0 0 16 16"><path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`,
}

/**
 * @type Element
 */
let $pathsTable;
/**
 * @type Element
 */
let $pathsTableHead;
/**
 * @type Element
 */
let $pathsTableBody;
/**
 * @type Element
 */
let $uploadersTable;
/**
 * @type Element
 */
let $emptyFolder;
/**
 * @type Element
 */
let $editor;
/**
 * @type Element
 */
let $userBtn;

function ready() {
  $pathsTable = document.querySelector(".paths-table")
  $pathsTableHead = document.querySelector(".paths-table thead");
  $pathsTableBody = document.querySelector(".paths-table tbody");
  $uploadersTable = document.querySelector(".uploaders-table");
  $emptyFolder = document.querySelector(".empty-folder");
  $editor = document.querySelector(".editor");
  $userBtn = document.querySelector(".user-btn");

  addBreadcrumb(DATA.href, DATA.uri_prefix);

  if (DATA.kind == "Index") {
    document.title = `Index of ${DATA.href} - Dufs`;
    document.querySelector(".index-page").classList.remove("hidden");

    if (DATA.auth) {
      setupAuth();
    }

    if (DATA.allow_search) {
      setupSearch()
    }

    if (DATA.allow_archive) {
      document.querySelector(".zip-root").classList.remove("hidden");
    }

    renderPathsTableHead();
    renderPathsTableBody();

    if (DATA.allow_upload) {
      dropzone();
      setupUpload();
      setupNewFile();
    }
  } else if (DATA.kind == "Edit") {
    document.title = `Edit of ${DATA.href} - Dufs`;
    document.querySelector(".editor-page").classList.remove("hidden");;

    setupEditor();
  }
}


class Uploader {
  /**
   * 
   * @param {File} file 
   * @param {string[]} dirs 
   */
  constructor(file, dirs) {
    /**
     * @type Element
     */
    this.$uploadStatus = null
    this.uploaded = 0;
    this.lastUptime = 0;
    this.name = [...dirs, file.name].join("/");
    this.idx = Uploader.globalIdx++;
    this.file = file;
  }

  upload() {
    const { idx, name } = this;
    const url = newUrl(name);
    const encodedName = encodedStr(name);
    $uploadersTable.insertAdjacentHTML("beforeend", `
  <tr id="upload${idx}" class="uploader">
    <td class="path cell-icon">
      ${getPathSvg()}
    </td>
    <td class="path cell-name">
      <a href="${url}">${encodedName}</a>
    </td>
    <td class="cell-status upload-status" id="uploadStatus${idx}"></td>
  </tr>`);
    $uploadersTable.classList.remove("hidden");
    $emptyFolder.classList.add("hidden");
    this.$uploadStatus = document.getElementById(`uploadStatus${idx}`);
    this.$uploadStatus.innerHTML = '-';
    Uploader.queues.push(this);
    Uploader.runQueue();
  }

  ajax() {
    Uploader.runnings += 1;
    const url = newUrl(this.name);
    this.lastUptime = Date.now();
    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", e => this.progress(e), false);
    ajax.addEventListener("readystatechange", () => {
      if (ajax.readyState === 4) {
        if (ajax.status >= 200 && ajax.status < 300) {
          this.complete();
        } else {
          this.fail();
        }
      }
    })
    ajax.addEventListener("error", () => this.fail(), false);
    ajax.addEventListener("abort", () => this.fail(), false);
    ajax.open("PUT", url);
    ajax.send(this.file);
  }


  progress(event) {
    const now = Date.now();
    const speed = (event.loaded - this.uploaded) / (now - this.lastUptime) * 1000;
    const [speedValue, speedUnit] = formatSize(speed);
    const speedText = `${speedValue}${speedUnit.toLowerCase()}/s`;
    const progress = formatPercent((event.loaded / event.total) * 100);
    const duration = formatDuration((event.total - event.loaded) / speed)
    this.$uploadStatus.innerHTML = `<span>${speedText}</span><span>${progress}</span><span>${duration}</span>`;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  complete() {
    this.$uploadStatus.innerHTML = `✓`;
    Uploader.runnings -= 1;
    Uploader.runQueue();
  }

  fail() {
    this.$uploadStatus.innerHTML = `✗`;
    Uploader.runnings -= 1;
    Uploader.runQueue();
  }
}

Uploader.globalIdx = 0;

Uploader.runnings = 0;

Uploader.auth = false;

/**
 * @type Uploader[]
 */
Uploader.queues = [];


Uploader.runQueue = async () => {
  if (Uploader.runnings > 2) return;
  let uploader = Uploader.queues.shift();
  if (!uploader) return;
  if (!Uploader.auth) {
    Uploader.auth = true;
    await login();
  }
  uploader.ajax();
}

/**
 * Add breadcrumb
 * @param {string} href 
 * @param {string} uri_prefix
 */
function addBreadcrumb(href, uri_prefix) {
  const $breadcrumb = document.querySelector(".breadcrumb");
  let parts = [];
  if (href === "/") {
    parts = [""];
  } else {
    parts = href.split("/");
  }
  const len = parts.length;
  let path = uri_prefix;
  for (let i = 0; i < len; i++) {
    const name = parts[i];
    if (i > 0) {
      if (!path.endsWith("/")) {
        path += "/";
      }
      path += encodeURIComponent(name);
    }
    const encodedName = encodedStr(name);
    if (i === 0) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg></a>`);
    } else if (i === len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<b>${encodedName}</b>`);
    } else {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}">${encodedName}</a>`);
    }
    if (i !== len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<span class="separator">/</span>`);
    }
  }
}

/**
 * Render path table thead
 */
function renderPathsTableHead() {
  const headerItems = [
    {
      name: "name",
      props: `colspan="2"`,
      text: "Name",
    },
    {
      name: "mtime",
      props: ``,
      text: "Last Modified",
    },
    {
      name: "size",
      props: ``,
      text: "Size",
    }
  ];
  $pathsTableHead.insertAdjacentHTML("beforeend", `
    <tr>
      ${headerItems.map(item => {
    let svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/></svg>`;
    let order = "asc";
    if (PARAMS.sort === item.name) {
      if (PARAMS.order === "asc") {
        order = "desc";
        svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`
      } else {
        svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>`
      }
    }
    const qs = new URLSearchParams({ ...PARAMS, order, sort: item.name }).toString();
    const icon = `<span>${svg}</span>`
    return `<th class="cell-${item.name}" ${item.props}><a href="?${qs}">${item.text}${icon}</a></th>`
  }).join("\n")}
      <th class="cell-actions">Actions</th>
    </tr>
  `);
}

/**
 * Render path table tbody
 */
function renderPathsTableBody() {
  if (DATA.paths && DATA.paths.length > 0) {
    const len = DATA.paths.length;
    if (len > 0) {
      $pathsTable.classList.remove("hidden");
    }
    for (let i = 0; i < len; i++) {
      addPath(DATA.paths[i], i);
    }
  } else {
    $emptyFolder.textContent = dirEmptyNote;
    $emptyFolder.classList.remove("hidden");
  }
}

/**
 * Add pathitem
 * @param {PathItem} file 
 * @param {number} index 
 */
function addPath(file, index) {
  const encodedName = encodedStr(file.name);
  let url = newUrl(file.name)
  let actionDelete = "";
  let actionDownload = "";
  let actionMove = "";
  let actionEdit = "";
  let isDir = file.path_type.endsWith("Dir");
  if (isDir) {
    url += "/";
    if (DATA.allow_archive) {
      actionDownload = `
      <div class="action-btn">
        <a href="${url}?zip" title="Download folder as a .zip file">${ICONS.download}</a>
      </div>`;
    }
  } else {
    actionDownload = `
    <div class="action-btn" >
      <a href="${url}" title="Download file" download>${ICONS.download}</a>
    </div>`;
  }
  if (DATA.allow_delete) {
    if (DATA.allow_upload) {
      actionMove = `<div onclick="movePath(${index})" class="action-btn" id="moveBtn${index}" title="Move to new path">${ICONS.move}</div>`;
      if (!isDir) {
        actionEdit = `<a class="action-btn" title="Edit file" target="_blank" href="${url}?edit">${ICONS.edit}</a>`;
      }
    }
    actionDelete = `
    <div onclick="deletePath(${index})" class="action-btn" id="deleteBtn${index}" title="Delete">${ICONS.delete}</div>`;
  }
  let actionCell = `
  <td class="cell-actions">
    ${actionDownload}
    ${actionMove}
    ${actionDelete}
    ${actionEdit}
  </td>`

  $pathsTableBody.insertAdjacentHTML("beforeend", `
<tr id="addPath${index}">
  <td class="path cell-icon">
    ${getPathSvg(file.path_type)}
  </td>
  <td class="path cell-name">
    <a href="${url}" target="_blank">${encodedName}</a>
  </td>
  <td class="cell-mtime">${formatMtime(file.mtime)}</td>
  <td class="cell-size">${formatSize(file.size).join(" ")}</td>
  ${actionCell}
</tr>`)
}

/**
 * Delete path
 * @param {number} index 
 * @returns 
 */
async function deletePath(index) {
  const file = DATA.paths[index];
  if (!file) return;

  if (!confirm(`Delete \`${file.name}\`?`)) return;

  try {
    await login();
    const res = await fetch(newUrl(file.name), {
      method: "DELETE",
    });
    await assertResOK(res);
    document.getElementById(`addPath${index}`).remove();
    DATA.paths[index] = null;
    if (!DATA.paths.find(v => !!v)) {
      $pathsTable.classList.add("hidden");
      $emptyFolder.textContent = dirEmptyNote;
      $emptyFolder.classList.remove("hidden");
    }
  } catch (err) {
    alert(`Cannot delete \`${file.name}\`, ${err.message}`);
  }
}


/**
 * Move path
 * @param {number} index 
 * @returns 
 */
async function movePath(index) {
  const file = DATA.paths[index];
  if (!file) return;

  const fileUrl = newUrl(file.name);
  const fileUrlObj = new URL(fileUrl)

  const prefix = DATA.uri_prefix.slice(0, -1);

  const filePath = decodeURIComponent(fileUrlObj.pathname.slice(prefix.length));

  let newPath = prompt("Enter new path", filePath)
  if (!newPath) return;
  if (!newPath.startsWith("/")) newPath = "/" + newPath;
  if (filePath === newPath) return;
  const newFileUrl = fileUrlObj.origin + prefix + newPath.split("/").map(encodeURIComponent).join("/");

  try {
    await login();
    const res = await fetch(fileUrl, {
      method: "MOVE",
      headers: {
        "Destination": newFileUrl,
      }
    });
    await assertResOK(res);
    location.href = newFileUrl.split("/").slice(0, -1).join("/");
  } catch (err) {
    alert(`Cannot move \`${filePath}\` to \`${newPath}\`, ${err.message}`);
  }
}

function dropzone() {
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(name => {
    document.addEventListener(name, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  document.addEventListener("drop", async e => {
    if (!e.dataTransfer.items[0].webkitGetAsEntry) {
      const files = e.dataTransfer.files.filter(v => v.size > 0);
      for (const file of files) {
        new Uploader(file, []).upload();
      }
    } else {
      const entries = [];
      const len = e.dataTransfer.items.length;
      for (let i = 0; i < len; i++) {
        entries.push(e.dataTransfer.items[i].webkitGetAsEntry());
      }
      addFileEntries(entries, [])
    }
  });
}

function setupAuth() {
  if (DATA.user) {
    $userBtn.classList.remove("hidden");
    $userBtn.title = DATA.user;
  } else {
    const $loginBtn = document.querySelector(".login-btn");
    $loginBtn.classList.remove("hidden");
    $loginBtn.addEventListener("click", () => login(true));
  }
}


/**
 * Setup searchbar
 */
function setupSearch() {
  const $searchbar = document.querySelector(".searchbar");
  $searchbar.classList.remove("hidden");
  $searchbar.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData($searchbar);
    const q = formData.get("q");
    let href = baseUrl();
    if (q) {
      href += "?q=" + q;
    }
    location.href = href;
  });
  if (PARAMS.q) {
    document.getElementById('search').value = PARAMS.q;
  }
}

function setupUpload() {
  const $newFolder = document.querySelector(".new-folder");
  $newFolder.classList.remove("hidden");
  $newFolder.addEventListener("click", () => {
    const name = prompt("Enter folder name");
    if (name) createFolder(name);
  });
  document.querySelector(".upload-file").classList.remove("hidden");
  document.getElementById("file").addEventListener("change", async e => {
    const files = e.target.files;
    for (let file of files) {
      new Uploader(file, []).upload();
    }
  });
}

function setupNewFile() {
  const $newFile = document.querySelector(".new-file");
  $newFile.classList.remove("hidden");
  $newFile.addEventListener("click", () => {
    const name = prompt("Enter file name");
    if (name) createFile(name);
  });
}

async function setupEditor() {
  const $download = document.querySelector(".download")
  $download.classList.remove("hidden");
  $download.href = baseUrl()

  if (!DATA.editable) {
    const $notEditable = document.querySelector(".not-editable");
    $notEditable.classList.remove("hidden");
    $notEditable.textContent = "Cannot edit file because it is too large or binary.";
    return;
  }

  const $saveBtn = document.querySelector(".save-btn");
  $saveBtn.classList.remove("hidden");
  $saveBtn.addEventListener("click", saveChange);

  $editor.classList.remove("hidden");
  try {
    const res = await fetch(baseUrl());
    await assertResOK(res);
    const text = await res.text();
    $editor.value = text;
  } catch (err) {
    alert(`Failed get file, ${err.message}`);
  }
}

/**
 * Save editor change
 */
async function saveChange() {
  try {
    await fetch(baseUrl(), {
      method: "PUT",
      body: $editor.value,
    });
  } catch (err) {
    alert(`Failed to save file, ${err.message}`);
  }
}

async function login(alert = false) {
  if (!DATA.auth) return;
  try {
    const res = await fetch(baseUrl(), {
      method: "WRITEABLE",
    });
    await assertResOK(res);
    document.querySelector(".login-btn").classList.add("hidden");
    $userBtn.classList.remove("hidden");
    $userBtn.title = "";
  } catch (err) {
    let message = `Cannot login, ${err.message}`;
    if (alert) {
      alert(message);
    } else {
      throw new Error(message);
    }
  }
}

/**
 * Create a folder
 * @param {string} name 
 */
async function createFolder(name) {
  const url = newUrl(name);
  try {
    await login();
    const res = await fetch(url, {
      method: "MKCOL",
    });
    await assertResOK(res);
    location.href = url;
  } catch (err) {
    alert(`Cannot create folder \`${name}\`, ${err.message}`);
  }
}

async function createFile(name) {
  const url = newUrl(name);
  try {
    await login();
    const res = await fetch(url, {
      method: "PUT",
      body: "",
    });
    await assertResOK(res);
    location.href = url + "?edit";
  } catch (err) {
    alert(`Cannot create file \`${name}\`, ${err.message}`);
  }
}

async function addFileEntries(entries, dirs) {
  for (const entry of entries) {
    if (entry.isFile) {
      entry.file(file => {
        new Uploader(file, dirs).upload();
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader()
      dirReader.readEntries(entries => addFileEntries(entries, [...dirs, entry.name]));
    }
  }
}


function newUrl(name) {
  let url = baseUrl();
  if (!url.endsWith("/")) url += "/";
  url += name.split("/").map(encodeURIComponent).join("/");
  return url;
}

function baseUrl() {
  return location.href.split('?')[0];
}

function getPathSvg(path_type) {
  switch (path_type) {
    case "Dir":
      return ICONS.dir;
    case "SymlinkFile":
      return ICONS.symlinkFile;
    case "SymlinkDir":
      return ICONS.symlinkDir;
    default:
      return ICONS.file;
  }
}

function formatMtime(mtime) {
  if (!mtime) return ""
  const date = new Date(mtime);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1, 2);
  const day = padZero(date.getDate(), 2);
  const hours = padZero(date.getHours(), 2);
  const minutes = padZero(date.getMinutes(), 2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function padZero(value, size) {
  return ("0".repeat(size) + value).slice(-1 * size)
}

function formatSize(size) {
  if (size == null) return []
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (size == 0) return [0, "B"];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  return [Math.round(size / Math.pow(1024, i), 2), sizes[i]];
}

function formatDuration(seconds) {
  seconds = Math.ceil(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60
  return `${padZero(h, 2)}:${padZero(m, 2)}:${padZero(s, 2)}`;
}

function formatPercent(percent) {
  if (percent > 10) {
    return percent.toFixed(1) + "%";
  } else {
    return percent.toFixed(2) + "%";
  }
}

function encodedStr(rawStr) {
  return rawStr.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

async function assertResOK(res) {
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(await res.text())
  }
}
