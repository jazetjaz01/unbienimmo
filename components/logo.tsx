export const Logo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    width="40"
    height="40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Le tracé de la maison */}
    <path d="M1.5,8.66v2.86A6.68,6.68,0,0,0,8.18,18.2h0V22l6.68-3.82h1a6.68,6.68,0,0,0,6.68-6.68V8.66A6.68,6.68,0,0,0,15.82,2H8.18A6.68,6.68,0,0,0,1.5,8.66Z" />
    
    {/* La porte */}
    <rect x="9.14" y="9.61" width="5.73" height="4.77" />
    
    {/* Le toit */}
    <polygon points="12 5.79 8.18 9.61 15.82 9.61 12 5.79" />
  </svg>
);