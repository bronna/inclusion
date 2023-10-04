<script>
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import "../styles/styles.css";
</script>

<div class="app">
  <!-- <Header /> -->

  <main>
    <slot />
  </main>

  <Footer />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem 2.5rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    main {
        padding: 1rem 1rem;
    }
  }
</style>
