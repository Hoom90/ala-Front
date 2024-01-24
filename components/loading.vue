<template>
  <div id="loading">
    <svg width="124" height="124" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>
    <h1>لطفا منتظر بمانید...</h1>
  </div>
</template>

<style scoped>
div#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99999;
  background: rgb(62 62 62 / 50%);
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
}
div#loading svg{margin-bottom: 3%}

</style>