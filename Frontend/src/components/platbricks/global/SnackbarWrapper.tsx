import { Snackbar } from "@mui/material";
import useAppSelector from "../../../hooks/useAppSelector";
import { snackbarData, SnackbarInfo } from "../../../redux/snackbar";

const SnackbarWrapper = () => {
  const snacks = useAppSelector(snackbarData);
  return (
    <>
      {snacks.map((snackbar: SnackbarInfo) => (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={true}
          onClose={() => {}}
          message={snackbar.message}
          key={snackbar.id}
        />
      ))}
    </>
  );
};
export default SnackbarWrapper;
