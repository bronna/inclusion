<script>
  import Logo from "./Logo.svelte";
</script>

<footer>
  <!-- Resources -->

  <!-- Feedback -->

  <div class="footer-links">
    Contact us: inclusiondata@protonmail.com
  </div>

  <p>Created by: <a href="https://bronna.github.io/" target="_blank">Brianna Wilson</a></p>
  <p class="year">2023</p>

  <div class="logo">
    <Logo />
  </div>

  
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--dark-gray);
    color: white;
    padding-bottom: 2rem;
  }

  footer a {
    font-weight: bold;
    color: white;
  }

  @media (min-width: 480px) {
    footer {
      padding: 4rem 0;
    }
  }

  .logo {
    margin-top: 1rem;
  }

  .year {
    margin-top: 0rem;
  }
</style>