<template>
  <div class="about-me">
    <div class="content">
        <div class="content-column" data-aos="fade-up">
            <h3>About Me</h3>
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
          <div class="images" data-aos="fade-left">
            <div class="image-container hover-pointer" @mousemove="handleMouseMove" @mouseleave="resetTilt">
                <img src="~/assets/images/night.jpg" alt="my corporate image"/>
            </div>
            <div class="image-container hover-pointer" @mousemove="handleMouseMove" @mouseleave="resetTilt">
                <img src="~/assets/images/day.jpg" alt="my corporate image"/>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutMe",
  methods: {
    handleMouseMove(event) {
            const card = event.currentTarget.querySelector('img');
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 20;
            const rotateY = (x - centerX) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        },
        resetTilt(event) {
            const card = event.currentTarget.querySelector('img');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        },
  }
};
</script>
