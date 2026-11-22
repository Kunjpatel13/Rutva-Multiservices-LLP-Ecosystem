(function () {
  // Preloader Handler
  function initPreloader() {
    const preloader = document.getElementById("sitePreloader");
    if (!preloader) return;
    const hidePreloader = function () {
      preloader.classList.add("fade-out");
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 500);
    };
    if (document.readyState === "complete") {
      setTimeout(hidePreloader, 350);
    } else {
      window.addEventListener("load", function () {
        setTimeout(hidePreloader, 350);
      });
    }
    setTimeout(hidePreloader, 2500);
  }
  initPreloader();

  const isBusinessesDir = window.location.pathname.replace(/\\/g, '/').toLowerCase().includes('/businesses/');
  const businessesPrefix = isBusinessesDir ? '' : 'businesses/';
  const assetsPrefix = isBusinessesDir ? '../' : '';

  const iconMap = {
    "banking-point-24": "bi-bank",
    "my-fashion-centre": "bi-bag-heart",
    "rutva-resin-art": "bi-palette",
    "digital-print-hub": "bi-printer",
    "tours-travels": "bi-airplane",
    "delivery-partner": "bi-truck",
    "financial-services": "bi-graph-up-arrow",
    "radhe-krishna-food-zone": "bi-egg-fried"
  };

  // Set current copyright year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Populate footer business list
  const footer = document.getElementById("footerBusinesses");
  if (footer) {
    footer.innerHTML = (window.RUTVA_BUSINESSES || []).map(function (b) {
      return `<li class="mb-2"><a href="${businessesPrefix}${b.id}.html">${b.name}</a></li>`;
    }).join("");
  }

  // Setup business dropdown on contact page
  const select = document.getElementById("business");
  if (select) {
    (window.RUTVA_BUSINESSES || []).forEach(function (b) {
      const o = document.createElement("option");
      o.value = b.id;
      o.textContent = b.name;
      select.appendChild(o);
    });
    const requested = new URLSearchParams(window.location.search).get("business");
    if (requested) {
      select.value = requested;
    }
  }

  // Handle Contact Form submission
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const cfg = window.RUTVA_CONFIG || {};
      const email = cfg.companyEmail || "rutvamultiservices@gmail.com";

      const bObj = (window.RUTVA_BUSINESSES || []).find(function (x) {
        return x.id === data.get("business");
      });
      const bName = bObj ? bObj.name : (data.get("business") || "General Enquiry");
      const submitter = e.submitter ? e.submitter.value : "email";
      const targetPhone = (bObj && bObj.whatsapp) ? bObj.whatsapp : (cfg.whatsappNumber || "917069300077");

      if (submitter === "whatsapp") {
        const waText = `*Enquiry for ${bName} via Website*%0A%0A*Name:* ${encodeURIComponent(data.get("name"))}%0A*Phone:* ${encodeURIComponent(data.get("phone"))}%0A*Email:* ${encodeURIComponent(data.get("email") || "Not provided")}%0A*Business:* ${encodeURIComponent(bName)}%0A*Message:* ${encodeURIComponent(data.get("message"))}`;
        window.open(`https://wa.me/${targetPhone}?text=${waText}`, "_blank");
        const fb = document.getElementById("formFeedback");
        if (fb) {
          fb.className = "alert alert-success mt-3 py-2 px-3 small";
          fb.innerHTML = '<i class="bi bi-whatsapp me-2"></i><strong>Opening WhatsApp:</strong> Your enquiry message is ready to send.';
        }
      } else {
        const subject = encodeURIComponent(`Website enquiry - ${bName}`);
        const body = encodeURIComponent(
          `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nEmail: ${data.get("email") || "Not provided"}\nBusiness: ${bName}\n\nMessage:\n${data.get("message")}`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        const fb = document.getElementById("formFeedback");
        if (fb) {
          fb.className = "alert alert-success mt-3 py-2 px-3 small";
          fb.innerHTML = '<i class="bi bi-envelope-check me-2"></i><strong>Opening Email client:</strong> Your enquiry email has been prepared.';
        }
      }
    });
  }

  // ==========================================
  // DYNAMIC ECOSYSTEM & ORGANIZATION CHART (B1 to B8 in Sequence)
  // ==========================================
  const treeWrapper = document.getElementById("treeCanvasWrapper");
  if (treeWrapper && window.RUTVA_BUSINESSES) {
    const nodeMapping = {
      "banking-point-24": { code: "B1", group: "finance" },
      "my-fashion-centre": { code: "B2", group: "creative" },
      "rutva-resin-art": { code: "B3", group: "creative" },
      "digital-print-hub": { code: "B4", group: "creative" },
      "tours-travels": { code: "B5", group: "services" },
      "delivery-partner": { code: "B6", group: "services" },
      "financial-services": { code: "B7", group: "finance" },
      "radhe-krishna-food-zone": { code: "B8", group: "services" }
    };

    const childGrid = document.getElementById("childNodesGrid");

    function renderTreeCard(b) {
      const meta = nodeMapping[b.id] || { code: "B", group: "services" };
      const targetUrl = `${businessesPrefix}${b.id}.html`;
      return `
      <div class="col-lg-4 col-md-6 d-flex align-items-stretch tree-col-item" data-group="${meta.group}">
        <div class="tree-card w-100" id="tree-node-${b.id}" data-id="${b.id}" data-group="${meta.group}" role="button" tabindex="0" onclick="window.location.href='${targetUrl}'" title="Click to view ${b.name}">
          <div class="card-pin"></div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge-code">${meta.code}</span>
            <span class="badge bg-light text-primary text-truncate fw-semibold" style="max-width:150px;font-size:0.75rem;">${b.category}</span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <img src="${assetsPrefix}assets/images/${b.logo}" alt="${b.name} Logo" class="tree-card-logo">
            <h4 class="h6 mb-0 fw-bold text-navy text-truncate">${b.name}</h4>
          </div>
          <p class="small text-muted mb-3 lh-sm" style="min-height:36px;">${b.short}</p>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <span class="text-link small fw-bold">Explore details <i class="bi bi-arrow-right ms-1"></i></span>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 small">Open <i class="bi bi-box-arrow-up-right ms-1"></i></span>
          </div>
        </div>
      </div>`;
    }

    // Populate child nodes sequentially (B1, B2, B3, B4, B5, B6, B7, B8)
    if (childGrid) {
      childGrid.innerHTML = window.RUTVA_BUSINESSES.map(renderTreeCard).join("");
    }

    // SVG Line Drawing Logic
    function drawTreeLines() {
      const svg = document.getElementById("treeSvg");
      const linesGroup = document.getElementById("treeLinesGroup");
      const parentCard = document.getElementById("parentOrgCard");
      if (!svg || !linesGroup || !treeWrapper || !parentCard) return;

      const wRect = treeWrapper.getBoundingClientRect();
      const pRect = parentCard.getBoundingClientRect();

      svg.style.width = wRect.width + "px";
      svg.style.height = wRect.height + "px";
      svg.setAttribute("viewBox", `0 0 ${wRect.width} ${wRect.height}`);

      linesGroup.innerHTML = "";

      const pCenterX = pRect.left + pRect.width / 2 - wRect.left;
      const pBottomY = pRect.bottom - wRect.top;

      window.RUTVA_BUSINESSES.forEach(function (b) {
        const cardEl = document.getElementById(`tree-node-${b.id}`);
        const colItem = cardEl ? cardEl.closest(".tree-col-item") : null;
        if (!cardEl || (colItem && colItem.classList.contains("filtered-out"))) return;

        const cRect = cardEl.getBoundingClientRect();
        const endX = cRect.left + cRect.width / 2 - wRect.left;
        const endY = cRect.top - wRect.top;

        let startX = pCenterX;
        let startY = pBottomY;
        const diffX = endX - pCenterX;

        if (diffX < -50) {
          startX = pCenterX - 50;
        } else if (diffX > 50) {
          startX = pCenterX + 50;
        } else {
          startX = pCenterX;
        }

        const deltaY = Math.max(30, endY - startY);
        const cpY1 = startY + deltaY * 0.45;
        const cpY2 = endY - deltaY * 0.35;
        const d = `M ${startX} ${startY} C ${startX} ${cpY1}, ${endX} ${cpY2}, ${endX} ${endY}`;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "tree-line");
        path.setAttribute("id", `line-${b.id}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "url(#lineGradIdle)");
        path.setAttribute("stroke-width", "2.5");
        path.setAttribute("stroke-dasharray", "6 4");
        linesGroup.appendChild(path);

        // Hover events
        cardEl.onmouseenter = function () {
          highlightBranch(b.id, true);
        };
        cardEl.onmouseleave = function () {
          highlightBranch(b.id, false);
        };
      });
    }

    function highlightBranch(id, active) {
      const line = document.getElementById(`line-${id}`);
      const cardEl = document.getElementById(`tree-node-${id}`);
      const parentCard = document.getElementById("parentOrgCard");
      if (active) {
        if (line) {
          line.setAttribute("stroke", "url(#lineGradActive)");
          line.setAttribute("stroke-width", "4");
          line.classList.add("active-pulse");
          line.parentNode.appendChild(line);
        }
        if (cardEl) cardEl.classList.add("card-active");
        if (parentCard) parentCard.classList.add("parent-active");
      } else {
        if (line) {
          line.setAttribute("stroke", "url(#lineGradIdle)");
          line.setAttribute("stroke-width", "2.5");
          line.classList.remove("active-pulse");
        }
        if (cardEl) cardEl.classList.remove("card-active");
        if (parentCard) parentCard.classList.remove("parent-active");
      }
    }

    // Filter Buttons logic
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active", "btn-primary");
          b.classList.add("btn-outline-secondary");
        });
        btn.classList.add("active", "btn-primary");
        btn.classList.remove("btn-outline-secondary");

        const filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".tree-col-item").forEach(function (item) {
          const group = item.getAttribute("data-group");
          if (filter === "all" || group === filter) {
            item.classList.remove("filtered-out");
            item.style.display = "";
          } else {
            item.classList.add("filtered-out");
            item.style.display = "none";
          }
        });
        setTimeout(drawTreeLines, 50);
      });
    });

    // Redraw lines on resize
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(drawTreeLines, 80);
    });

    // Initial draw
    setTimeout(drawTreeLines, 200);
    window.addEventListener("load", function () {
      setTimeout(drawTreeLines, 400);
    });
  }
})();
