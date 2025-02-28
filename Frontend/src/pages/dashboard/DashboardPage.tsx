import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

interface Metric {
  title: string;
  value: string | number;
}

const DashboardPage: React.FC = () => {
  const metrics: Metric[] = [
    { title: "Total Stock", value: 12000 },
    { title: "Available Bins", value: 350 },
    { title: "Orders Pending", value: 85 },
    { title: "Shipped Orders", value: 200 },
    { title: "Inbound Shipments", value: 15 },
    { title: "Damaged Items", value: 12 },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Dashboard
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{metric.title}</Typography>
                <Typography variant="h4" color="primary">
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
