import styled from "@emotion/styled";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Modal, Switch, Typography } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { DataTableHeaderCell } from "./DataTable";

export type ListItem = { id: string; content: string };

type ModalProps = {
  open: boolean;
  handleClose: () => void;
  headerCells: DataTableHeaderCell<any>[];
  setHeaderCells: (items: DataTableHeaderCell<any>[]) => void;
};

const Container = styled.div`
  border-radius: 2px;
  padding: 0px 4px;
  margin-bottom: 8px;
  background-color: white;
`;

const boxShadow = {
  boxShadow: "2px 2px 5px -2px black",
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const style = {
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "6px",
  boxShadow: 24,
  p: 4,
};

const modalStyle = {
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column" as "column",
};

export const DataTableColumnSettingsModal: React.FC<ModalProps> = (props) => {
  const { t } = useTranslation();

  const dragEndHandler = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newHeaderCells = [...props.headerCells];
    const draggedCell = newHeaderCells.find((x) => x.id === draggableId);
    if (draggedCell) {
      newHeaderCells.splice(source.index, 1);
      newHeaderCells.splice(destination.index, 0, { ...draggedCell });
      props.setHeaderCells(newHeaderCells);
    }
  };

  const handleToggle = (cellId: string) => {
    const newHeaderCells = [...props.headerCells];
    const toggledCell = newHeaderCells.find((x) => x.id === cellId);
    if (toggledCell) {
      toggledCell.hidden = !toggledCell.hidden;
      props.setHeaderCells(newHeaderCells);
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={flexCenter}
    >
      <Box sx={{ ...style, ...modalStyle }}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          marginBottom={5}
        >
          {t("common:table-header-settings")}
        </Typography>
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="headerCellsDroppable">
            {(provided) => {
              return (
                <Container
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ ...boxShadow, overflow: "auto" }}
                >
                  {props.headerCells.map((cell, index) => (
                    <Draggable
                      draggableId={cell.id}
                      index={index}
                      key={cell.id}
                    >
                      {(provided) => {
                        return (
                          <Container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <DragHandleIcon />
                                {cell.label}
                              </div>
                              <Switch
                                checked={!cell.hidden}
                                onClick={() => handleToggle(cell.id)}
                              />
                            </div>
                          </Container>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Container>
              );
            }}
          </Droppable>
        </DragDropContext>
      </Box>
    </Modal>
  );
};
