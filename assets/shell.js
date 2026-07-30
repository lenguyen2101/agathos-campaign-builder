/* ============================================================================
   Admin shell — left nav + top bar, shared by all three campaign pages.
   Mirrors the existing portal chrome. Only the Campaign Management branch is
   wired up; the other nav entries are present so the layer sits in the same
   information architecture, and are inert in this prototype.
   ============================================================================ */

var ICON = {
  gauge:    '<circle cx="12" cy="12" r="9"/><path d="M12 12l3.5-3.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  layers:   '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  users:    '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="8" r="3.2"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M16.4 5.2a3.2 3.2 0 0 1 0 5.6"/>',
  heart:    '<path d="M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.7 12 20 12 20z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 14H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 20.4 10H21a2 2 0 0 1 0 4h-.6a1.6 1.6 0 0 0-1.5 1z"/>',
  logs:     '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h1M4 12h1M4 18h1"/>',
  chev:     '<path d="M6 9l6 6 6-6"/>',
  menuFold: '<path d="M4 6h16M4 12h9M4 18h16"/><path d="M20 12l-3-3v6z" fill="currentColor" stroke="none"/>',
  home:     '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  bell:     '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10.5 20a1.8 1.8 0 0 0 3 0"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  refresh:  '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
  back:     '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
  pencil:   '<path d="M16.5 4.5l3 3L8 19H5v-3z"/><path d="M14.5 6.5l3 3"/>',
  save:     '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-6h8v6"/>',
  eye:      '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.6"/>',
  archive:  '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/>',
  trash:    '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
  search:   '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  check:    '<path d="M4 12.5l5 5L20 6.5"/>',
  warn:     '<path d="M12 3l9.5 17H2.5z"/><path d="M12 9v5M12 17h.01"/>',
  inbox:    '<path d="M4 13h4l1.5 3h5L16 13h4"/><path d="M4 13L6.5 5h11L20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>',
  doc:      '<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M8 8h3M8 11.5h3"/><circle cx="15" cy="16" r="3.2"/><path d="M13.7 16l1 1 1.8-2"/>'
};

function icon(name, size){
  return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none"'
    + ' stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
    + ICON[name] + '</svg>';
}

var SHELL_KEY = 'agathos.sidebar.collapsed';

function navLeaf(label, href, on){
  var cls = 'leaf' + (on ? ' on' : '');
  return href
    ? '<a class="' + cls + '" href="' + href + '"><span class="lbl">' + label + '</span></a>'
    : '<button class="' + cls + '" type="button"><span class="lbl">' + label + '</span></button>';
}

function navSub(label, kids, open){
  return '<div class="grp sub1' + (open ? ' open' : '') + '">'
    + '<button type="button" onclick="toggleNavGroup(this)"><span class="lbl">' + label + '</span>'
    + '<span class="chev">' + icon('chev', 14) + '</span></button>'
    + '<div class="kids">' + kids + '</div></div>';
}

/* activeKey: which leaf is highlighted. Only 'campaign' is used today. */
function mountShell(activeKey){
  var collapsed = localStorage.getItem(SHELL_KEY) === '1';

  var appKids =
      navSub('Project Management', navLeaf('Project') + navLeaf('Impact Report'), false)
    + navSub('Event Management',   navLeaf('Event')   + navLeaf('Ticket'), false)
    + navSub('Campaign Management', navLeaf('Campaign', 'index.html', activeKey === 'campaign'), true)
    + navSub('Site Content',       navLeaf('Page')    + navLeaf('Banner'), false);

  var nav =
      '<a href="#" onclick="return false"><span>' + icon('gauge') + '</span><span class="lbl">Dashboard</span></a>'
    + '<div class="grp app open">'
    +   '<button type="button" onclick="toggleNavGroup(this)"><span>' + icon('layers') + '</span>'
    +   '<span class="lbl">Application</span><span class="chev">' + icon('chev', 14) + '</span></button>'
    +   '<div class="kids">' + appKids + '</div>'
    + '</div>'
    + '<div class="grp">'
    +   '<button type="button" onclick="toggleNavGroup(this)"><span>' + icon('users') + '</span>'
    +   '<span class="lbl">User Management</span><span class="chev">' + icon('chev', 14) + '</span></button>'
    +   '<div class="kids">' + navLeaf('User') + navLeaf('Role') + '</div>'
    + '</div>'
    + '<div class="grp">'
    +   '<button type="button" onclick="toggleNavGroup(this)"><span>' + icon('users') + '</span>'
    +   '<span class="lbl">Org Management</span><span class="chev">' + icon('chev', 14) + '</span></button>'
    +   '<div class="kids">' + navLeaf('Organization') + '</div>'
    + '</div>'
    + '<a href="#" onclick="return false"><span>' + icon('heart') + '</span><span class="lbl">Health</span></a>'
    + '<a href="#" onclick="return false"><span>' + icon('settings') + '</span><span class="lbl">Configuration</span></a>'
    + '<a href="#" onclick="return false"><span>' + icon('logs') + '</span><span class="lbl">Logs</span></a>';

  var host = document.getElementById('shell');
  host.outerHTML =
      '<div class="layout' + (collapsed ? ' collapsed' : '') + '" id="layout">'
    +   '<aside class="sidebar">'
    +     '<div class="brand"><span class="wm">aga<i>t</i>hos</span><span class="sub">Admin</span></div>'
    +     '<nav class="nav">' + nav + '</nav>'
    +   '</aside>'
    +   '<div class="mainarea">'
    +     '<header class="topbar">'
    +       '<button class="iconbtn" type="button" title="Collapse menu" onclick="toggleSidebar()">' + icon('menuFold', 20) + '</button>'
    +       '<a class="crumb" href="index.html">' + icon('home', 16) + 'Home</a>'
    +       '<span class="spacer"></span>'
    +       '<button class="iconbtn" type="button" title="Notifications">' + icon('bell', 19) + '</button>'
    +       '<span class="who"><span class="av">🧑‍💼</span>admin</span>'
    +     '</header>'
    +     '<main class="content" id="content"></main>'
    +   '</div>'
    + '</div>';

  return document.getElementById('content');
}

function toggleSidebar(){
  var l = document.getElementById('layout');
  l.classList.toggle('collapsed');
  localStorage.setItem(SHELL_KEY, l.classList.contains('collapsed') ? '1' : '0');
}

function toggleNavGroup(btn){
  btn.parentNode.classList.toggle('open');
}
