<template>
    <div id="particles-js"></div>
  </template>
  
  <script setup>

  onMounted(() => {
    const script = document.createElement("script");
        script.src = "/js/particles.js"; // Ensure the file is here
        script.onload = () => {
        window.particlesJS.load("particles-js", "/particles-config.json", () => {
            console.log("Particles.js loaded successfully.");
        });
        };
        script.onerror = () => {
        console.error("Failed to load particles.js");
        };
        document.head.appendChild(script);
  })
  </script>
  
  <style>
  #particles-js {
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
  }
  </style>
  