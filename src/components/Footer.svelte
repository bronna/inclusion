<footer>
  <div class="footer-links">
    <a href="/about" class="footer-link">about</a>
    <a href="/contact" class="footer-link">contact</a>
  </div>

    <p>Created by <a href="https://bronna.github.io/" target="_blank">Brianna Wilson</a></p>
    <!-- <p>2023</p> -->
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--dark-gray);
    color: white;
  }

  footer a {
    font-weight: bold;
    color: white;
  }

  .footer-links {
    padding-top: 3rem;
  }

  .footer-link:not(:last-child)::after {
    content: "|";
    margin: 0 10px;  /* Adjust the space before and after the pipe as needed */
}
  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>