
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ events, onSelectSlot, onSelectEvent }) => {
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad';
    let borderColor = '#265985';
    let color = 'white';

    switch (event.resource.status) {
      case 'confirmed':
        backgroundColor = '#16a34a'; // green-600
        borderColor = '#15803d';
        break;
      case 'pending':
        backgroundColor = '#ca8a04'; // yellow-600
        borderColor = '#a16207';
        break;
      case 'canceled':
        backgroundColor = '#dc2626'; // red-600
        borderColor = '#b91c1c';
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color,
        borderRadius: '6px',
        opacity: 0.9,
        border: '0px',
        display: 'block',
        fontSize: '0.75rem',
        padding: '2px 4px'
      }
    };
  };

  return (
    <div className="h-[600px] bg-white rounded-xl shadow-lg border border-gray-100 p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        defaultView="month"
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há eventos neste período."
        }}
        culture='pt-BR'
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        popup
      />
    </div>
  );
};

export default CalendarView;
