const API = 'http://localhost:8080/api';
let products = [];
let cart = [];
let currentFilter = 'Todos';
let adminSession = Boolean(localStorage.getItem('motoaventura_token'));
const $ = (selector) => document.querySelector(selector);
const money = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
const assetUrl = (path) => path && path.startsWith('PRODUCTOS/') ? `../${path}` : path;
async function compressTryImage(file) {
  const bitmap = await createImageBitmap(file); const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale); canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
}

const fallbackProducts = [
  {id: 1, name: 'Casaca LS2 Narvik', category: 'Indumentaria', price: 449.90, description: 'Casaca para motociclista con protecciones.', imageUrl: '../PRODUCTOS/CASACA_LS2_NARVIK/CASACA-LS2-PARA-HOMBRE-NARVIK-AZULNEGROGRISROJO.jpeg.webp'},
  {id: 2, name: 'Pantalón LS2 Douglas', category: 'Indumentaria', price: 329.90, description: 'Pantalón para motociclista con protección.', imageUrl: '../PRODUCTOS/PANTALON_LS2_DOUGLAS/PANTALON-DOUGLAS.png.webp'},
  {id: 3, name: 'Traje LS2 para lluvia Aqua Negro', category: 'Indumentaria', price: 189.90, description: 'Traje impermeable para protegerse de la lluvia.', imageUrl: '../PRODUCTOS/TRAJE_LS2_PARA_LLUVIA_AQUA_NEGRO/TRAJE-LS2-PARA-LLUVIA-AQUA-NEGRO-1.jpeg.webp'},
  {id: 4, name: 'Botas LS2 WP Garra', category: 'Indumentaria', price: 399.90, description: 'Botas resistentes al agua para motociclistas.', imageUrl: '../PRODUCTOS/BOTAS_LS2_WP/BOTA-HOMBRE-GARRA-WP-1.jpeg'},
  {id: 5, name: 'Guantes LS2 Snow', category: 'Guantes', price: 159.90, description: 'Guantes para días fríos.', imageUrl: '../PRODUCTOS/GUANTES_LS2_SNOW/GUANTE-SNOW-NEGRO-1.png'},
  {id: 6, name: 'Guantes LS2 ThermoRain', category: 'Guantes', price: 179.90, description: 'Guantes impermeables para lluvia.', imageUrl: '../PRODUCTOS/GUANTES_LS2_THERMORAIN/GUANTE-LS2-THERMORAIN-NEGROAMARILLOFLUO-1.jpeg'},
  {id: 7, name: 'Rodillera Scoyco SRK12', category: 'Protección', price: 119.90, description: 'Rodillera de protección para motociclistas.', imageUrl: '../PRODUCTOS/RODILLERA_SCOYCO/SRK12-N.jpg.webp'},
  {id: 8, name: 'Rodillera XKudo R39C39', category: 'Protección', price: 139.90, description: 'Rodillera ajustable para ciudad y carretera.', imageUrl: '../PRODUCTOS/RODILLERA_XKUDO/R39C39-1.jpeg'}
];

function imageHtml(product, className = 'product-image') {
  return product.imageUrl ? `<div class="${className}"><img src="${assetUrl(product.imageUrl)}" alt="${product.name}" loading="lazy"></div>` : `<div class="${className}">${product.category}</div>`;
}

function renderProducts() {
  const grid = $('#productGrid');
  if (!grid) return;
  const query = ($('#searchInput')?.value || '').toLowerCase();
  const list = products.filter((p) => (currentFilter === 'Todos' || p.category === currentFilter) && (!query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)));
  grid.innerHTML = list.length ? list.map((p) => `<article class="product-card" data-id="${p.id}">${imageHtml(p)}<span class="sale">${p.onSale ? 'Oferta' : 'Disponible'}</span><div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><div class="price"><strong>${money(p.price)}</strong></div></div></article>`).join('') : '<p>No hay productos disponibles.</p>';
  grid.querySelectorAll('.product-card').forEach((card) => card.addEventListener('click', () => openProduct(Number(card.dataset.id))));
}

function openProduct(id) {
  const product = products.find((p) => Number(p.id) === Number(id));
  if (!product) return;
  const images = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
  const main = images[0] ? `<img src="${assetUrl(images[0])}" alt="${product.name}">` : product.category;
  const thumbs = images.map((src, index) => `<button type="button" data-image="${assetUrl(src)}"><img src="${assetUrl(src)}" alt="Vista ${index + 1}"></button>`).join('');
  $('#productDetail').innerHTML = `<div class="product-detail"><div><div class="product-image product-main-image" style="height:300px">${main}</div><div class="product-gallery">${thumbs}</div></div><div class="dialog-content"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><p>${product.description || ''}</p><h3>${money(product.price)}</h3><div class="hero-actions"><button class="primary-button" id="detailAdd">Añadir al carrito</button><button class="secondary-button" id="detailTry">PROBAR con IA ↗</button></div></div></div>`;
  $('#productDetail').querySelectorAll('[data-image]').forEach((button) => button.addEventListener('click', () => { const image = $('#productDetail .product-main-image img'); if (image) image.src = button.dataset.image; }));
  $('#detailAdd').onclick = () => addToCart(product.id);
  $('#detailTry').onclick = () => openTry(product.id);
  $('#productDialog').showModal();
}

// Versiones finales: se declaran al final para que prevalezcan sobre los manejadores iniciales.
async function loadOrders() {
  const box=$('#orderList'); if(!box)return;
  try { const response=await fetch(`${API}/orders`,{headers:authHeaders()}); if(!response.ok)throw new Error(); const orders=await response.json();
    box.innerHTML=orders.length?orders.map(o=>{let items=[];try{items=JSON.parse(o.items||'[]');}catch(e){} const detail=items.map(i=>`${i.name} x${i.qty}`).join(', ')||'Detalle no disponible'; return `<div class="admin-row"><span><strong>${o.firstName} ${o.lastName}</strong><small>${o.shippingAddress}, ${o.district} · ${o.phone||''}</small><small>Productos: ${detail}</small></span><strong>${money(o.total)}</strong></div>`;}).join(''):'<p>No hay pedidos registrados.</p>';
  } catch(e){box.innerHTML='<p>No se pudieron cargar los pedidos.</p>';}
}

async function finalOpenProfile(){const token=localStorage.getItem('motoaventura_customer_token');if(!token)return $('#authDialog').showModal();const response=await fetch(`${API}/profile`,{headers:{Authorization:`Bearer ${token}`}});if(!response.ok){localStorage.removeItem('motoaventura_customer_token');return $('#authDialog').showModal();}const p=await response.json();$('#profileFirstName').value=p.firstName||'';$('#profileLastName').value=p.lastName||'';$('#profileEmail').value=p.email||'';$('#profileAddress').value=p.address||'';$('#profileDistrict').value=p.district||'';$('#profilePhone').value=p.phone||'';$('#profileDialog').showModal();}
$('#loginBtn').onclick=()=>localStorage.getItem('motoaventura_customer_token')?finalOpenProfile():$('#authDialog').showModal();
$('#authForm').onsubmit=async(e)=>{e.preventDefault();const data=registerMode?{firstName:$('#registerFirstName').value,lastName:$('#registerLastName').value,email:$('#authEmail').value,password:$('#authPassword').value}:{email:$('#authEmail').value,password:$('#authPassword').value};const endpoint=registerMode?'/auth/register':'/auth/login';const response=await fetch(`${API}${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!response.ok)return toast(registerMode?'No se pudo crear la cuenta':'Correo o contraseña incorrectos');if(registerMode){const login=await fetch(`${API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.email,password:data.password})});const logged=await login.json();localStorage.setItem('motoaventura_customer_token',logged.token);$('#authDialog').close();toast('Registro exitoso. Bienvenido a MotoAventura');setTimeout(finalOpenProfile,300);}else{const logged=await response.json();localStorage.setItem('motoaventura_customer_token',logged.token);$('#authDialog').close();toast('Sesión iniciada correctamente');}};

// Ajustes de interacción y administración del catálogo.
[['Guantes','Guantes'],['Protecciones','Protecciones']].forEach(([category,label]) => {
  if (!document.querySelector(`.filter[data-filter="${category}"]`)) {
    const button = document.createElement('button'); button.className = 'filter'; button.dataset.filter = category; button.textContent = label;
    button.onclick = () => { document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active')); button.classList.add('active'); currentFilter = category; renderProducts(); document.querySelector('#productos')?.scrollIntoView({behavior:'smooth'}); };
    document.querySelector('.filters')?.append(button);
  }
});

$('#searchInput')?.addEventListener('input', () => { renderProducts(); document.querySelector('#productos')?.scrollIntoView({behavior:'smooth', block:'start'}); });
$('#productDialog')?.addEventListener('click', (event) => { if (event.target === $('#productDialog')) $('#productDialog').close(); });
$('#tryDialog')?.addEventListener('click', (event) => { if (event.target === $('#tryDialog')) $('#tryDialog').close(); });

function adminField(id, label, type = 'text') {
  if ($('#' + id)) return;
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input'); input.id = id; input.type = type === 'textarea' ? undefined : type; input.placeholder = label;
  const wrap = document.createElement('label'); wrap.textContent = label; wrap.append(input); $('#adminDesc')?.closest('label')?.after(wrap);
}
adminField('adminStock', 'Stock', 'number'); adminField('adminVideo', 'Video (URL opcional)'); adminField('adminImages', 'Imágenes: una ruta por línea', 'textarea');
if (!$('#adminId')) { const hidden=document.createElement('input'); hidden.id='adminId'; hidden.type='hidden'; $('#adminForm')?.prepend(hidden); }

function adminPayload() {
  const images = ($('#adminImages')?.value || '').split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
  return {name:$('#adminName').value, category:$('#adminCategory').value, price:Number($('#adminPrice').value), stock:Number($('#adminStock')?.value || 10), description:$('#adminDesc').value, videoUrl:$('#adminVideo')?.value || null, imageUrl:images[0] || null, imageUrls:images, featured:false, onSale:false};
}
$('#adminForm').onsubmit = async (event) => { event.preventDefault(); const id=$('#adminId')?.value; const response=await fetch(`${API}/products${id ? '/' + id : ''}`, {method:id?'PUT':'POST', headers:authHeaders(), body:JSON.stringify(adminPayload())}); if(response.ok){event.target.reset(); if($('#adminId'))$('#adminId').value=''; await renderAdmin(); await loadProducts(); toast(id?'Producto actualizado':'Producto guardado');} else toast('No se pudo guardar el producto'); };
const adminObserver = new MutationObserver(() => document.querySelectorAll('#adminList [data-edit]').forEach((button) => { button.onclick = () => { const product=products.find((p)=>Number(p.id)===Number(button.dataset.edit)); if(!product)return; $('#adminId').value=product.id; $('#adminName').value=product.name||''; $('#adminCategory').value=product.category||'Indumentaria'; $('#adminPrice').value=product.price||0; $('#adminStock').value=product.stock??0; $('#adminDesc').value=product.description||''; $('#adminVideo').value=product.videoUrl||''; $('#adminImages').value=(product.imageUrls||(product.imageUrl?[product.imageUrl]:[])).join('\n'); toast('Producto cargado para editar'); } }));
adminObserver.observe($('#adminList'), {childList:true, subtree:true});

// Cuenta del cliente: al registrarse inicia sesión y abre su perfil.
if (!$('#profileDialog')) { document.body.insertAdjacentHTML('beforeend', '<dialog id="profileDialog"><button class="dialog-close" data-profile-close>×</button><div class="dialog-content"><p class="eyebrow">MI CUENTA</p><h2>Perfil MotoAventura.</h2><form id="profileForm" class="simple-form"><label>Nombres<input id="profileFirstName" required></label><label>Apellidos<input id="profileLastName"></label><label>Correo<input id="profileEmail" disabled></label><label>Dirección de envío<input id="profileAddress" placeholder="Av. / Jr. / Calle"></label><label>Distrito<input id="profileDistrict"></label><label>Teléfono<input id="profilePhone"></label><button class="primary-button full">Guardar datos</button></form></div></dialog>'); }
const customerToken = () => localStorage.getItem('motoaventura_customer_token') || '';
async function openProfile() { const response=await fetch(`${API}/profile`, {headers:{Authorization:`Bearer ${customerToken()}`}}); if(!response.ok)return toast('Inicia sesión para ver tu perfil'); const p=await response.json(); $('#profileFirstName').value=p.firstName||''; $('#profileLastName').value=p.lastName||''; $('#profileEmail').value=p.email||''; $('#profileAddress').value=p.address||''; $('#profileDistrict').value=p.district||''; $('#profilePhone').value=p.phone||''; $('#profileDialog').showModal(); }
$('#profileDialog').addEventListener('click',(e)=>{if(e.target===$('#profileDialog'))$('#profileDialog').close();}); $('[data-profile-close]')?.addEventListener('click',()=>$('#profileDialog').close());
$('#profileForm').onsubmit=async(e)=>{e.preventDefault();const response=await fetch(`${API}/profile`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${customerToken()}`},body:JSON.stringify({firstName:$('#profileFirstName').value,lastName:$('#profileLastName').value,address:$('#profileAddress').value,district:$('#profileDistrict').value,phone:$('#profilePhone').value})});if(response.ok){$('#profileDialog').close();toast('Datos del perfil guardados');}else toast('No se pudieron guardar los datos');};
$('#loginBtn').onclick=()=>customerToken()?openProfile():$('#authDialog').showModal();
$('#authForm').onsubmit=async(e)=>{e.preventDefault();const body=registerMode?{firstName:$('#registerFirstName').value,lastName:$('#registerLastName').value,email:$('#authEmail').value,password:$('#authPassword').value}:{email:$('#authEmail').value,password:$('#authPassword').value};const endpoint=registerMode?'/auth/register':'/auth/login';const response=await fetch(`${API}${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!response.ok)return toast(registerMode?'No se pudo registrar. Revisa los datos.':'Correo o contraseña incorrectos');if(registerMode){toast('Registro exitoso. Bienvenido a MotoAventura');const login=await fetch(`${API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:body.email,password:body.password})});const data=await login.json();localStorage.setItem('motoaventura_customer_token',data.token);registerMode=false;$('#authDialog').close();setTimeout(openProfile,250);}else{const data=await response.json();localStorage.setItem('motoaventura_customer_token',data.token);$('#authDialog').close();toast('Sesión iniciada correctamente');}};

function addToCart(id) { const product = products.find((p) => Number(p.id) === Number(id)); if (!product) return; const line = cart.find((p) => p.id === product.id); line ? line.qty++ : cart.push({...product, qty: 1}); updateCart(); toast('Producto añadido al carrito'); }
function updateCart() { $('#cartCount').textContent = cart.reduce((sum, p) => sum + p.qty, 0); $('#cartTotal').textContent = money(cart.reduce((sum, p) => sum + Number(p.price) * p.qty, 0)); $('#cartItems').innerHTML = cart.length ? cart.map((p) => `<div class="cart-line"><span>${p.name}<br><small>${p.qty} × ${money(p.price)}</small></span><strong>${money(p.qty * p.price)}</strong></div>`).join('') : '<p>Tu carrito está vacío.</p>'; }
function toast(message) { const element = $('#toast'); element.textContent = message; element.classList.add('show'); setTimeout(() => element.classList.remove('show'), 2200); }
function authHeaders() { return {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('motoaventura_token') || ''}`}; }

async function loadProducts() { try { const response = await fetch(`${API}/products`); if (!response.ok) throw new Error(); products = await response.json(); } catch (error) { products = fallbackProducts; toast('Se muestran los productos de demostración'); } renderProducts(); }
function openTry(id) { const product = products.find((p) => Number(p.id) === Number(id)); $('#tryTitle').textContent = product ? `Prueba ${product.name}` : 'Mira cómo se vería contigo.'; $('#processTry').dataset.productId = id || ''; $('#tryDialog').showModal(); }
async function loadOrders() { const box = $('#orderList'); if (!box) return; try { const response = await fetch(`${API}/orders`, {headers: authHeaders()}); const orders = await response.json(); box.innerHTML = orders.length ? orders.map((o) => `<div class="admin-row"><span><strong>${o.firstName} ${o.lastName}</strong><small>${o.shippingAddress}, ${o.district}</small></span><strong>${money(o.total)}</strong></div>`).join('') : '<p>No hay pedidos registrados.</p>'; } catch (error) { box.innerHTML = '<p>No se pudieron cargar los pedidos.</p>'; } }
async function renderAdmin() { const list = $('#adminList'); const response = await fetch(`${API}/products` , {headers: authHeaders()}); products = response.ok ? await response.json() : products; list.innerHTML = '<p class="eyebrow">PRODUCTOS ACTUALES</p>' + products.map((p) => `<div class="admin-row"><span><strong>${p.name}</strong><small>${p.category} · ${money(p.price)} · stock ${p.stock ?? 0}</small></span><button data-remove="${p.id}">Retirar</button></div>`).join(''); list.querySelectorAll('[data-remove]').forEach((button) => button.onclick = async () => { const result = await fetch(`${API}/products/${button.dataset.remove}`, {method:'DELETE', headers:authHeaders()}); if (result.ok) { await renderAdmin(); await loadProducts(); toast('Producto retirado'); } }); loadOrders(); }

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active')); button.classList.add('active'); currentFilter = button.dataset.filter; renderProducts(); }));
$('#searchToggle').onclick = () => { $('#searchPanel').classList.toggle('open'); $('#searchInput').focus(); };
$('#searchInput').oninput = renderProducts;
$('#cartBtn').onclick = () => $('#cartDrawer').classList.add('open');
$('[data-close-cart]').onclick = () => $('#cartDrawer').classList.remove('open');
document.querySelectorAll('[data-close]').forEach((button) => button.onclick = () => button.closest('dialog').close());
$('#loginBtn').onclick = () => $('#authDialog').showModal();
$('#guestBtn').onclick = () => { $('#authDialog').close(); $('#checkoutDialog').showModal(); };
$('#authForm').onsubmit = async (event) => { event.preventDefault(); const fields = event.target.querySelectorAll('input'); const response = await fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:fields[0].value, password:fields[1].value})}); if (!response.ok) return toast('Correo o contraseña incorrectos'); const data = await response.json(); localStorage.setItem('motoaventura_customer_token', data.token); $('#authDialog').close(); toast('Sesión iniciada correctamente'); };
let registerMode = false;
$('#registerBtn').onclick = () => { registerMode = !registerMode; $('#registerFields').hidden = !registerMode; $('#authTitle').textContent = registerMode ? 'Crea tu cuenta.' : 'Tu cuenta, a tu ritmo.'; $('#authSubmit').textContent = registerMode ? 'Registrarme' : 'Iniciar sesión'; $('#registerBtn').textContent = registerMode ? 'Ya tengo una cuenta' : 'Crear una cuenta'; };
$('#authForm').onsubmit = async (event) => { event.preventDefault(); const body = registerMode ? {firstName:$('#registerFirstName').value,lastName:$('#registerLastName').value,email:$('#authEmail').value,password:$('#authPassword').value} : {email:$('#authEmail').value,password:$('#authPassword').value}; const endpoint = registerMode ? '/auth/register' : '/auth/login'; const response = await fetch(`${API}${endpoint}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); if (!response.ok) return toast(registerMode ? 'No se pudo crear la cuenta' : 'Correo o contraseña incorrectos'); if (registerMode) { registerMode=false; $('#registerBtn').click(); toast('Cuenta creada. Ahora puedes iniciar sesión'); } else { const data=await response.json(); localStorage.setItem('motoaventura_customer_token',data.token); $('#authDialog').close(); toast('Sesión iniciada correctamente'); } };
$('#checkoutBtn').onclick = () => { if (!cart.length) return toast('Agrega al menos un producto'); $('#cartDrawer').classList.remove('open'); $('#checkoutDialog').showModal(); };
$('#adminBtn').onclick = async () => { if (!adminSession) return $('#adminAuthDialog').showModal(); const check=await fetch(`${API}/products`,{headers:authHeaders()}); if(check.status===401||check.status===403){localStorage.removeItem('motoaventura_token');adminSession=false;toast('La sesión de administrador expiró. Ingresa nuevamente.');return $('#adminAuthDialog').showModal();} $('#adminDialog').showModal(); renderAdmin(); };
$('#finishAdmin').onclick = () => { localStorage.removeItem('motoaventura_token'); adminSession = false; $('#adminDialog').close(); toast('Sesión finalizada'); };
$('#adminAuthForm').onsubmit = async (event) => { event.preventDefault(); const response = await fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:$('#adminEmail').value, password:$('#adminPassword').value})}); const data = await response.json(); if (!response.ok || data.role !== 'ADMINISTRADOR') return toast('Credenciales incorrectas'); localStorage.setItem('motoaventura_token', data.token); adminSession = true; $('#adminAuthDialog').close(); $('#adminDialog').showModal(); renderAdmin(); };
$('#adminForm').onsubmit = async (event) => { event.preventDefault(); const body = {name:$('#adminName').value, category:$('#adminCategory').value, price:Number($('#adminPrice').value), stock:10, description:$('#adminDesc').value, featured:false, onSale:false}; const response = await fetch(`${API}/products`, {method:'POST', headers:authHeaders(), body:JSON.stringify(body)}); if (response.ok) { event.target.reset(); await renderAdmin(); await loadProducts(); toast('Producto guardado'); } };
$('#checkoutForm').onsubmit = async (event) => { event.preventDefault(); const fields = event.target.querySelectorAll('input'); const order = {firstName:fields[0].value, lastName:fields[1].value, shippingAddress:fields[2].value, district:fields[3].value, phone:fields[4].value, total:cart.reduce((sum,p) => sum + Number(p.price) * p.qty, 0), items:JSON.stringify(cart)}; const response = await fetch(`${API}/orders`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(order)}); if (!response.ok) return toast('No se pudo registrar el pedido'); $('#checkoutDialog').close(); cart = []; updateCart(); toast('Pedido registrado correctamente'); };
$('#processTry').onclick = async () => { const file = $('#tryFile').files[0]; if (!file) return toast('Selecciona una fotografía'); const form = new FormData(); form.append('photo', file); form.append('productId', $('#processTry').dataset.productId || ''); form.append('mode', $('#tryMode').value); $('#tryResult').innerHTML = '<p>Procesando imagen...</p>'; const response = await fetch(`${API}/try-on`, {method:'POST', body:form}); const result = await response.json(); $('#tryResult').innerHTML = `<div class="product-image" style="height:160px">VISTA PREVIA</div><p>${result.message || 'Imagen recibida correctamente.'}</p>`; };
$('#tryMode')?.addEventListener('change', (event) => { $('#tryUploadLabel').textContent = event.target.value === 'motorcycle' ? 'Sube una foto de tu motocicleta' : 'Sube una foto tuya'; });
$('#tryFile')?.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const oldPreview = $('#tryUploadPreview');
  if (oldPreview) oldPreview.remove();
  const preview = document.createElement('div');
  preview.id = 'tryUploadPreview';
  preview.className = 'try-upload-preview';
  preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Foto seleccionada"><span>${file.name}</span>`;
  $('#tryFile').closest('.upload-box').after(preview);
  $('#tryUploadLabel').textContent = 'Foto seleccionada';
});
$('#processTry').onclick = async () => {
  const file = $('#tryFile').files[0];
  if (!file) return toast('Selecciona una fotografía');
  const preview = URL.createObjectURL(file);
  $('#tryResult').innerHTML = `<div class="try-preview"><img src="${preview}" alt="Imagen seleccionada"></div><p>Imagen recibida. Se está preparando la vista previa del producto.</p>`;
  const form = new FormData(); form.append('photo', await compressTryImage(file), 'foto-cliente.jpg'); form.append('productId', $('#processTry').dataset.productId || ''); form.append('mode', $('#tryMode').value);
  const selectedProduct = products.find((p) => Number(p.id) === Number($('#processTry').dataset.productId));
  const garmentCategory = selectedProduct?.name?.toLowerCase().includes('pantal') ? 'lower_body' : selectedProduct?.name?.toLowerCase().includes('traje') || selectedProduct?.name?.toLowerCase().includes('casaca') ? 'upper_body' : 'accessories';
  form.append('garmentCategory', garmentCategory);
  const garmentPath = selectedProduct?.imageUrl ? assetUrl(selectedProduct.imageUrl) : '';
  if (garmentPath) { try { const garmentResponse = await fetch(garmentPath); const garmentBlob = await garmentResponse.blob(); form.append('garment', await compressTryImage(garmentBlob), 'producto.jpg'); } catch (error) { /* continúa con el modo demostración */ } }
  try { const response = await fetch(`${API}/try-on`, {method:'POST', body:form}); const result = await response.json(); let generated = ''; try { const parsed = typeof result.output === 'string' ? JSON.parse(result.output) : result.output; generated = Array.isArray(parsed) ? parsed[0] : parsed; } catch (error) { generated = result.output; } const image = generated && String(generated).startsWith('http') ? generated : preview; const label = image !== preview ? '<small>Resultado generado por Replicate.</small>' : (result.status === 'DEMO' ? '<small>Modo demostración: Replicate no está configurado.</small>' : '<small>Replicate no devolvió una imagen. Revisa la consola del backend.</small>'); $('#tryResult').innerHTML = `<div class="try-preview"><img src="${image}" alt="Vista previa generada"></div><p>${result.message || 'Imagen recibida correctamente.'}</p>${label}`; } catch (error) { $('#tryResult').innerHTML += '<p>No se pudo contactar al servicio de IA. Revisa que el backend siga encendido.</p>'; }
};

async function renderAdmin() {
  const list = $('#adminList');
  try { const response = await fetch(`${API}/products`); if (response.ok) products = await response.json(); } catch (error) { }
  list.innerHTML = '<p class="eyebrow">PRODUCTOS ACTUALES</p>' + products.map((p) => `<div class="admin-row"><span><strong>${p.name}</strong><small>${p.category} · ${money(p.price)} · stock ${p.stock ?? 0}</small></span><span><button data-edit="${p.id}">Editar</button> <button data-remove="${p.id}">Retirar</button></span></div>`).join('');
  list.querySelectorAll('[data-edit]').forEach((button) => button.onclick = async () => {
    const product = products.find((p) => Number(p.id) === Number(button.dataset.edit));
    const price = prompt('Nuevo precio:', product.price); const stock = prompt('Nuevo stock:', product.stock ?? 0); const description = prompt('Nueva descripción:', product.description || '');
    if (price === null || stock === null || description === null) return;
    const response = await fetch(`${API}/products/${product.id}`, {method:'PUT', headers:authHeaders(), body:JSON.stringify({...product, price:Number(price), stock:Number(stock), description})});
    if (response.ok) { await renderAdmin(); await loadProducts(); toast('Producto actualizado'); } else toast('No se pudo actualizar el producto');
  });
  list.querySelectorAll('[data-remove]').forEach((button) => button.onclick = async () => { const response = await fetch(`${API}/products/${button.dataset.remove}`, {method:'DELETE', headers:authHeaders()}); if (response.ok) { await renderAdmin(); await loadProducts(); toast('Producto retirado'); } });
  loadOrders();
}

renderProducts(); updateCart(); loadProducts();

function openProduct(id) {
  const product = products.find((p) => Number(p.id) === Number(id));
  if (!product) return;
  const images = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
  const main = images[0] ? `<img src="${assetUrl(images[0])}" alt="${product.name}">` : product.category;
  const thumbs = images.map((src, index) => `<button type="button" data-image="${assetUrl(src)}"><img src="${assetUrl(src)}" alt="Vista ${index + 1}"></button>`).join('');
  const description = product.description || 'Producto pensado para acompañar tus recorridos en moto con comodidad y protección.';
  const additional = product.category === 'Indumentaria' ? 'Prenda diseñada para motociclistas. Revisa las tallas disponibles y elige la que mejor se adapte a ti.' : 'Accesorio pensado para mejorar la seguridad y comodidad durante tus recorridos.';
  $('#productDetail').innerHTML = `<div class="product-detail-page"><div class="product-detail-top"><div class="product-gallery-area"><div class="product-image product-main-image">${main}</div><div class="product-gallery">${thumbs}</div></div><div class="product-detail-info"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><p class="product-short-description">${description}</p><h3 class="product-detail-price">${money(product.price)}</h3><p class="stock-note">Disponible · stock ${product.stock ?? 10}</p><div class="product-detail-actions"><button class="primary-button" id="detailAdd">Añadir al carrito</button><button class="secondary-button" id="detailTry">PROBAR con IA ↗</button></div></div></div><div class="product-information"><div class="information-heading"><h3>Descripción</h3><h3>Información adicional</h3></div><div class="information-columns"><div><p>${description}</p><p>${additional}</p></div><div><p><strong>Categoría:</strong> ${product.category}</p><p><strong>Marca:</strong> LS2 / MotoAventura</p><p><strong>Disponibilidad:</strong> En stock</p></div></div></div></div>`;
  $('#productDetail').querySelectorAll('[data-image]').forEach((button) => button.onclick = () => { const image = $('#productDetail .product-main-image img'); if (image) image.src = button.dataset.image; });
  const infoHeadings = $('#productDetail').querySelectorAll('.information-heading h3');
  const infoColumns = $('#productDetail').querySelector('.information-columns');
  if (infoHeadings.length === 2 && infoColumns) {
    infoHeadings[0].onclick = () => { infoColumns.children[0].style.display = 'block'; infoColumns.children[1].style.display = 'none'; };
    infoHeadings[1].onclick = () => { infoColumns.children[0].style.display = 'none'; infoColumns.children[1].style.display = 'block'; };
    infoHeadings[0].style.cursor = 'pointer'; infoHeadings[1].style.cursor = 'pointer';
    infoHeadings[1].click();
  }
  $('#detailAdd').onclick = () => addToCart(product.id);
  $('#detailTry').onclick = () => openTry(product.id);
  $('#productDialog').showModal();
}
