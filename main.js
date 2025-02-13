// Create a new Image object
const myImage = new Image();

// Enable cross-origin resource sharing
myImage.crossOrigin = "anonymous";

// Set image source from Cloudinary
myImage.src = "https://res.cloudinary.com/durtjwxjs/image/upload/v1730389734/imageedit_2_2929149285_hiqbnx.jpg";

// When image loads, start processing
myImage.addEventListener("load", function(){
   // Get canvas and context
   const canvas = document.getElementById("canvas1")
   const ctx = canvas.getContext("2d")
   
   // Set canvas dimensions
   canvas.width = 500
   canvas.height = 700;
   
   // Draw image on canvas
   ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
   
   // Get pixel data from image
   const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
   
   // Clear canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   
   // Initialize particles array
   let particlesArray = [];
   const numberOfParticles = 5000;

   // Create 2D array to store brightness values
   let mappedImage = [];

   // Calculate brightness for each pixel
   for(let y = 0; y < canvas.height; y++){
       let row = [];
       for(let x = 0; x< canvas.width; x++){
           // Get RGB values
           const green = pixels.data[(y * 4 * pixels.width) +(x *4)]
           const red = pixels.data[(y * 4 * pixels.width) +(x * 4 + 1 )]
           const blue = pixels.data[(y * 4 * pixels.width) +(x * 4 + 2)]

           // Calculate relative brightness
           const brightness = calculateRelativeBrightness(red, blue, green);
           const cell = [brightness];
           row.push(cell)
       }
       mappedImage.push(row);
   }

   // Calculate weighted brightness using RGB values
   function calculateRelativeBrightness(red, green, blue){
       return Math.sqrt(
           (red * red) * 0.299 + (green * green) * 0.587 + (blue * blue ) * 0.114
       ) / 100
   }

   // Particle class to create animated particles
   class Particle {
       constructor(){
           // Initialize particle properties
           this.x = Math.random() * canvas.width;
           this.y = Math.random() * canvas.height;
           this.y = 0

           this.speed = 0;
           this.velocity = Math.random() * 0.5
           this.size = Math.random() * 1.5 + 1;
           this.position1 = Math.floor(this.y);
           this.position2 = Math.floor(this.x);
       }

       // Update particle position based on brightness
       update(){
           this.position1 = Math.floor(this.y);
           this.position2 = Math.floor(this.x);
           
           // Keep particles within canvas bounds
           if(this.position1 >= canvas.height) this.position1 = canvas.height -1;
           if(this.position2 >= canvas.width) this.position2 = canvas.width - 1;
           
           // Update speed based on brightness
           this.speed = mappedImage[this.position1][this.position2][0];
           let movement = (2.5 - this.speed) + this.velocity;
           this.y += movement;
           
           // Reset particle when it reaches bottom
           if(this.y >= canvas.height){
               this.y = 0
               this.x = Math.random() * canvas.width;
           }
       }

       // Draw particle on canvas
       draw(){
           ctx.beginPath()
           ctx.fillStyle = 'white'
           ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
           ctx.fill();
       }
   }

   // Initialize particles
   function init(){
       for(let i = 0; i< numberOfParticles; i++){
           particlesArray.push(new Particle())
       }
   }

   // Animation loop
   function animate(){
       // Set transparency and background
       ctx.globalAlpha = 0.05;
       ctx.fillStyle = 'rgb(0, 0, 0)'
       ctx.globalAlpha = 0.02;
       ctx.fillRect(0, 0, canvas.width, canvas.height);

       // Update and draw all particles
       for(let i = 0; i < particlesArray.length; i++){
           particlesArray[i].update();
           particlesArray[i].draw();
       }
       
       // Continue animation loop
       requestAnimationFrame(animate)
   }

   // Start animation
   init();
   animate()
})