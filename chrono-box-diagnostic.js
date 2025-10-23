// Chrono-Box Diagnostic Script
// Add this to any page to diagnose chrono-box loading issues
// Usage: Copy and paste into browser console, or add as a script tag

(function() {
  'use strict';
  
  // Create persistent diagnostic display
  const createDiagnosticPanel = () => {
    let panel = document.getElementById('chrono-diagnostic-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'chrono-diagnostic-panel';
      panel.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #000;
        color: #0f0;
        padding: 10px;
        z-index: 999999999;
        max-height: 50vh;
        overflow-y: auto;
        font-family: monospace;
        font-size: 10px;
        border-bottom: 3px solid #0f0;
      `;
      
      if (document.body) {
        document.body.insertBefore(panel, document.body.firstChild);
      } else {
        setTimeout(() => document.body.insertBefore(panel, document.body.firstChild), 100);
      }
    }
    return panel;
  };
  
  const log = (msg, isError = false) => {
    const panel = createDiagnosticPanel();
    const entry = document.createElement('div');
    entry.style.cssText = `
      margin: 2px 0;
      padding: 3px 0;
      ${isError ? 'color: #f00; font-weight: bold;' : 'color: #0f0;'}
    `;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    panel.appendChild(entry);
    panel.scrollTop = panel.scrollHeight;
    
    if (isError) {
      console.error(msg);
    } else {
      console.log(msg);
    }
  };
  
  log('🔍 CHRONO-BOX DIAGNOSTIC STARTED');
  log('═══════════════════════════════');
  
  // Environment info
  log(`User Agent: ${navigator.userAgent}`);
  log(`Screen: ${screen.width}x${screen.height}`);
  log(`Viewport: ${innerWidth}x${innerHeight}`);
  log(`URL: ${location.href}`);
  
  // Check browser capabilities
  log('');
  log('BROWSER CAPABILITIES:');
  log(`• Worker API: ${typeof Worker !== 'undefined' ? '✅' : '❌ MISSING'}`);
  log(`• ES6 Modules: ${typeof import !== 'undefined' ? '✅' : '❌ MISSING'}`);
  log(`• crypto.randomUUID: ${typeof crypto?.randomUUID === 'function' ? '✅' : '❌ MISSING'}`);
  log(`• BroadcastChannel: ${typeof BroadcastChannel !== 'undefined' ? '✅' : '❌ MISSING'}`);
  log(`• MutationObserver: ${typeof MutationObserver !== 'undefined' ? '✅' : '❌ MISSING'}`);
  
  // Check for chrono-box blocks
  const findChronoBoxes = () => {
    const blocks = document.querySelectorAll('[data-block-name="chrono-box"], .chrono-box, [class*="chrono"]');
    log('');
    log(`CHRONO-BOX BLOCKS: Found ${blocks.length}`);
    blocks.forEach((block, i) => {
      log(`  Block ${i + 1}:`);
      log(`    - Tag: ${block.tagName}`);
      log(`    - Class: ${block.className || 'none'}`);
      log(`    - data-block-name: ${block.dataset.blockName || 'none'}`);
      log(`    - data-block-status: ${block.dataset.blockStatus || 'none'}`);
      log(`    - Visible: ${block.offsetWidth > 0 && block.offsetHeight > 0 ? 'Yes' : 'No'}`);
      log(`    - innerHTML length: ${block.innerHTML.length}`);
    });
    return blocks;
  };
  
  const blocks = findChronoBoxes();
  
  // Check if chrono-box module is loaded
  log('');
  log('MODULE STATUS:');
  
  // Check for module loading markers
  const moduleMarker = document.getElementById('chrono-box-loaded-marker');
  if (moduleMarker) {
    log('✅ Module loaded marker found');
  } else {
    log('❌ Module loaded marker NOT found');
  }
  
  const debugLog = document.getElementById('chrono-box-debug-log');
  if (debugLog) {
    log('✅ Debug log container found');
    log(`  - Entries: ${debugLog.children.length}`);
  } else {
    log('❌ Debug log container NOT found');
  }
  
  // Check sessionStorage
  log('');
  log('SESSION STORAGE:');
  const tabId = sessionStorage.getItem('chrono-box-tab-id');
  if (tabId) {
    log(`✅ Tab ID: ${tabId}`);
  } else {
    log('⚠️  No tab ID found (normal if chrono-box hasn\'t initialized)');
  }
  
  // Check metadata
  log('');
  log('METADATA:');
  if (typeof window.getMetadata === 'function') {
    log('✅ getMetadata function exists');
    const schedulesMetadata = window.getMetadata('schedules');
    if (schedulesMetadata) {
      try {
        const schedules = JSON.parse(schedulesMetadata);
        const scheduleIds = Object.keys(schedules);
        log(`✅ Schedules metadata found: ${scheduleIds.length} schedule(s)`);
        scheduleIds.forEach(id => log(`  - ${id}`));
      } catch (e) {
        log(`❌ Error parsing schedules: ${e.message}`, true);
      }
    } else {
      log('⚠️  No schedules metadata found');
    }
  } else {
    log('❌ getMetadata function NOT found', true);
  }
  
  // Try to check if scripts are loaded
  log('');
  log('LOADED SCRIPTS:');
  const scripts = Array.from(document.getElementsByTagName('script'));
  const chronoScripts = scripts.filter(s => s.src && s.src.includes('chrono'));
  log(`Total scripts: ${scripts.length}`);
  log(`Chrono-related scripts: ${chronoScripts.length}`);
  chronoScripts.forEach(s => log(`  - ${s.src}`));
  
  // Watch for DOM changes
  log('');
  log('MONITORING DOM CHANGES...');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.matches && node.matches('[data-block-name="chrono-box"]')) {
            log(`📍 Chrono-box block added to DOM!`);
          }
          if (node.id === 'chrono-box-loaded-marker') {
            log('📍 Module marker added - chrono-box.js loaded!');
          }
          if (node.id === 'chrono-box-debug-log') {
            log('📍 Debug log container added!');
          }
        }
      });
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Re-scan after a delay
  setTimeout(() => {
    log('');
    log('═══════════════════════════════');
    log('RE-SCANNING AFTER 2 SECONDS...');
    findChronoBoxes();
    
    const marker = document.getElementById('chrono-box-loaded-marker');
    const debug = document.getElementById('chrono-box-debug-log');
    
    if (!marker && !debug) {
      log('');
      log('❌ DIAGNOSIS: Chrono-box module NOT loaded', true);
      log('   Possible causes:', true);
      log('   1. No chrono-box blocks in HTML', true);
      log('   2. Blocks not detected by page loader', true);
      log('   3. JavaScript error preventing module load', true);
      log('   4. Module import path incorrect', true);
    } else if (marker && !debug) {
      log('');
      log('⚠️  DIAGNOSIS: Module loaded but debugLog not called', true);
      log('   This means file loaded but init not called', true);
    } else if (debug) {
      log('');
      log('✅ DIAGNOSIS: Chrono-box appears to be running!');
    }
  }, 2000);
  
  log('');
  log('═══════════════════════════════');
  log('Diagnostic script ready. Monitoring...');
})();

