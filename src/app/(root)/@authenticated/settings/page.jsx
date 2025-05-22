import { Settings } from "./_components/settings";

const SettingsPage = () => {
  return (
    <div className="pb-10 pt-5">
      <div className="mb-10">
        <p className="font-semibold text-xl text-center">Profilinställningar</p>
        <p className="text-sm text-muted-foreground text-center">
          Här kan du ändra ditt användarnamn, lösenord och färgtema
        </p>
      </div>
      <Settings />
    </div>
  );
};
export default SettingsPage;
