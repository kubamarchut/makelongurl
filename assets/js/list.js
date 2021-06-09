const els = document.querySelectorAll(".chapter>h2")
for (const el of els){
  const observer = new IntersectionObserver(
    ([e]) => {
      console.log(e);
      let elePos = e.target.getBoundingClientRect();
      let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      if(elePos.top < vh/2){
        e.target.classList.toggle("is-pinned", e.intersectionRatio < 1)
      }
    },
    { threshold: [1] }
  );

  observer.observe(el);
}
