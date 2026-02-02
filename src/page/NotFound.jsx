import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import NavBar from "../components/NavBar";
import { Footer } from "../components/Footer";
import Button from "../common/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4">
        <section className="flex flex-col items-center justify-center text-center">
          <CircleAlert className="w-16 h-16 md:w-20 md:h-20 text-brown-600 mb-6" strokeWidth={1.5} />
          <h1 className="text-headline-3 md:text-headline-2 font-semibold text-brown-600 mb-8">
            Page Not Found
          </h1>
          <Button onClick={() => navigate("/")}>
            Go To Homepage
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
