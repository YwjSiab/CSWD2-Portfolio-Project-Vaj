// components/NavSidebar.js
class NavSidebar extends HTMLElement {
  connectedCallback() {
    // Light DOM (no Shadow DOM) so page CSS can style it
    this.innerHTML = `
      <div class="sidebar-box">
        <nav>
        <aside class="sidebar-box">
          <h2> 
            <span class="asideText">Links to My</span>
          </h2>
          <ul>
            <li><a href="index.html"><strong>Home</strong></a></li>
            <li><a href="Resume.html">Resume</a></li>
            <li><a href="Projects.html">Projects</a></li>
            <li><a href="Contact.html">Contact</a></li>
          </ul>
          </aside>
        </nav>
      </div>
    `;
  }
}
customElements.define("nav-sidebar", NavSidebar);
