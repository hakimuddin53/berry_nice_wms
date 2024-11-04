import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

interface StatusWidgetProps {
  icon: any;
  iconColor: string;
  primaryText: string;
  secondaryText: string;
}

const StatusWidget = ({
  icon,
  iconColor,
  primaryText,
  secondaryText,
}: StatusWidgetProps) => {
  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        margin: 0,
        borderRadius: 4,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <IconButton
        aria-label="status"
        style={{
          padding: 0,
          marginTop: 1,
          marginLeft: 4,
          color: iconColor,
        }}
      >
        {icon}
      </IconButton>

      <CardContent
        style={{
          marginLeft: 8,
          flex: 1,
          padding: 0,
        }}
      >
        <Typography variant="body2" component="div">
          {primaryText}
        </Typography>
        <Typography variant="body2" fontWeight="bold" component="div">
          {secondaryText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatusWidget;
