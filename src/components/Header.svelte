<script>
  // import { writable } from 'svelte/store'
  import Logo from "./Logo.svelte"

  // const menuOpen = writable(false)
  let menuOpen = false
</script>

<header>
  <Logo />

  <button
    on:click={() => menuOpen = !menuOpen}
    class="hamburger"
  >
    ☰
  </button>

  {#if menuOpen}
    <nav class="mobile-nav show">
      <button on:click={() => menuOpen = false} class="close-btn">x</button>
      <a href="/about">About</a>
      <a href="/resources">Resources</a>
      <a href="/contact">Contact</a>
      <a href="/subscribe" class="attention">Stay Updated</a>
    </nav>
  {/if}

  <nav class="nav-links">
    <a href="/about">About</a>
    <a href="/resources">Resources</a>
    <a href="/contact">Contact</a>
    <a href="/subscribe" class="attention">Stay Updated</a>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between; /* Aligns Logo to left and nav to right */
    align-items: center;
    padding: 2rem 2rem;
    background-color: var(--background-color);
  }

  @media (max-width: 768px) {
    header {
      padding: 2rem 1rem;
    }
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-color);
  }

  /* Apply horizontal layout with margins as fallback */
  .nav-links, .mobile-nav {
    display: flex;
    flex-direction: row;
    margin-right: -1rem; /* Negate the margin for the last item */
    align-items: center;
  }
  
  .nav-links a, .mobile-nav a {
    margin-right: 1rem; /* Fallback spacing */
  }

  /* Remove margin for the last item */
  .nav-links a:last-child, .mobile-nav a:last-child {
    margin-right: 0;
  }

  /* Specific styles for mobile navigation */
  .mobile-nav {
    flex-direction: column; /* Stack vertically on mobile */
    display: none; /* Start hidden and show based on menuOpen */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    background-color: rgba(244, 241, 240, 0.94);
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    z-index: 10;
  }
  
  .mobile-nav.show {
    display: flex; /* Show mobile nav when menu is open */
  }

  .close-btn {
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 2rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color);
    margin-bottom: 1rem; /* Space below the close button */
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }

    .hamburger {
      display: block;
    }
  }

  /* Use gap for browsers that support it and reset fallback margins */
  @supports (gap: 1rem) {
    .nav-links, .mobile-nav {
      gap: 1rem;
      margin-right: 0; /* Reset the negative margin when gap is supported */
    }
    .nav-links a, .mobile-nav a {
      margin-right: 0; /* Reset margin for horizontal layout */
    }
    .mobile-nav {
      flex-direction: column; /* Ensure mobile nav remains vertical */
    }
  }

  .nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: bold;
    line-height: 1.2;
  }

  .nav-links .attention {
    background-color: var(--separate-color);
    color: var(--background-color);
    padding: 0.25rem 0.7rem;
    border: 2px solid var(--color-text);
    border-radius: 90px;
    transition: background-color 0.3s;
    display: inline-block;
    text-align: center;
    opacity: 0.85;
  }
</style>
