import { Box, Typography } from "@mui/material";

interface PageSectionProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string | JSX.Element;
}

const PageSection: React.FC<PageSectionProps> = (props) => {
  return (
    <>
      <Box sx={{ mt: 6, mb: 3 }}>
        <Typography variant="h3" gutterBottom display="inline" mr={2}>
          {props.title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="light"
          gutterBottom
          display="inline"
        >
          {props.subtitle || ""}
        </Typography>
      </Box>
      {props.children}
    </>
  );
};

export default PageSection;
