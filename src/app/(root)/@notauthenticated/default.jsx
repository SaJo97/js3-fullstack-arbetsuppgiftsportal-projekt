import { Poppins } from "next/font/google";
import { AuthFormView } from "./_componenets/auth-form-view";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
const AuthPage = () => {
  return (
    <div>
      <h2 className="text-center text-4xl max-w-2xl mx-auto my-20">
        Välkommen till <span className={poppins.className}>PlanHive</span>.
        Logga in för att fortsätta till sidan!
      </h2>
      <AuthFormView />
    </div>
  );
};
export default AuthPage;
