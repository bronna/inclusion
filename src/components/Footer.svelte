<script>
  import Logo from "./Logo.svelte";
</script>

<footer>
  <!-- Resources -->

  <!-- Feedback -->

  <span class="label">
    inclusiondata@protonmail.com
  </span>

  <span class="label">
    created by <a href="https://bronna.github.io/" target="_blank">Brianna Wilson</a>
  </span> 

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
    padding-bottom: 4rem;
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

  .label {
    font-size: 0.95rem;
    letter-spacing: 0.025rem;
    margin-top: 0.4rem;
  }

  .logo {
    margin-top: 2rem;
  }
</style>