<template>
  <div class="about-me">
    <div class="content">
        <div class="content-column">
            <h4>About Me</h4>
            <p>
              Hi there! I’m Alexander Udag, a web developer enthusiastic about coding
              and continuous improvement. I work with
              <strong>JavaScript</strong>, <strong>HTML</strong>, <strong>CSS</strong>,
              <strong>Python</strong>, and <strong>PHP</strong>
              to create modern, scalable web applications.
            </p>
            <br>
            <p>My skill set includes frameworks like
              <strong>Vue</strong>, <strong>React</strong>, and
              <strong>Laravel</strong>, as well as database management with
              <strong>MySQL</strong> and <strong>PostgreSQL</strong>. I enjoy learning
              new things, overcoming challenges, and growing both personally and
              professionally. For me, coding is not just about delivering results—it’s
              about crafting solutions I can be proud of.
            </p>
        </div>
        <div class="content-column">
          <div class="images">
            <div class="image-container hover-pointer">
                <img src="~/assets/images/corp.jpg" alt="my corporate image"/>
            </div>
            <div class="image-container hover-pointer">
                <img src="~/assets/images/sablay.jpg" alt="my corporate image"/>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutMe",
};
</script>
