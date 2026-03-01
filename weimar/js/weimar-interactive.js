/* ==========================
   WEIMAR SIMULATION - INTERACTIVE ELEMENTS
   ========================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================
  // Collapsible Sections
  // ==========================
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(function(collapsible) {
    collapsible.addEventListener('click', function() {
      this.classList.toggle('active');
      
      const content = this.nextElementSibling;
      content.classList.toggle('active');
      
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
  
  // ==========================
  // Tab System
  // ==========================
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const tabGroup = this.closest('.tab-container');
      const targetTab = this.dataset.tab;
      
      // Remove active from all buttons and contents in this group
      tabGroup.querySelectorAll('.tab-button').forEach(btn => 
        btn.classList.remove('active')
      );
      tabGroup.querySelectorAll('.tab-content').forEach(content => 
        content.classList.remove('active')
      );
      
      // Add active to clicked button and target content
      this.classList.add('active');
      tabGroup.querySelector(`#${targetTab}`).classList.add('active');
    });
  });
  
  // ==========================
  // Smooth Scrolling for Anchor Links
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, this.getAttribute('href'));
      }
    });
  });
  
  // ==========================
  // Modal System
  // ==========================
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloses = document.querySelectorAll('.modal-close');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });
  
  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });
  
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  // ==========================
  // Stability Index Meter Animation
  // ==========================
  function updateStabilityMeter(value) {
    // Value should be between -200 and +100
    const meter = document.querySelector('.meter-indicator');
    const valueDisplay = document.querySelector('.meter-value');
    
    if (meter && valueDisplay) {
      // Convert value to percentage (0-100%)
      // -200 = 0%, +100 = 100%
      const percentage = ((value + 200) / 300) * 100;
      meter.style.left = percentage + '%';
      
      // Update display value
      valueDisplay.textContent = (value >= 0 ? '+' : '') + value;
      
      // Color code the value
      if (value < -100) {
        valueDisplay.style.color = '#b22222'; // crisis red
      } else if (value < 0) {
        valueDisplay.style.color = '#ff8c00'; // warning amber
      } else if (value < 50) {
        valueDisplay.style.color = '#ffcc00'; // neutral yellow
      } else {
        valueDisplay.style.color = '#2d5016'; // stability green
      }
    }
  }
  
  // Initialize stability meter if it exists
  const initialStability = document.querySelector('[data-stability]');
  if (initialStability) {
    updateStabilityMeter(parseInt(initialStability.dataset.stability));
  }
  
  // ==========================
  // Active Navigation Highlighting
  // ==========================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        currentPath.includes(link.getAttribute('href').replace('.html', ''))) {
      link.classList.add('active');
    }
  });
  
  // ==========================
  // Dynamic Timeline Date Highlighting
  // ==========================
  const timelineEvents = document.querySelectorAll('.timeline-event');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, { threshold: 0.1 });
  
  timelineEvents.forEach(event => {
    event.style.opacity = '0';
    event.style.transform = 'translateX(-20px)';
    event.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(event);
  });
  
  // ==========================
  // Search/Filter Functionality (for faction pages)
  // ==========================
  const searchInput = document.querySelector('#faction-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const factionCards = document.querySelectorAll('.faction-card');
      
      factionCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  // ==========================
  // Back to Top Button
  // ==========================
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: var(--weimar-red);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(backToTop);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  backToTop.addEventListener('mouseenter', function() {
    this.style.backgroundColor = 'var(--crisis-red)';
    this.style.transform = 'scale(1.1)';
  });
  
  backToTop.addEventListener('mouseleave', function() {
    this.style.backgroundColor = 'var(--weimar-red)';
    this.style.transform = 'scale(1)';
  });
});

// ==========================
// Expose functions for external use
// ==========================
window.weimarSim = {
  updateStability: function(value) {
    const meter = document.querySelector('.meter-indicator');
    const valueDisplay = document.querySelector('.meter-value');
    
    if (meter && valueDisplay) {
      const percentage = ((value + 200) / 300) * 100;
      meter.style.left = percentage + '%';
      valueDisplay.textContent = (value >= 0 ? '+' : '') + value;
      
      if (value < -100) {
        valueDisplay.style.color = '#b22222';
      } else if (value < 0) {
        valueDisplay.style.color = '#ff8c00';
      } else if (value < 50) {
        valueDisplay.style.color = '#ffcc00';
      } else {
        valueDisplay.style.color = '#2d5016';
      }
    }
  }
};
