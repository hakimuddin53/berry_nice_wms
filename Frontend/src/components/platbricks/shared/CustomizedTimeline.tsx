import { TimelineContent } from "@mui/lab";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Box, Typography } from "@mui/material";
import React, { Fragment } from "react";
import UserDateTime from "./UserDateTime";

export interface TimelineObject {
  date: string;
  primaryText: string;
  secondaryText: React.ReactNode;
  primaryEditText?: string;
}

const CustomizedTimeline: React.FC<{
  timeline: TimelineObject[];
}> = (props) => {
  return (
    <Fragment>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
          padding: 0,
          m: 0,
        }}
      >
        {props.timeline
          .sort((a, b) => (!a.date || a.date < b.date ? 1 : -1))
          .map((t, i, o) => (
            <TimelineItem key={i}>
              <TimelineOppositeContent
                sx={{ m: 1 }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                <UserDateTime date={t.date} />
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {i < o.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h5">{t.primaryText}</Typography>
                  {t.primaryEditText && (
                    <Typography
                      color="text.secondary"
                      sx={{ fontStyle: "italic", m: 1 }}
                    >
                      {t.primaryEditText}
                    </Typography>
                  )}
                </Box>
                <Typography color="text.secondary">
                  {t.secondaryText}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
    </Fragment>
  );
};

export default CustomizedTimeline;
