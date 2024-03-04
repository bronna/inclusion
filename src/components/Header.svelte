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

  .nav-links {
    display: flex;
    /* gap: 2rem; */
    flex-direction: row;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    /* gap: 1rem; */
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    transition: left 0.3s ease;
    background-color: rgba(244, 241, 240, 0.9);
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    z-index: 10;
  }

  .mobile-nav.show {
    right: 0;
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-color);
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none !important;
    }

    .hamburger {
      display: block !important;
    }

    /* When menuOpen is true, the mobile nav is displayed */
    .mobile-nav {
      display: flex;
    }
  }

  /* Apply gap for browsers that support it */
  @supports (gap: 1rem) {
    .nav-links, .mobile-nav {
      gap: 1rem;
    }
    .nav-links a, .mobile-nav a {
      margin-bottom: 0; /* Reset margin if gap is supported */
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem; /* Creates space between navigation links */
  }

  .nav-links a {
    text-decoration: none;
    color: var(--text-color); /* Replace with your color variable */
    font-weight: bold; /* Optional: Adjusts the font weight of nav links */
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .nav-links .attention {
    background-color: var(--separate-color); /* Replace with your color variable */
    color: var(--background-color); /* Replace with your color variable */
    padding: 0.25rem 0.7rem; /* Adjusted for uniform padding */
    border: 2px solid var(--color-text);
    border-radius: 90px; /* Optional: Adds rounded corners to the button */
    transition: var(--background-color) 0.3s;
    display: inline-block;
    text-align: center;
    opacity: 0.85;
  }
</style>
