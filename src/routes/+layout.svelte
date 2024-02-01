<script>
  import Header from "../components/Header.svelte"
  import Footer from "../components/Footer.svelte"
  import "../styles/styles.css"
</script>

<div class="app">
  <Header />

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
    padding-top: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background-color: var(--background-color);
  }
</style>
