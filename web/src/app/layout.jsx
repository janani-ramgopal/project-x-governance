import "./global.css";

export const metadata = {
    title: "AI Governance MVP",
    description: "Model Registry + Governance Control Plane Demo"
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
          {children}
        </body>
      </html>
    );
  }
  