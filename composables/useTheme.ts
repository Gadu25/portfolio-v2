import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('light') // Default theme

  onMounted(() => {

    console.log("mounted")
    // Retrieve the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    theme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  })

  const toggleTheme = () => {
    console.log("clicked", theme.value)
    // Toggle between light and dark themes
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  return { theme, toggleTheme }
}


// import { ref, onMounted } from 'vue';

// export function useTheme() {
//   const theme = ref('light'); // Default theme

//   onMounted(() => {
//     console.log("test");
//   });

//   // Function to toggle the theme
//   const toggleTheme = () => {
//     theme.value = theme.value === 'light' ? 'dark' : 'light';
//     document.documentElement.setAttribute('data-theme', theme.value);
//     localStorage.setItem('theme', theme.value);
//   };

//   // Return the theme and toggle function
//   return { theme, toggleTheme };
// }
