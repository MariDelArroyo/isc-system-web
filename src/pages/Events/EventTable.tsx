import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import ContainerPage from "../../components/common/ContainerPage";
import { getEventsInformationsService } from "../../services/eventsService";
import { EventInformations } from "../../models/eventInterface";

const EventTable = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<EventInformations[]>();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchEvents = async () => {
    const res = await getEventsInformationsService();
    if (res.success) {
      setEvents(res.data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "start_date",
      headerName: "Fecha Inicio",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params: any) =>
        dayjs(params.startDate).format("DD/MM/YYYY"),
    },
    {
      field: "title",
      headerName: "Nombre del Evento",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "responsible_intern_id",
      headerName: "Supervisor del evento",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "pending_interns",
      headerName: "Solicitudes de Becarios",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accepted_interns",
      headerName: "Becarios Seleccionados",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            aria-label="ver"
            onClick={() => handleView(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="editar"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="eliminar"
            onClick={() => handleClickOpen(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleView = (id: number) => {
    navigate(`/interns`);
  };

  const handleEdit = (id: string) => {
    navigate(`/editEvent/${id}`);
  };

  const handleClickOpen = (id: number, name: string) => {
    setSelectedId(id);
    setSelectedEventName(name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
    setSelectedEventName("");
  };

  const handleDelete = async () => {
    // TODO: add actual delete event logic
    setOpen(false);
  };

  return (
    <ContainerPage
      title="Lista de Eventos"
      subtitle="Resumen de los eventos programados y sus detalles"
      actions={
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateEvent}
          startIcon={<AddIcon />}
        >
          Agregar evento
        </Button>
      }
    >
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={events || []}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          classes={{
            root: "bg-white dark:bg-gray-800",
            columnHeader: "bg-gray-200 dark:bg-gray-800 ",
            cell: "bg-white dark:bg-gray-800",
            row: "bg-white dark:bg-gray-800",
            columnHeaderTitle: "!font-bold text-center",
          }}
          pageSizeOptions={[5, 10]}
        />
        <Dialog
          open={open}
          onClose={(_, reason) => {
            if (reason !== "backdropClick") { 
              handleClose();
            }
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: '8px 16px' }} 
          >
            <Typography sx={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
              Confirmar eliminación
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: '16px' }}>
            <Typography variant="body1" align="center">
              ¿Estás seguro de eliminar el evento "{selectedEventName}"? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", padding: '8px 16px', gap: '8px' }}>
            <Button
              onClick={handleClose}
              color="primary"
              variant="contained"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                minWidth: '80px',
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              sx={{
                backgroundColor: "red",
                color: "white",
                fontWeight: 'bold',
                minWidth: '80px',
                "&:hover": { backgroundColor: "darkred" },
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ContainerPage>
  );
};

export default EventTable;
