document.addEventListener("DOMContentLoaded", function () {
    const projectBoxes = document.querySelectorAll(".project-box");

    projectBoxes.forEach(box => {
        box.addEventListener("mouseenter", function () {
            box.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
            box.style.transform = "translateY(-5px) scale(1.02)";
            box.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
        });

        box.addEventListener("mouseleave", function () {
            box.style.transform = "translateY(0) scale(1)";
            box.style.boxShadow = "0px 5px 10px rgba(0, 0, 0, 0.1)";
        });
    });
});
