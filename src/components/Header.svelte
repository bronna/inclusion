<script>
  import Logo from "./Logo.svelte";
</script>

<header>
  <Logo />
  <nav>
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
    padding: 2rem 3rem; /* Adjusted for uniform padding */
    background-color: var(--background-color);
  }

  nav {
    display: flex;
    align-items: center;
    gap: 2rem; /* Creates space between navigation links */
  }

  nav a {
    text-decoration: none;
    color: var(--text-color); /* Replace with your color variable */
    font-weight: bold; /* Optional: Adjusts the font weight of nav links */
    line-height: 1.2;
  }

  .attention {
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
